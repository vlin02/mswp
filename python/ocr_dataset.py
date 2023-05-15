from collections import Counter, defaultdict
import json
import random
import numpy as np
from PIL import Image

LIGHT_0 = (0, 0)
LIGHT_1 = (0, 1)
LIGHT_2 = (0, 2)
LIGHT_3 = (0, 3)
LIGHT_4 = (0, 4)
LIGHT_5 = (0, 5)
LIGHT_6 = (0, 6)
LIGHT_7 = (0, 7)
LIGHT_UNREVEALED = (0, 8)
LIGHT_FLAG = (0, 9)
DARK_0 = (1, 0)
DARK_1 = (1, 1)
DARK_2 = (1, 2)
DARK_3 = (1, 3)
DARK_4 = (1, 4)
DARK_5 = (1, 5)
DARK_6 = (1, 6)
DARK_7 = (1, 7)
DARK_UNREVEALED = (1, 8)
DARK_FLAG = (1, 9)

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


def build_palette(diff, root, border_color, samples):
    _, _, s = diff
    supported = set()
    palette = white_fill(2 * s, 10 * s)
    for i, sample in enumerate(samples):
        canvas = load_canvas(diff, root + "/" + f"{i}.json")
        for (i, j), (i1, j1) in sample:
            if (i1, j1) in supported:
                raise Exception(f"already found instance of {i1}, {j1}")
            supported.add((i1, j1))
            copy_img(canvas, (i * s, j * s), palette, (i1 * s, j1 * s), (s, s))

    N, M, _ = palette.shape
    for i in range(N):
        for j in range(M):
            if np.array_equal(palette[i, j], border_color):
                palette[i, j] = palette[i, 0]

    return palette, supported


def build_indicator_dataset(diff, palette, supported, border_width):
    h, w, s = diff

    unique_indicators = {}
    for j in range(8):
        indicators = set()
        for i in range(2):
            if (i, j) not in supported:
                continue

            for dx in range(s):
                for dy in range(s):
                    x, y = i * s + dx, j * s + dy
                    rgb = tuple(palette[x, y].tolist())
                    indicators.add((dx, dy, *rgb))
        for to_cords in indicators:
            if to_cords in unique_indicators:
                unique_indicators[to_cords] = None
            else:
                unique_indicators[to_cords] = j
    unique_indicators = {k: v for k, v in unique_indicators.items() if v is not None}

    not_n_indicators = defaultdict(list)
    for j in range(1, 8):
        indicators = set()
        for i in range(2):
            if (i, j) not in supported:
                continue

            for dx in range(s):
                for dy in range(s):
                    x, y = i * s + dx, j * s + dy
                    if not np.array_equal(palette[x, y], palette[x, dy]):
                        rgb = tuple(palette[x, dy].tolist())
                        indicators.add((dx, dy, *rgb))

        for indicator in indicators:
            not_n_indicators[indicator].append(j)

    lo, hi = border_width + 1, s - border_width - 1
    revealed_search = [(lo, lo), (lo, hi), (hi, lo), (hi, hi)]
    revealed_indicators = {}

    def from_pallette(cord):
        [i, j] = cord
        x, y = i * s, j * s
        return palette[x, y]

    values = [True, True, False, False]
    colors = [
        from_pallette(cord)
        for cord in [(LIGHT_0), (DARK_0), (LIGHT_UNREVEALED), (DARK_UNREVEALED)]
    ]

    for corner in revealed_search:
        for color, value in zip(colors, values):
            revealed_indicators[(*corner, *color)] = value

    return dict(
        unique_indicators=unique_indicators,
        not_n_indicators=not_n_indicators,
        revealed_search=revealed_search,
        revealed_indicators=revealed_indicators,
        number_search=number_search_order(unique_indicators),
    )


def number_search_order(unqiue_indicators):
    d = Counter(indicator[:2] for indicator in unqiue_indicators.keys())
    l = sorted((-v, random.random(), k) for k, v in d.items())

    search_order = [x[2] for x in l]

    return search_order


def show_indicators(diff, img, indicators):
    _, _, s = diff
    img = np.copy(img)
    h, w = img.shape[:2]
    for i in range(int(h / s)):
        for j in range(int(w / s)):
            for dx in range(s):
                for dy in range(s):
                    x, y = i * s + dx, j * s + dy
                    if (dx, dy, *img[x, y]) in indicators:
                        img[x, y] = WHITE
    show_img(img)


def build_all(diff, path, border_color, border_width, mappings):
    palette, supported = build_palette(diff, path, border_color, mappings)
    dataset = build_indicator_dataset(diff, palette, supported, border_width)

    return palette, dataset


