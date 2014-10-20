from collections import defaultdict

from django.contrib.contenttypes.models import ContentType
from django.db.models.query import QuerySet

from .fields import MediaField
from .models import ImageCropApplication


class MediacatQuerySet(QuerySet):

    def __init__(self, *args, **kwargs):
        self._defer_media = False
        super(MediacatQuerySet, self).__init__(*args, **kwargs)

    def _clone(self, *args, **kwargs):
        clone = super(MediacatQuerySet, self)._clone(*args, **kwargs)
        clone._defer_media = self._defer_media
        return clone

    def defer_media(self):
        clone = self._clone()
        clone._defer_media = True
        return clone

    def attach_media(self, objects):
        ids = [o.pk for o in objects]
        ct = ContentType.objects.get_for_model(self.model)

        all_applications = ImageCropApplication \
            .objects \
            .select_related('crop', 'crop__image') \
            .filter(
                object_id__in=ids,
                content_type=ct
            )

        applications_dict = defaultdict(list)

        for a in all_applications:
            applications_dict[a.object_id].append(a)

        for instance in objects:
            raw_applications = applications_dict[instance.pk]
            applications = {a.field_name: a.crop for a in raw_applications}
            setattr(instance, MediaField.get_cache_name(), applications)

        return objects

    def iterator(self):
        base_iter = super(MediacatQuerySet, self).iterator()

        while True:
            base_result_objects = []
            reached_end = False

            for i in range(100):
                try:
                    o = next(base_iter)
                    base_result_objects.append(o)
                except StopIteration:
                    reached_end = True
                    break

            if not self._defer_media:
                real_results = self.attach_media(base_result_objects)
            else:
                real_results = base_result_objects

            for o in real_results:
                yield o

            if reached_end:
                raise StopIteration
