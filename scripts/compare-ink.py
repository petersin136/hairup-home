"""시안과 구현 스크린샷의 요소별 잉크 박스를 나란히 비교합니다.

  node scripts/pixel-diff.mjs   를 먼저 돌려 design/diff/*-actual.png 를 만든 뒤
  PYTHONPATH=scripts python3 scripts/compare-ink.py
"""

from analyze import load

CREAM = (0xF6, 0xEC, 0xDF)
BLACK = (0, 0, 0)


def box(im, bg, tol, x0, x1, y0, y1):
    px = im.load()
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if max(abs(a - b) for a, b in zip(px[x, y], bg)) > tol:
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return (min(xs), max(xs), min(ys), max(ys))


def report(title, ref_path, act_path, bg, tol, items):
    ref, act = load(ref_path), load(act_path)
    print(f"\n== {title}")
    print(f"   {'요소':<22} {'시안 x/y':<24} {'구현 x/y':<24} 차이")
    for name, x0, x1, y0, y1 in items:
        r = box(ref, bg, tol, x0, x1, y0, y1)
        a = box(act, bg, tol, x0, x1, y0, y1)
        if r is None or a is None:
            print(f"   {name:<22} 측정 실패 (ref={r} act={a})")
            continue
        dl, dr = a[0] - r[0], a[1] - r[1]
        dt, db = a[2] - r[2], a[3] - r[3]
        flag = "" if max(abs(dl), abs(dr), abs(dt), abs(db)) <= 1 else "   <-- 보정"
        print(
            f"   {name:<22} "
            f"{f'{r[0]}..{r[1]} / {r[2]}..{r[3]}':<24} "
            f"{f'{a[0]}..{a[1]} / {a[2]}..{a[3]}':<24} "
            f"좌{dl:+d} 우{dr:+d} 상{dt:+d} 하{db:+d}{flag}"
        )


report(
    "03_Test",
    "design/refs/03-test.png",
    "design/diff/03-test-actual.png",
    CREAM,
    40,
    [
        ("eyebrow 02 /", 830, 880, 155, 190),
        ("eyebrow THE EXP.", 878, 1120, 155, 190),
        ("H2 1행", 820, 1330, 215, 310),
        ("H2 2행", 820, 1330, 315, 400),
        ("H2 3행", 820, 1330, 410, 500),
        ("본문 1행", 820, 1330, 538, 572),
        ("본문 2행", 820, 1330, 574, 608),
        ("본문 3행", 820, 1330, 610, 644),
        ("패널", 60, 800, 100, 960),
    ],
)

report(
    "04_Banner",
    "design/refs/04-banner.png",
    "design/diff/04-banner-actual.png",
    BLACK,
    40,
    [
        ("24/7", 80, 260, 100, 160),
        ("Intelligent AI", 280, 520, 225, 285),
        ("Pre - Consultant", 580, 860, 345, 400),
        ("워드마크", 900, 1400, 500, 675),
    ],
)
