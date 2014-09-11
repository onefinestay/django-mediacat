from collections import defaultdict

from django.contrib.contenttypes.models import ContentType
from django.db.models.query import QuerySet

from .fields import MediaFieldMixin
from .models import ImageCropApplication


class MediacatQuerySet(QuerySet):

    def attach_media(self, objects):
        media_fields = [f for f in self.model._meta.virtual_fields if isinstance(f, MediaFieldMixin)]
        media_field_names = [f.name for f in media_fields]
        ids = [o.pk for o in objects]

        ct = ContentType.objects.get_for_model(self.model)

        applications = ImageCropApplication.objects.select_related('crop', 'crop__image').filter(
            object_id__in=ids,
            content_type=ct,
            field_name__in=media_field_names
        )
        applications_dict = defaultdict(list)

        for a in applications:
            applications_dict[a.object_id].append(a)

        for o in objects:
            for a in applications_dict[o.pk]:
                attr_name = '_mediacat_crop_{}'.format(a.field_name)
                setattr(o, attr_name, a.crop)

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

            real_results = self.attach_media(base_result_objects)

            for o in real_results:
                yield o

            if reached_end:
                raise StopIteration
