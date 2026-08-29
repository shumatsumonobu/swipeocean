"""Background removal helper for normalize-character.mjs"""
import sys
from rembg import remove
from PIL import Image

input_path = sys.argv[1]
output_path = sys.argv[2]

img = Image.open(input_path)
result = remove(img)
result.save(output_path)
