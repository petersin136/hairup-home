"""07_Template Collection 시안 3장을 계측합니다.

시안이 843px 폭으로 축소 저장돼 있어 정수 좌표를 그대로 쓸 수 없습니다.
축소하면서 생긴 경계 그라디언트의 무게중심으로 서브픽셀 경계를 역산한 뒤
1440 기준으로 환산합니다. (SCALE 오차 자체는 남으므로 참고값입니다.)
"""

from PIL import Image

SCALE = 1440 / 843


def s(v):
    return v * SCALE


def load(name):
    return Image.open(f"design/refs/raw/{name}.png").convert("RGB")


def lum(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def edge(samples, lo, hi):
    """samples = [(좌표, 밝기)]. lo↔hi 사이를 지나는 지점을 선형보간으로 찾습니다."""
    mid = (lo + hi) / 2
    for i in range(len(samples) - 1):
        a, b = samples[i], samples[i + 1]
        if (a[1] - mid) * (b[1] - mid) <= 0 and a[1] != b[1]:
            t = (mid - a[1]) / (b[1] - a[1])
            return a[0] + t
    return None


def h_edge(im, y, x_from, x_to):
    px = im.load()
    step = 1 if x_to > x_from else -1
    xs = list(range(x_from, x_to + step, step))
    ss = [(x, lum(px[x, y])) for x in xs]
    return edge(ss, lum(px[x_from, y]), lum(px[x_to, y]))


def v_edge(im, x, y_from, y_to):
    px = im.load()
    step = 1 if y_to > y_from else -1
    ys = list(range(y_from, y_to + step, step))
    ss = [(y, lum(px[x, y])) for y in ys]
    return edge(ss, lum(px[x, y_from]), lum(px[x, y_to]))


print("=== 카드 경계 (07-1, 검정 카드 / 크림 배경) ===")
im = load("07-1")
mid_y = 690
big_l = h_edge(im, mid_y, 175, 200)
big_r = h_edge(im, mid_y, 670, 645)
side_r = h_edge(im, mid_y, 155, 180)
side_l2 = h_edge(im, mid_y, 690, 665)
big_t = v_edge(im, 400, 530, 555)
big_b = v_edge(im, 400, 845, 820)
sml_t = v_edge(im, 80, 550, 575)
sml_b = v_edge(im, 80, 825, 800)

for label, v in [
    ("가운데 카드 좌", big_l),
    ("가운데 카드 우", big_r),
    ("가운데 카드 상", big_t),
    ("가운데 카드 하", big_b),
    ("좌측 카드 우변", side_r),
    ("우측 카드 좌변", side_l2),
    ("측면 카드 상", sml_t),
    ("측면 카드 하", sml_b),
]:
    print(f"  {label:14s} {v:8.2f}  → 1440기준 {s(v):8.2f}")

print()
print(f"  가운데 카드 폭  {s(big_r - big_l):.2f}   높이 {s(big_b - big_t):.2f}")
print(f"  측면 카드 높이  {s(sml_b - sml_t):.2f}")
print(f"  카드 간격       {s(big_l - side_r):.2f} / {s(side_l2 - big_r):.2f}")
print(f"  가운데 카드 중심 x {s((big_l + big_r) / 2):.2f}  y {s((big_t + big_b) / 2):.2f}")
print(f"  측면 카드 중심   y {s((sml_t + sml_b) / 2):.2f}")

print("\n=== 버튼 (07-3, 크림 채움 / 검정 카드) ===")
im3 = load("07-3")
bl = h_edge(im3, 708, 340, 365)
br = h_edge(im3, 708, 500, 475)
bt = v_edge(im3, 370, 680, 700)
bb = v_edge(im3, 370, 736, 716)
print(f"  좌 {s(bl):.2f}  우 {s(br):.2f}  상 {s(bt):.2f}  하 {s(bb):.2f}")
print(f"  크기 {s(br - bl):.2f} × {s(bb - bt):.2f}   중심 x {s((bl + br) / 2):.2f}")

def ink_span(im, coords, get, bright, dark):
    """어두운 면적을 적분해 폭을 냅니다. 경계 보간과 달리 축소 편향이 없습니다."""
    px = im.load()
    total = 0.0
    for c in coords:
        v = lum(px[get(c)])
        total += max(0.0, min(1.0, (bright - v) / (bright - dark)))
    return total


print("\n=== 면적 적분(편향 없는 폭 추정) ===")
cream, black = lum((246, 236, 224)), 0.0
w_big = ink_span(im, range(170, 675), lambda x: (x, 690), cream, black)
h_big = ink_span(im, range(520, 860), lambda y: (400, y), cream, black)
h_sml = ink_span(im, range(540, 830), lambda y: (80, y), cream, black)
w_left = ink_span(im, range(0, 180), lambda x: (x, 690), cream, black)
print(f"  가운데 카드 폭 {s(w_big):7.2f}   높이 {s(h_big):7.2f}")
print(f"  측면 카드 높이 {s(h_sml):7.2f}")
print(f"  좌측 카드 노출폭 {s(w_left):7.2f}  → 간격 {(1440 - s(w_big)) / 2 - s(w_left):.2f}")

btn_w = ink_span(im3, range(340, 505), lambda x: (x, 700), 0.0, lum((249, 248, 244)))
btn_h = ink_span(im3, range(675, 745), lambda y: (365, y), 0.0, lum((249, 248, 244)))
print(f"  버튼 {s(btn_w):.2f} × {s(btn_h):.2f}")

print("\n=== 하단 바 ===")
px = im.load()
cols = [
    x
    for x in range(843)
    if any(lum(px[x, y]) < cream - 40 for y in range(940, 980))
]
groups, start = [], cols[0]
for a, b in zip(cols, cols[1:]):
    if b - a > 6:
        groups.append((start, a))
        start = b
groups.append((start, cols[-1]))
for a, b in groups:
    print(f"  문구 x{a}..{b} w{b - a + 1}   → x{s(a):.1f} w{s(b - a + 1):.1f}")
print("  문구 사이 간격 →", [round(s(g2[0] - g1[1]), 1) for g1, g2 in zip(groups, groups[1:])])
rows = [
    y for y in range(930, 1000) if any(lum(px[x, y]) < cream - 40 for x in range(843))
]
print(f"  글자 상단 y{rows[0]} 하단 y{rows[-1]}  높이 {len(rows)}"
      f"   → y{s(rows[0]):.1f} 높이 {s(rows[-1] - rows[0] + 1):.1f}")

print("\n=== 색 표본 ===")
im2 = load("07-2")
print("  배경        ", im.getpixel((4, 4)))
print("  카드        ", im.getpixel((400, 600)))
print("  07-2 테두리 ", max((im2.getpixel((x, 708)) for x in range(350, 360)), key=lum))
print("  07-3 채움   ", im3.getpixel((370, 708)))
print("  07-3 버튼글자", min((im3.getpixel((x, 708)) for x in range(400, 460)), key=lum))
print("  하단 바 글자", min((im.getpixel((x, 958)) for x in range(240, 400)), key=lum))
