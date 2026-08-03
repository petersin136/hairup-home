"""디자인 목업에서 픽셀 단위 스펙을 추출하는 분석 스크립트."""

import sys
from collections import Counter

from PIL import Image


def load(path):
    return Image.open(path).convert("RGB")


def hexof(rgb):
    return "#%02x%02x%02x" % rgb


def palette(im, top=12):
    c = Counter(im.getdata())
    total = im.size[0] * im.size[1]
    return [(hexof(k), v, 100.0 * v / total) for k, v in c.most_common(top)]


def row_bands(im, tol=6):
    """배경색이 바뀌는 y 경계를 찾는다."""
    w, h = im.size
    px = im.load()
    bands = []
    prev = None
    for y in range(h):
        c = Counter(px[x, y] for x in range(0, w, 4)).most_common(1)[0][0]
        if prev is None or max(abs(a - b) for a, b in zip(c, prev)) > tol:
            bands.append((y, hexof(c)))
            prev = c
    return bands


def bbox_not(im, bg, tol=10, x0=0, x1=None, y0=0, y1=None):
    """bg 색이 아닌 픽셀의 bounding box."""
    w, h = im.size
    x1 = w if x1 is None else x1
    y1 = h if y1 is None else y1
    px = im.load()
    minx, miny, maxx, maxy = 10**9, 10**9, -1, -1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if max(abs(a - b) for a, b in zip(px[x, y], bg)) > tol:
                if x < minx:
                    minx = x
                if x > maxx:
                    maxx = x
                if y < miny:
                    miny = y
                if y > maxy:
                    maxy = y
    if maxx < 0:
        return None
    return (minx, miny, maxx, maxy, maxx - minx + 1, maxy - miny + 1)


def ink_rows(im, bg, tol=10, x0=0, x1=None, y0=0, y1=None):
    """행별 잉크 픽셀 수 -> 텍스트 줄 분리용."""
    w, h = im.size
    x1 = w if x1 is None else x1
    y1 = h if y1 is None else y1
    px = im.load()
    out = []
    for y in range(y0, y1):
        n = sum(
            1
            for x in range(x0, x1)
            if max(abs(a - b) for a, b in zip(px[x, y], bg)) > tol
        )
        out.append((y, n))
    return out


def segments(rows, minrun=1):
    """잉크가 있는 연속 구간을 [(start, end, height)] 로 묶는다."""
    segs = []
    start = None
    for y, n in rows:
        if n > 0 and start is None:
            start = y
        elif n == 0 and start is not None:
            if y - start >= minrun:
                segs.append((start, y - 1, y - start))
            start = None
    if start is not None:
        last = rows[-1][0]
        segs.append((start, last, last - start + 1))
    return segs


def ink_cols(im, bg, tol=10, x0=0, x1=None, y0=0, y1=None):
    w, h = im.size
    x1 = w if x1 is None else x1
    y1 = h if y1 is None else y1
    px = im.load()
    out = []
    for x in range(x0, x1):
        n = sum(
            1
            for y in range(y0, y1)
            if max(abs(a - b) for a, b in zip(px[x, y], bg)) > tol
        )
        out.append((x, n))
    return out


if __name__ == "__main__":
    path = sys.argv[1]
    im = load(path)
    print(f"{path}  {im.size[0]} x {im.size[1]}")
    print("\n--- palette ---")
    for hx, n, pct in palette(im):
        print(f"  {hx}  {n:>9}  {pct:6.2f}%")
    print("\n--- row bands ---")
    for y, hx in row_bands(im):
        print(f"  y={y:<5} {hx}")