formats = [
    (
        "SEARCH_HARD",
        dict(
            diff=HARD,
            path="search-hard",
            border_color=BORDER_COLOR,
            border_width=2,
            mappings=[
                [
                    ((0, 0), LIGHT_0),
                    ((0, 1), DARK_0),
                    ((1, 1), LIGHT_1),
                    ((1, 0), DARK_1),
                    ((5, 3), LIGHT_2),
                    ((5, 4), DARK_2),
                    ((2, 8), LIGHT_3),
                    ((5, 2), DARK_3),
                    ((3, 5), LIGHT_4),
                    ((2, 7), DARK_4),
                    ((12, 12), LIGHT_5),
                    ((9, 14), DARK_5),
                    ((11, 10), DARK_6),
                    ((1, 7), LIGHT_FLAG),
                    ((2, 1), DARK_FLAG),
                    ((1, 15), LIGHT_UNREVEALED),
                    ((0, 15), DARK_UNREVEALED),
                ],
                [((11, 21), LIGHT_6)],
                [((16, 2), LIGHT_7)],
                [((7, 8), DARK_7)],
            ],
        ),
    ),
    (
        "SEARCH_MEDIUM",
        dict(
            diff=MEDIUM,
            path="search-medium",
            border_color=BORDER_COLOR,
            border_width=2,
            mappings=[
                [
                    ((6, 3), DARK_0),
                    ((6, 4), LIGHT_0),
                    ((2, 7), DARK_1),
                    ((2, 8), LIGHT_1),
                    ((4, 3), DARK_2),
                    ((4, 4), LIGHT_2),
                    ((2, 6), LIGHT_3),
                    ((9, 4), DARK_3),
                    ((10, 9), DARK_4),
                    ((0, 0), LIGHT_UNREVEALED),
                    ((0, 1), DARK_UNREVEALED),
                    ((1, 1), LIGHT_FLAG),
                    ((1, 0), DARK_FLAG),
                ],
                [((4, 2), LIGHT_4)],
                [((11, 11), LIGHT_5)],
                [((2, 11), DARK_5)],
                [((2, 4), LIGHT_6)],
                [((2, 5), DARK_6)],
                [((6, 14), LIGHT_7)],
                [((5, 12), DARK_7)],
            ],
        ),
    ),
    (
        "SEARCH_EASY",
        dict(
            diff=EASY,
            path="search-easy",
            border_color=BORDER_COLOR,
            border_width=4,
            mappings=[
                [
                    ((0, 0), LIGHT_0),
                    ((1, 0), DARK_0),
                    ((0, 1), DARK_1),
                    ((1, 1), LIGHT_1),
                    ((2, 1), DARK_2),
                    ((2, 2), LIGHT_2),
                    ((0, 7), DARK_3),
                    ((2, 7), DARK_4),
                    ((1, 6), DARK_FLAG),
                    ((1, 7), LIGHT_FLAG),
                    ((3, 1), LIGHT_UNREVEALED),
                    ((1, 2), DARK_UNREVEALED),
                ],
                [((2, 0), LIGHT_3)],
                [((1, 7), LIGHT_4)],
                [((2, 2), LIGHT_6)],
                [((1, 3), LIGHT_5)],
                [((3, 2), DARK_5)],
                [((6, 7), DARK_6)],
            ],
        ),
    ),
    (
        "FBX_EASY",
        dict(
            diff=EASY,
            path="fbx-easy",
            border_color=BORDER_COLOR,
            border_width=4,
            mappings=[
                [
                    ((4, 0), LIGHT_0),
                    ((4, 1), DARK_0),
                    ((0, 0), LIGHT_UNREVEALED),
                    ((0, 1), DARK_UNREVEALED),
                    ((2, 0), LIGHT_1),
                    ((3, 0), DARK_1),
                    ((1, 1), LIGHT_2),
                    ((3, 4), DARK_2),
                    ((2, 2), LIGHT_3),
                    ((3, 2), DARK_3),
                    ((1, 2), DARK_4),
                ],
                [
                    ((0, 0), LIGHT_FLAG),
                    ((0, 1), DARK_FLAG),
                ],
                [
                    [(6,2), LIGHT_5],
                ],
                [
                    [(5,2), DARK_5],
                ],
                [
                    ((3,7), LIGHT_4)
                ],
                [
                    ((2,7), DARK_6)
                ]
            ],
        ),
    ),
]


def joinKeys(indicators):
    return {",".join(map(str, k)): v for k, v in indicators.items()}


if __name__ == "__main__":
    ocr_datasets = {}

    for name, params in formats:
        palette, dataset = build_all(**params)
        # show_indicators(params["diff"], palette, dataset["not_n_indicators"])
        # show_indicators(params["diff"], palette, dataset["unique_indicators"])
        ocr_datasets[name] = dict(
            revealedSearch=dataset["revealed_search"],
            numberSearch=dataset["number_search"],
            revealedIndicators=joinKeys(dataset["revealed_indicators"]),
            uniqueIndicators=joinKeys(dataset["unique_indicators"]),
            notNIndicators=joinKeys(dataset["not_n_indicators"]),
        )

    json.dump(ocr_datasets, open("./data/ocr-datasets.json", "w"))


# [66, 66, 66]
# [0, 151, 167]
