"""헤더 글자의 실제 잉크 줄을 재서 시안(01_Hero)과 맞춥니다.

  node scripts/probe-header.mjs && PYTHONPATH=scripts python3 scripts/probe-header.py
"""

from analyze import load

CREAM = (0xF6, 0xEC, 0xDF)
FOREST = (0x2C, 0x3A, 0x2E)


def rows(im, bg, tol, x0, x1, y0=0, y1=None):
    px = im.load()
    y1 = y1 or im.size[1]
    hit = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if max(abs(a - b) for a, b in zip(px[x, y][:3], bg)) > tol:
                hit.append(y)
                break
    if not hit:
        return None
    return min(hit), max(hit)


def cols(im, bg, tol, x0, x1, y0, y1):
    px = im.load()
    hit = []
    for x in range(x0, x1):
        for y in range(y0, y1):
            if max(abs(a - b) for a, b in zip(px[x, y][:3], bg)) > tol:
                hit.append(x)
                break
    if not hit:
        return None
    return min(hit), max(hit)


def show(name, r, c=None):
    if r is None:
        print(f"{name:<24} 측정 실패")
        return
    span = f"y {r[0]}..{r[1]} (높이 {r[1] - r[0] + 1}, 가운데 {(r[0] + r[1]) / 2:.1f})"
    if c:
        span += f"   x {c[0]}..{c[1]}"
    print(f"{name:<24} {span}")


ref = load("design/refs/01-hero.png")
en = load(".diff/header-en.png")
ko = load(".diff/header-ko.png")
cta = load(".diff/header-cta-ko.png")

print("== 시안 (한글 메뉴 / CTA)")
show("시안 메뉴 전체", rows(ref, CREAM, 18, 490, 1000, 30, 100),
     cols(ref, CREAM, 18, 480, 1000, 30, 100))
for name, x0, x1 in [
    ("시안 AI실장", 485, 560),
    ("시안 템플릿", 595, 670),
    ("시안 멤버십 요금", 700, 810),
    ("시안 FAQ", 850, 905),
]:
    show(name, rows(ref, CREAM, 18, x0, x1, 30, 100), cols(ref, CREAM, 18, x0, x1, 30, 100))
show("시안 CTA 라벨", rows(ref, FOREST, 18, 1140, 1300, 40, 90))

print("\n== 구현 기본(영문)")
show("메뉴 AI MANAGER", rows(en, CREAM, 18, 490, 600, 30, 100), cols(en, CREAM, 18, 480, 620, 30, 100))
show("메뉴 PRICING", rows(en, CREAM, 18, 810, 900, 30, 100))
show("CTA CREATE MY BRAND", rows(en, FOREST, 18, 1140, 1300, 40, 90))

print("\n== 구현 호버(한글)")
show("메뉴 멤버십 요금", rows(ko, CREAM, 18, 805, 900, 30, 100))
show("CTA 내 브랜드 만들기", rows(cta, FOREST, 18, 1140, 1300, 40, 90))

print("\n== 시안 대비 (메뉴 54..71 / CTA 56..72)")
