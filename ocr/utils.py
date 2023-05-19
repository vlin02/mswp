
import json
import numpy as np
from PIL import Image

BORDER_COLOR = [135, 175, 58]
WHITE = [255, 255, 255]

EASY = (8, 10, 45)
MEDIUM = (14, 18, 30)
HARD = (20, 24, 25)

def load_canvas(diff, path: str):
    (h, w, s) = diff
    arr = np.asarray(json.load(open("./data/formats/" + path)), dtype="uint8")
    shape = [arr.shape[0]] if len(arr.shape) == 2 else []
    shape.extend([h * s, w * s, 4])
    return arr.reshape(*shape)[..., :3]


def white_fill(h, w):
    return np.full((h, w, 3), 255).astype(np.uint8)


def show_img(img):
    Image.fromarray(img).show()


def copy_img(from_img, from_cord, to_img, to_cord, size):
    fx, fy = from_cord
    tx, ty = to_cord
    dx, dy = size
    to_img[tx : tx + dx, ty : ty + dy] = from_img[fx : fx + dx, fy : fy + dy]
