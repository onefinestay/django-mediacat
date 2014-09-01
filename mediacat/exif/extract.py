from PIL import Image
from PIL.ExifTags import TAGS
import json

def extract_exif_data(image):
    image.seek(0)
    im = Image.open(image)
    exif_data = {
        TAGS.get(tag, tag): value for tag, value in im._getexif().items()
    }
    return json.dumps(exif_data)
