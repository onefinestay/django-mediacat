# Pure-python PNG parser
# Copyright (c) 2013 Thomas P. Robitaille

import struct

PNG_SIGNATURE = b'\x89\x50\x4e\x47\x0d\x0a\x1a\x0a'


def is_png(file):
    return file.read(8) == b'\x89\x50\x4e\x47\x0d\x0a\x1a\x0a'


class PNGChunk(object):

    @classmethod
    def read(cls, fileobj):

        self = cls()

        # Read in chunk length
        length = struct.unpack('>I', fileobj.read(4))[0]

        # Read in chunk type
        self.type = fileobj.read(4)

        # Read in data
        self.data = fileobj.read(length)

        # Read in CRC
        crc = struct.unpack('>I', fileobj.read(4))[0]

        # Check that the CRC matches the actual one
        if crc != self.crc:
            raise ValueError("CRC ({0}) does not match advertised ({1})".format(self.crc, crc))

        if length != self.length:
            raise ValueError("Dynamic length ({0}) does not match original length ({1})".format(self.length, length))

        return self

    def write(self, fileobj):

        # Write length
        fileobj.write(struct.pack('>I', self.length))

        # Write type
        fileobj.write(self.type)

        # Write data
        fileobj.write(self.data)

        # Write CRC
        fileobj.write(struct.pack('>I', self.crc))

    @property
    def crc(self):
        # Note from Python docs: "To generate the same numeric value across all
        # Python versions and platforms use crc32(data) & 0xffffffff. If you
        # are only using the checksum in packed binary format this is not
        # necessary as the return value is the correct 32bit binary
        # representation regardless of sign."
        # This is indeed true, I see different values in Python 2 and 3.
        from zlib import crc32
        return crc32(self.type + self.data) & 0xffffffff

    @property
    def length(self):
        return len(self.data)


class PNGFile(object):

    @classmethod
    def read(cls, fileobj):

        self = cls()

        # Read signature
        sig = fileobj.read(8)

        if sig != PNG_SIGNATURE:
            raise ValueError("Signature ({0}) does match expected ({1})".format(sig, PNG_SIGNATURE))

        self.chunks = []

        while True:
            chunk = PNGChunk.read(fileobj)
            self.chunks.append(chunk)
            if chunk.type == b'IEND':
                break

        return self
