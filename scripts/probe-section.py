"""시안 한 장의 구조(배경색·솔리드 블록·텍스트 줄과 덩어리)를 한 번에 뽑습니다.

  PYTHONPATH=scripts python3 scripts/probe-section.py design/refs/05-key-benefits.png
  PYTHONPATH=scripts python3 scripts/probe-section.py design/refs/06-1-process.png --blocks
"""

import sys
from collections import Counter

from analyze import hexof, load

MIN_BLOCK = 120  # 이 폭 이상 연속이면 '면'으로 봅니다
GAP = 22  # 이 이상 비면 다른 덩어리로 끊습니다


def near(a, b, tol):
    return max(abs(x - y) for x, y in zip(a, b)) <= tol


def solid_blocks(im, bg, tol=12):
    """배경이 아닌 단색 사각형을 찾아 (색, x0, x1, y0, y1) 로 돌려줍니다."""
    w, h = im.size
    px = im.load()
    runs = {}
    for y in range(h):
        x = 0
        while x < w:
            c = px[x, y]
            if near(c, bg, tol):
                x += 1
                continue
            start = x
            while x < w and near(px[x, y], c, tol):
                x += 1
            if x - start >= MIN_BLOCK:
                runs.setdefault((c, start, x - 1), []).append(y)
    blocks = []
    for (c, x0, x1), ys in runs.items():
        if len(ys) < MIN_BLOCK // 4:
            continue
        blocks.append((hexof(c), x0, x1, min(ys), max(ys), x1 - x0 + 1, max(ys) - min(ys) + 1))
    blocks.sort(key=lambda b: (b[3], b[1]))
    return blocks


def chunks_in(im, bg, tol, y0, y1):
    """한 줄 안에서 x 방향 덩어리를 끊어 (x0, x1, ytop, ybottom) 로 돌려줍니다."""
    w = im.size[0]
    px = im.load()
    cols = [
        sum(1 for y in range(y0, y1 + 1) if not near(px[x, y], bg, tol))
        for x in range(w)
    ]
    out, start, last, gap = [], None, None, 0
    for x, n in enumerate(cols):
        if n > 0:
            if start is None:
                start = x
            last, gap = x, 0
        elif start is not None:
            gap += 1
            if gap >= GAP:
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
        res.append((a, b, min(ys), max(ys)))
    return res


def main(path, want_blocks):
    im = load(path)
    w, h = im.size
    px = im.load()
    counts = Counter(im.getdata())
    bg = counts.most_common(1)[0][0]
    print(f"{path}  {w} x {h}   배경 {hexof(bg)}")

    print("\n--- 팔레트 ---")
    for c, n in counts.most_common(10):
        print(f"   {hexof(c)}  {100 * n / (w * h):6.2f}%")

    blocks = solid_blocks(im, bg)
    if want_blocks:
        print("\n--- 솔리드 블록 ---")
        for hx, x0, x1, y0, y1, bw, bh in blocks:
            print(f"   {hx}  x {x0:>4}..{x1:<4} y {y0:>4}..{y1:<4}  {bw} × {bh}")

    # 큰 면이 같은 y 대역의 글자를 가리므로, 면을 배경색으로 지운 뒤 글자를 찾습니다.
    for _, x0, x1, y0, y1, _, _ in blocks:
        for y in range(max(0, y0 - 3), min(h, y1 + 4)):
            for x in range(max(0, x0 - 3), min(w, x1 + 4)):
                px[x, y] = bg

    print("\n--- 텍스트 줄 / 덩어리 ---")
    ink = [
        sum(1 for x in range(w) if not near(px[x, y], bg, 18)) for y in range(h)
    ]
    y, prev = 0, None
    while y < h:
        if ink[y] == 0:
            y += 1
            continue
        start = y
        blank = 0
        while y < h and blank < 6:
            y += 1
            blank = blank + 1 if y < h and ink[y] == 0 else 0
        end = y - blank - 1
        cs = chunks_in(im, bg, 18, start, end)
        gap = f"  (앞 줄과 {start - prev}px)" if prev is not None else ""
        print(f"   y {start:>4}..{end:<4} h={end - start + 1:<3}{gap}")
        for a, b, t, bo in cs:
            col = Counter(
                px[x, yy]
                for yy in range(t, bo + 1)
                for x in range(a, b + 1)
                if not near(px[x, yy], bg, 18)
            )
            top = col.most_common(1)[0][0] if col else bg
            print(
                f"        x {a:>4}..{b:<4} w={b - a + 1:<4} "
                f"y {t}..{bo} h={bo - t + 1:<3} {hexof(top)}"
            )
        prev = start


if __name__ == "__main__":
    main(sys.argv[1], "--blocks" in sys.argv)
