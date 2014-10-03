from django.db import models

from .query import MediacatQuerySet


class MediacatManager(models.Manager):

    def defer_media(self):
        return self.get_queryset().defer_media()

    def get_queryset(self):
        return MediacatQuerySet(self.model, using=self._db)
