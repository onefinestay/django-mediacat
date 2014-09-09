from django import forms


class MediaFormField(forms.ModelChoiceField):

    def __init__(self, crop_key=None, field=None, *args, **kwargs):
        self.crop_key = crop_key
        self.field = field
        super(MediaFormField, self).__init__(*args, **kwargs)

    def widget_attrs(self, widget):
        attrs = super(MediaFormField, self).widget_attrs(widget)
        extra_attrs = {
            'data-mediafield': 'true',
            'data-ofs-component': 'mediafield',
        }

        if self.crop_key:
            extra_attrs['data-crop-key'] = self.crop_key
        attrs.update(extra_attrs)
        return attrs
