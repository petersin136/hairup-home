"""05/06 의 본문 줄을 한 줄씩 분리해 잉크 박스와 색을 잽니다."""

from collections import Counter

from analyze import hexof, load


def near(a, b, tol):
    return max(abs(x - y) for x, y in zip(a, b)) <= tol


def lines(im, bg, tol, x0, x1, y0, y1):
    px = im.load()
    ink = [
        sum(1 for x in range(x0, x1) if not near(px[x, y], bg, tol))
        for y in range(y0, y1)
    ]
    out, start = [], None
    for i, n in enumerate(ink):
        y = y0 + i
        if n > 0 and start is None:
            start = y
        elif n == 0 and start is not None:
            out.append((start, y - 1))
            start = None
    if start is not None:
        out.append((start, y1 - 1))
    res = []
    for t, b in out:
        xs = [
            x
            for y in range(t, b + 1)
            for x in range(x0, x1)
            if not near(px[x, y], bg, tol)
        ]
        col = Counter(
            px[x, y]
            for y in range(t, b + 1)
            for x in range(x0, x1)
            if not near(px[x, y], bg, tol)
        )
        res.append((min(xs), max(xs), t, b, hexof(col.most_common(1)[0][0])))
    return res


def show(title, im, bg, tol, x0, x1, y0, y1):
    print(f"\n{title}")
    prev = None
    for a, b, t, bo, c in lines(im, bg, tol, x0, x1, y0, y1):
        gap = f"  (앞 줄과 {t - prev}px)" if prev is not None else ""
        print(
            f"   x {a:>4}..{b:<4} w={b - a + 1:<4} y {t}..{bo} h={bo - t + 1:<3} {c}{gap}"
        )
        prev = t


CREAM = (0xF6, 0xEC, 0xDF)
im5 = load("design/refs/05-key-benefits.png")
show("== 05 카드1 텍스트", im5, CREAM, 40, 110, 640, 1220, 1440)
show("== 05 카드2 텍스트", im5, CREAM, 40, 645, 1170, 1220, 1440)
show("== 05 헤더 본문", im5, CREAM, 40, 380, 1060, 575, 690)

for name, bg in [
    ("06-1", (0xB8, 0x86, 0x67)),
    ("06-2", (0x2C, 0x3A, 0x2E)),
    ("06-3", (0x35, 0x29, 0x23)),
]:
    im = load(f"design/refs/{name}-process.png")
    show(f"== {name} 좌측 텍스트 블록", im, bg, 18, 110, 520, 440, 680)
    px = im.load()
    xs = [x for x in range(110, 200) if not near(px[x, 920], bg, 18)]
    if xs:
        col = Counter(
            px[x, y]
            for y in range(900, 940)
            for x in range(110, 200)
            if not near(px[x, y], bg, 18)
        )
        print(f"   1/N 색 {hexof(col.most_common(1)[0][0])}")
    col2 = Counter(
        px[x, y]
        for y in range(900, 970)
        for x in range(205, 600)
        if not near(px[x, y], bg, 18)
    )
    print(f"   라벨 색 {hexof(col2.most_common(1)[0][0])}")
