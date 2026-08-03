"""07 섹션의 시안과 렌더 결과를 같은 잣대로 재서 좌표 차이를 보여줍니다.

    node scripts/pixel-diff.mjs 07-1-template   # 먼저 actual 을 만들고
    python3 scripts/compare-07.py

시안이 843px 이라 pixel-diff 가 렌더를 843 으로 줄여 저장합니다. 두 이미지가
같은 좌표계라 그대로 비교할 수 있고, 출력은 1440 기준으로 환산합니다.
"""

import sys
from PIL import Image

SCALE = 1440 / 843
PAIRS = [
    ("07-1", "design/refs/07-1-template.png", "design/diff/07-1-template-actual.png"),
    (
        "07-2",
        "design/refs/07-2-template-hover.png",
        "design/diff/07-2-template-hover-actual.png",
    ),
    (
        "07-3",
        "design/refs/07-3-button-hover.png",
        "design/diff/07-3-button-hover-actual.png",
    ),
]


def lum(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def rows(im, box, dark):
    """box 안에서 어두운 픽셀이 있는 행 구간과 가로 범위."""
    x0, y0, x1, y1 = box
    px = im.load()
    out, start, xs = [], None, []
    for y in range(y0, y1):
        hit = [x for x in range(x0, x1) if lum(px[x, y]) < dark]
        if hit and start is None:
            start, xs = y, list(hit)
        elif hit:
            xs += hit
        elif start is not None:
            out.append((start, y - 1, min(xs), max(xs)))
            start = None
    if start is not None:
        out.append((start, y1 - 1, min(xs), max(xs)))
    return out


def groups(im, box, dark, gap=6):
    """box 안에서 어두운 픽셀이 있는 세로 구간(=단어) 목록."""
    x0, y0, x1, y1 = box
    px = im.load()
    cols = [
        x for x in range(x0, x1) if any(lum(px[x, y]) < dark for y in range(y0, y1))
    ]
    if not cols:
        return []
    out, start = [], cols[0]
    for a, b in zip(cols, cols[1:]):
        if b - a > gap:
            out.append((start, a))
            start = b
    out.append((start, cols[-1]))
    return out


def report(title, ref, act, fn):
    r, a = fn(ref), fn(act)
    print(f"\n  [{title}]")
    if len(r) != len(a):
        print(f"    개수 다름: 시안 {len(r)} / 렌더 {len(a)}")
    for i in range(min(len(r), len(a))):
        d = [round((y - x) * SCALE, 1) for x, y in zip(r[i], a[i])]
        vals = "  ".join(f"{v:+.1f}" for v in d)
        print(f"    {i}: 시안{tuple(round(v * SCALE) for v in r[i])} 차이 {vals}")


for name, ref_path, act_path in PAIRS:
    try:
        ref = Image.open(ref_path).convert("RGB")
        act = Image.open(act_path).convert("RGB")
    except FileNotFoundError:
        continue
    if len(sys.argv) > 1 and sys.argv[1] != name:
        continue
    print(f"\n=== {name}  (값은 1440 기준, 부호는 렌더 − 시안) ===")

    report("헤더 행 (y시작 y끝 x왼 x오)", ref, act, lambda im: rows(im, (0, 150, 843, 480), 150))
    report("본문 행", ref, act, lambda im: rows(im, (0, 390, 843, 470), 200))
    report(
        "카드 세로 (y시작 y끝)",
        ref,
        act,
        lambda im: [(a, b) for a, b, _, _ in rows(im, (300, 520, 500, 860), 60)],
    )
    report(
        "측면 카드 세로",
        ref,
        act,
        lambda im: [(a, b) for a, b, _, _ in rows(im, (40, 520, 120, 860), 60)],
    )
    report(
        "카드 가로",
        ref,
        act,
        lambda im: groups(im, (0, 600, 843, 700), 60, gap=3),
    )
    report("하단 바 단어", ref, act, lambda im: groups(im, (0, 935, 843, 985), 170))
    report(
        "하단 바 세로",
        ref,
        act,
        lambda im: [(a, b) for a, b, _, _ in rows(im, (100, 935, 700, 985), 170)],
    )
