django-mediacat - The best way to store pictures of cats
========================================================

Mediacat is an opinionated Media Library for Django, lovingly extracted from the codebase of onefinestay.

It's not quite ready yet, but here's a screenshot of the current state of play:

![Mediacat Screenshot](docs/screenshot.png?raw=true)

## Data Model

Mediacat is built around around two major models, Images and Crops. An Image represents an original uploaded file, along with some metadata, and a Crop represents a rectangular subsection of a specific image. Crops are also constrained to being one of a number of developer-defined ratios.

A crop can be attached to the model through the use of a `MediaField`. A MediaField looks like a regular Django model field, with some extra magic that happens in the background:

````
from django.db import models
from mediacat.fields import MediaField

class Foo(models.Model):
    ...
    field_name = MediaField('PORTRAIT', width=2000)
````

Rather than using a foreign key as a column in the parent model's database, Mediacat instead has an `ImageCropApplication` model which stores the relationship instead. The reasoning behind this unconventional apporach is to simplify the database joins required to render a list of Django models that may have multiple `MediaField`s.

Mediacat also provides the facade of a category structure, in reality the categories are defined as a hierarchy of your application's models, and images are associated with the models via an intermediate `ImageAssocation` model. This is the second unconventional design decision, made because it let us avoid the problem of having to keep a hierarchy of categories in sync with our business models.
