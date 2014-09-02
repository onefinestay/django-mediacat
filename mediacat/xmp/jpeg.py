# Pure-python JPEG parser
# Copyright (c) 2013 Thomas P. Robitaille

# Define common markers

MARKERS = {}
MARKERS[b'\xd8'] = 'SOI'
MARKERS[b'\xc0'] = 'SOF0'
MARKERS[b'\xc2'] = 'SOF2'
MARKERS[b'\xc4'] = 'DHT'
MARKERS[b'\xdb'] = 'DQT'
MARKERS[b'\xdd'] = 'DRI'
MARKERS[b'\xda'] = 'SOS'
MARKERS[b'\xd0'] = 'RST0'
MARKERS[b'\xd1'] = 'RST1'
MARKERS[b'\xd2'] = 'RST2'
MARKERS[b'\xd3'] = 'RST3'
MARKERS[b'\xd4'] = 'RST4'
MARKERS[b'\xd5'] = 'RST5'
MARKERS[b'\xd6'] = 'RST6'
MARKERS[b'\xd7'] = 'RST7'
MARKERS[b'\xe0'] = 'APP0'
MARKERS[b'\xe1'] = 'APP1'
MARKERS[b'\xe2'] = 'APP2'
MARKERS[b'\xe3'] = 'APP3'
MARKERS[b'\xe4'] = 'APP4'
MARKERS[b'\xe5'] = 'APP5'
MARKERS[b'\xe6'] = 'APP6'
MARKERS[b'\xe7'] = 'APP7'
MARKERS[b'\xe8'] = 'APP8'
MARKERS[b'\xe9'] = 'APP9'
MARKERS[b'\xfe'] = 'COM'
MARKERS[b'\xd9'] = 'EOI'

# Define some markers which are always followed by variable-length data

VARIABLE = ['APP0', 'APP1', 'APP2', 'APP3', 'APP4',
            'APP5', 'APP6', 'APP7', 'APP8', 'APP9']


def is_jpeg(file):
    return file.read(4) == b'\xff\xd8\xff\xe0'


class JPEGSegment(object):

    @classmethod
    def from_bytes(cls, bytes):
        self = cls()
        if bytes[1:2] in MARKERS:
            self.type = MARKERS[bytes[1:2]]
        else:
            self.type = "UNKNOWN"
        self.bytes = bytes
        return self

    def write(self, fileobj):
        fileobj.write(self.bytes)


class JPEGFile(object):

    @classmethod
    def read(cls, fileobj):

        contents = fileobj.read()

        self = cls()

        # Search for all starts of segments. Segments all start with 0xff, but
        # we should ignore 0xff instances that are followed by 0x00.

        self.segments = []

        start = end = 0
        while True:
            if contents[start + 1:start + 2] in MARKERS and MARKERS[contents[start + 1:start + 2]] in VARIABLE:
                end = contents.find(b'\xff', end + 4)
            else:
                end = contents.find(b'\xff', end + 1)
            if end == -1 or contents[end + 1:end + 2] not in [b'\xff', b'\x00']:
                if end == -1:
                    end = len(contents) + 1
                self.segments.append(JPEGSegment.from_bytes(contents[start:end]))
                if end == len(contents) + 1:
                    break
                else:
                    start = end

        if self.segments[0].type != 'SOI':
            raise ValueError("Image did not start with SOI but with {0}".format(self.segments[0].type))

        if self.segments[-1].type != 'EOI':
            raise ValueError("Image did not end with EOI but with {0}".format(self.segments[-1].type))

        return self
