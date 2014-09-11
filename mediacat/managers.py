from django.db import models

from .query import MediacatQuerySet


class MediacatManager(models.Manager):

    def get_queryset(self):
        return MediacatQuerySet(self.model, using=self._db)
