"""Sikku kolam generator: a mirror curve on an n x n dot grid (the curve runs diagonally between dots through edge
midpoints and bounces off mirrors placed between dots; the border is a mirror). Mirrors are chosen with 4-fold
rotational symmetry and the search keeps a layout only when the whole kolam is ONE closed line."""
import math
import random


def trace(n, mirrors):
    """Return the list of closed curves (each a list of midpoints, doubled coordinates)."""
    def inside(p):
        return 0 <= p[0] <= 2 * n and 0 <= p[1] <= 2 * n

    def step(p, d):
        q = (p[0] + d[0], p[1] + d[1])
        dx, dy = d
        if q[0] % 2 == 0 and (q[0] in (0, 2 * n) or q in mirrors):   # vertical edge (x even in doubled coords)
            dx = -dx
        if q[1] % 2 == 0 and (q[1] in (0, 2 * n) or q in mirrors):   # horizontal edge
            dy = -dy
        return q, (dx, dy)

    mids = [(x, y) for x in range(0, 2 * n + 1) for y in range(0, 2 * n + 1) if (x + y) % 2 == 1]
    seen, curves = set(), []
    for p in mids:
        for d in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
            if not inside((p[0] + d[0], p[1] + d[1])):
                continue
            seg = frozenset([p, (p[0] + d[0], p[1] + d[1])])
            if seg in seen:
                continue
            pts, q, dd = [], p, d
            # walk until we return to the start state
            for _ in range(20000):
                pts.append(q)
                q2, dd2 = step(q, dd)
                seen.add(frozenset([q, q2]))
                q, dd = q2, dd2
                if q == p and dd == d:
                    break
            curves.append(pts)
    return curves


def search(n, seed, p=0.32, tries=4000):
    rnd = random.Random(seed)
    interior = [(x, y) for x in range(1, 2 * n) for y in range(1, 2 * n) if (x + y) % 2 == 1]

    def rot(q):
        return (2 * n - q[1], q[0])
    for _ in range(tries):
        mirrors = set()
        for q in interior:
            if q in mirrors:
                continue
            if rnd.random() < p:
                o = q
                for _ in range(4):
                    mirrors.add(o)
                    o = rot(o)
        # avoid trivial dead-ends: keep only layouts that give one curve
        c = trace(n, mirrors)
        if len(c) == 1 and len(mirrors) >= 4:
            return mirrors, c[0]
    return None, None


def to_screen(pts, n, cx, cy, s):
    out = []
    for (x, y) in pts:
        a, b = x / 2 - n / 2, y / 2 - n / 2
        out.append((cx + (a - b) / math.sqrt(2) * s, cy + (a + b) / math.sqrt(2) * s))
    return out


def smooth_path(P):
    """Quadratic corners through the midpoints of consecutive points: straight where the line crosses, round where it
    bounces off a mirror (the loops around the dots)."""
    k = len(P)
    mid = [((P[i][0] + P[(i + 1) % k][0]) / 2, (P[i][1] + P[(i + 1) % k][1]) / 2) for i in range(k)]
    d = f"M{mid[-1][0]:.1f} {mid[-1][1]:.1f}"
    segs = []
    for i in range(k):
        a, c, b = mid[i - 1], P[i], mid[i]
        d += f" Q{c[0]:.1f} {c[1]:.1f} {b[0]:.1f} {b[1]:.1f}"
        segs.append((a, c, b))
    return d, segs


def sample(segs, step=2.0):
    """Points evenly spaced along the path (for the glowing tip) and the total length."""
    fine = []
    for a, c, b in segs:
        for j in range(24):
            t = j / 24
            fine.append(((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
                         (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]))
    fine.append(fine[0])
    L = [0.0]
    for i in range(1, len(fine)):
        L.append(L[-1] + math.dist(fine[i - 1], fine[i]))
    return fine, L


def catmull_path(P, alpha=0.5):
    """A Catmull-Rom spline through the midpoints (closed), as cubic Beziers: the hand-drawn, flowing look."""
    k = len(P)
    t = alpha / 3 * 2  # control distance factor
    d = f"M{P[0][0]:.1f} {P[0][1]:.1f}"
    segs = []
    for i in range(k):
        p0, p1, p2, p3 = P[i - 1], P[i], P[(i + 1) % k], P[(i + 2) % k]
        c1 = (p1[0] + (p2[0] - p0[0]) * t / 2, p1[1] + (p2[1] - p0[1]) * t / 2)
        c2 = (p2[0] - (p3[0] - p1[0]) * t / 2, p2[1] - (p3[1] - p1[1]) * t / 2)
        d += f" C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
        segs.append((p1, c1, c2, p2))
    return d, segs


def sample_cubic(segs, per=20):
    fine = []
    for a, c1, c2, b in segs:
        for j in range(per):
            u = j / per
            m = 1 - u
            fine.append((m ** 3 * a[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u ** 3 * b[0],
                         m ** 3 * a[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u ** 3 * b[1]))
    fine.append(fine[0])
    L = [0.0]
    for i in range(1, len(fine)):
        L.append(L[-1] + math.dist(fine[i - 1], fine[i]))
    return fine, L
