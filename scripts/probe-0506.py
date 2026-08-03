"""05 카드 / 06 이미지 박스의 정확한 사각형과 라운드, 그리고 세부 덩어리를 잽니다."""

import math

from analyze import hexof, load


def near(a, b, tol):
    return max(abs(x - y) for x, y in zip(a, b)) <= tol


def rect_of(im, color, tol, x0, x1, y0, y1):
    px = im.load()
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if near(px[x, y], color, tol):
                xs.append(x)
                ys.append(y)
    return min(xs), max(xs), min(ys), max(ys)


def radius_of(im, color, tol, left, top):
    """좌상단 모서리에서 행별 들여쓰기를 재서 반지름을 역산합니다."""
    px = im.load()
    measured = []
    for dy in range(0, 12):
        for dx in range(0, 30):
            if near(px[left + dx, top + dy], color, tol):
                measured.append((dy, dx))
                break
    best, berr = None, 1e9
    for r in range(0, 24):
        err = 0
        for dy, v in measured:
            if dy >= r:
                p = 0
            else:
                d = r - dy - 0.5
                p = r - math.sqrt(max(0.0, r * r - d * d))
            err += abs(p - v)
        if err < berr:
            best, berr = r, err
    return best, [v for _, v in measured[:5]]


def chunks(im, bg, tol, x0, x1, y0, y1, gap):
    px = im.load()
    cols = [
        sum(1 for y in range(y0, y1 + 1) if not near(px[x, y], bg, tol))
        for x in range(x0, x1)
    ]
    out, start, last, g = [], None, None, 0
    for i, n in enumerate(cols):
        x = x0 + i
        if n > 0:
            if start is None:
                start = x
            last, g = x, 0
        elif start is not None:
            g += 1
            if g >= gap:
                out.append((start, last))
                start = None
    if start is not None:
        out.append((start, last))
    res = []
    for a, b in out:
        ys = [
            y
            for y in range(y0, y1 + 1)
            for x in range(a, b + 1)
            if not near(px[x, y], bg, tol)
        ]
        res.append((a, b, b - a + 1, min(ys), max(ys), max(ys) - min(ys) + 1))
    return res


CREAM = (0xF6, 0xEC, 0xDF)
BLACK = (0, 0, 0)

print("=== 05_Key Benefits ===")
im5 = load("design/refs/05-key-benefits.png")
for i, (x0, x1) in enumerate([(100, 640), (640, 1170), (1170, 1440)], 1):
    r = rect_of(im5, BLACK, 24, x0, x1, 800, 1220)
    print(f"  카드{i}  x {r[0]}..{r[1]} (w={r[1] - r[0] + 1})  y {r[2]}..{r[3]} (h={r[3] - r[2] + 1})")
print("  라운드:", radius_of(im5, BLACK, 60, 120, 827))

print("\n  헤더 아이브로우 덩어리")
for c in chunks(im5, CREAM, 40, 560, 900, 290, 325, 5):
    print(f"     x {c[0]}..{c[1]} w={c[2]:<4} y {c[3]}..{c[4]} h={c[5]}")
print("  H2 줄 전체 박스")
for y0, y1 in [(355, 445), (452, 532)]:
    c = chunks(im5, CREAM, 40, 380, 1060, y0, y1, 400)
    for a, b, w, t, bo, hh in c:
        print(f"     x {a}..{b} w={w:<4} y {t}..{bo} h={hh}")
print("  카드1 제목/본문 덩어리")
for y0, y1 in [(1225, 1270), (1272, 1312), (1338, 1430)]:
    for c in chunks(im5, CREAM, 40, 110, 640, y0, y1, 400):
        print(f"     x {c[0]}..{c[1]} w={c[2]:<4} y {c[3]}..{c[4]} h={c[5]}")

print("\n=== 06_The Process ===")
for name, bg in [
    ("06-1", (0xB8, 0x86, 0x67)),
    ("06-2", (0x2C, 0x3A, 0x2E)),
    ("06-3", (0x35, 0x29, 0x23)),
]:
    im = load(f"design/refs/{name}-process.png")
    r = rect_of(im, CREAM, 24, 480, 960, 300, 820)
    print(f"  {name} 이미지박스  x {r[0]}..{r[1]} (w={r[1] - r[0] + 1})  y {r[2]}..{r[3]} (h={r[3] - r[2] + 1})")
    print(f"        라운드: {radius_of(im, CREAM, 60, r[0], r[2])}")
    px = im.load()
    print(f"        THE 색 {hexof(px[130, 95])}   1/3 색 {hexof(px[126, 920])}")
    for label, y0, y1 in [("STEP", 520, 590), ("하단", 900, 975)]:
        for c in chunks(im, bg, 18, 1100, 1330, y0, y1, 12) if label == "STEP" else chunks(im, bg, 18, 110, 600, y0, y1, 12):
            print(f"        {label}: x {c[0]}..{c[1]} w={c[2]:<4} y {c[3]}..{c[4]} h={c[5]}")
