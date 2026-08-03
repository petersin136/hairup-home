"""시안과 구현 스크린샷의 요소별 잉크 박스를 나란히 비교합니다.

  node scripts/pixel-diff.mjs   를 먼저 돌려 design/diff/*-actual.png 를 만든 뒤
  PYTHONPATH=scripts python3 scripts/compare-ink.py           # 전부
  PYTHONPATH=scripts python3 scripts/compare-ink.py 05        # 이름에 05 가 든 것만
"""

import sys

from analyze import load

CREAM = (0xF6, 0xEC, 0xDF)
BLACK = (0, 0, 0)
CLAY = (0xB8, 0x86, 0x67)
FOREST = (0x2C, 0x3A, 0x2E)
ESPRESSO = (0x35, 0x29, 0x23)

only = sys.argv[1] if len(sys.argv) > 1 else None


def box(im, bg, tol, x0, x1, y0, y1):
    px = im.load()
    xs, ys = [], []
    for y in range(y0, min(y1, im.size[1])):
        for x in range(x0, min(x1, im.size[0])):
            if max(abs(a - b) for a, b in zip(px[x, y], bg)) > tol:
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return (min(xs), max(xs), min(ys), max(ys))


def report(title, ref_path, act_path, bg, tol, items, act_dx=0):
    """act_dx 는 구현 스크린샷이 시안보다 왼쪽으로 얼마나 잘려 있는지입니다.

    06 처럼 시안 좌우 여백을 덜어낸 폭으로 찍는 섹션에서, 구현 쪽 좌표를 시안
    좌표계로 되돌려 놓고 비교하기 위한 값입니다.
    """
    if only and only not in title:
        return
    ref, act = load(ref_path), load(act_path)
    print(f"\n== {title}")
    print(f"   {'요소':<20} {'시안 x/y':<24} {'구현 x/y':<24} 차이")
    for name, x0, x1, y0, y1 in items:
        r = box(ref, bg, tol, x0, x1, y0, y1)
        a = box(act, bg, tol, x0 - act_dx, x1 - act_dx, y0, y1)
        if r is None or a is None:
            print(f"   {name:<20} 측정 실패 (ref={r} act={a})")
            continue
        a = (a[0] + act_dx, a[1] + act_dx, a[2], a[3])
        dl, dr = a[0] - r[0], a[1] - r[1]
        dt, db = a[2] - r[2], a[3] - r[3]
        flag = "" if max(abs(dl), abs(dr), abs(dt), abs(db)) <= 1 else "   <-- 보정"
        print(
            f"   {name:<20} "
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

report(
    "05_Key Benefits",
    "design/refs/05-key-benefits.png",
    "design/diff/05-key-benefits-actual.png",
    CREAM,
    40,
    [
        ("아이브로우", 560, 900, 285, 330),
        ("H2 1행", 380, 1070, 350, 445),
        ("H2 2행", 380, 1070, 450, 535),
        ("본문 1행", 380, 1070, 578, 612),
        ("본문 2행", 380, 1070, 614, 648),
        ("본문 3행", 380, 1070, 650, 684),
        ("카드1", 100, 640, 800, 1200),
        ("카드2", 640, 1170, 800, 1200),
        ("카드3", 1170, 1440, 800, 1200),
        ("카드1 제목1행", 110, 640, 1222, 1272),
        ("카드1 제목2행", 110, 640, 1272, 1315),
        ("카드1 본문1행", 110, 640, 1335, 1368),
        ("카드1 본문3행", 110, 640, 1398, 1432),
        ("카드2 제목2행", 645, 1170, 1272, 1315),
        ("카드2 본문1행", 645, 1170, 1335, 1368),
    ],
)

PROCESS_COMMON = [
    ("THE", 110, 300, 50, 135),
    ("PROCESS", 110, 450, 138, 215),
    ("이미지 박스", 480, 960, 300, 820),
    ("STEP N", 1090, 1340, 505, 600),
    ("1/N", 110, 200, 885, 948),
    ("캡션", 200, 620, 890, 980),
]
THREE_LINE = [
    ("라벨", 110, 520, 465, 520),
    ("본문 1행", 110, 520, 522, 560),
    ("본문 2행", 110, 520, 560, 596),
    ("본문 3행", 110, 520, 596, 634),
]
FOUR_LINE = [
    ("라벨", 110, 520, 450, 500),
    ("본문 1행", 110, 520, 505, 543),
    ("본문 2행", 110, 520, 543, 579),
    ("본문 3행", 110, 520, 579, 615),
    ("본문 4행", 110, 520, 615, 653),
]

for tag, bg, lines in [
    ("06-1 STEP 1", CLAY, THREE_LINE),
    ("06-2 STEP 2", FOREST, THREE_LINE),
    ("06-3 STEP 3", ESPRESSO, FOUR_LINE),
]:
    slug = tag.split()[0]
    report(
        tag,
        f"design/refs/{slug}-process.png",
        f"design/diff/{slug}-process-actual.png",
        bg,
        18,
        PROCESS_COMMON + lines,
        act_dx=60,
    )
