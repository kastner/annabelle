#!/bin/bash

# Fetch and process an image, making it ready for doodling

curl -L $1 -o $2
convert -resize 75x75 +dither -posterize 4 $2 PNG32:$2.png