"""
Vetoriza os arquivos de logo enviados pela Magnus (JPG) em SVG, sem redesenhar.

Saídas:
  public/brand/magnus-logotipo.svg   wordmark "MAGNUS"
  public/brand/magnus-icone.svg      ícone de app (quadrado arredondado com o M vazado)
  public/brand/magnus-m.svg          só o símbolo "M"
  src/brand/logo-paths.ts            os mesmos paths para uso nos componentes React,
                                     mais a linha central do "M" (usada na animação de traço)

Uso (na pasta magnus-ad):
  pip install potracer scikit-image pillow numpy
  python3 scripts/vetorizar-logo.py
"""

import json
from collections import deque
from pathlib import Path

import numpy as np
import potrace
from PIL import Image
from skimage.morphology import medial_axis

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "public" / "brand" / "originais"
OUT_SVG = ROOT / "public" / "brand"
OUT_TS = ROOT / "src" / "brand" / "logo-paths.ts"

SCALE = 4  # amplia antes de traçar para curvas mais lisas


def gray(path):
    return np.asarray(Image.open(path).convert("L"), dtype=np.uint8)


def upscale(g):
    h, w = g.shape
    return np.asarray(Image.fromarray(g).resize((w * SCALE, h * SCALE), Image.LANCZOS))


def bbox(mask, pad=0):
    ys, xs = np.nonzero(mask)
    return (
        int(max(xs.min() - pad, 0)),
        int(max(ys.min() - pad, 0)),
        int(min(xs.max() + 1 + pad, mask.shape[1])),
        int(min(ys.max() + 1 + pad, mask.shape[0])),
    )


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def trace(mask):
    """mask (alta resolução) -> path d em coordenadas da imagem original."""
    # potracer inverte o bitmap booleano: True = vazio, por isso o ~
    bm = potrace.Bitmap(~mask)
    plist = bm.trace(
        turdsize=12 * SCALE * SCALE,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=1.0,
        opticurve=True,
        opttolerance=0.2,
    )
    s = 1 / SCALE
    parts = []
    for curve in plist:
        p = curve.start_point
        parts.append(f"M{f(p.x * s)} {f(p.y * s)}")
        for seg in curve.segments:
            if seg.is_corner:
                c, e = seg.c, seg.end_point
                parts.append(f"L{f(c.x * s)} {f(c.y * s)}L{f(e.x * s)} {f(e.y * s)}")
            else:
                a, b, e = seg.c1, seg.c2, seg.end_point
                parts.append(
                    f"C{f(a.x * s)} {f(a.y * s)} {f(b.x * s)} {f(b.y * s)} {f(e.x * s)} {f(e.y * s)}"
                )
        parts.append("Z")
    return "".join(parts)


def centerline(mask):
    """Linha central (maior caminho do esqueleto) de um traço contínuo, em coordenadas originais."""
    skel, dist = medial_axis(mask, return_distance=True)
    pts = {tuple(p) for p in np.argwhere(skel)}

    def neighbors(p):
        y, x = p
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if (dy or dx) and (y + dy, x + dx) in pts:
                    yield (y + dy, x + dx)

    def bfs(src):
        prev = {src: None}
        q = deque([src])
        last = src
        while q:
            last = q.popleft()
            for n in neighbors(last):
                if n not in prev:
                    prev[n] = last
                    q.append(n)
        return last, prev

    a, _ = bfs(next(iter(pts)))
    b, prev = bfs(a)
    path = []
    p = b
    while p is not None:
        path.append(p)
        p = prev[p]
    # começa pela ponta de baixo à esquerda
    if path[0][1] > path[-1][1]:
        path.reverse()
    arr = np.array(path, dtype=np.float64)  # (y, x)
    # suaviza com média móvel e reduz pontos
    k = 3 * SCALE
    pad = np.pad(arr, ((k, k), (0, 0)), mode="edge")
    kernel = np.ones(2 * k + 1) / (2 * k + 1)
    smooth = np.stack([np.convolve(pad[:, i], kernel, mode="valid") for i in range(2)], axis=1)
    smooth = smooth[:: 2 * SCALE]
    if not np.allclose(smooth[-1], arr[-1]):
        smooth = np.vstack([smooth, arr[-1]])
    s = 1 / SCALE
    d = "M" + "L".join(f"{f(x * s)} {f(y * s)}" for y, x in smooth)
    stroke = float(np.percentile(dist[skel], 90) * 2 * s)
    return d, stroke


def svg(w, h, d, title, fill="#0D0D0D"):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" '
        f'width="{f(w)}" height="{f(h)}" role="img" aria-label="{title}">'
        f'<title>{title}</title><path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>\n'
    )


def main():
    result = {}

    # 1. Logotipo: traço preto sobre branco
    g = gray(ORIG / "logotipo-preto.jpg")
    x0, y0, x1, y1 = bbox(g < 128, pad=2)
    hi = upscale(g[y0:y1, x0:x1])
    d = trace(hi < 128)
    result["wordmark"] = {"w": x1 - x0, "h": y1 - y0, "d": d}

    # 2. Ícone de app: quadrado preto com M vazado
    g = gray(ORIG / "icone-preto-fundo-branco.jpg")
    x0, y0, x1, y1 = bbox(g < 128, pad=2)
    hi = upscale(g[y0:y1, x0:x1])
    d = trace(hi < 128)
    result["icon"] = {"w": x1 - x0, "h": y1 - y0, "d": d}
    icon_box = (x0, y0)

    # 3. Símbolo M: pixels claros dentro do quadrado do ícone
    region = (240, 470, 660, 720)  # inteiramente dentro do quadrado arredondado
    rg = g[region[1] : region[3], region[0] : region[2]]
    mx0, my0, mx1, my1 = bbox(rg >= 128, pad=2)
    crop = rg[my0:my1, mx0:mx1]
    hi = upscale(crop)
    mask = hi >= 128
    d = trace(mask)
    cl, stroke = centerline(mask)
    result["m"] = {
        "w": mx1 - mx0,
        "h": my1 - my0,
        "d": d,
        "centerline": cl,
        "stroke": round(stroke, 2),
        # posição do M dentro do ícone, para alinhar os dois se preciso
        "inIcon": {
            "x": region[0] + mx0 - icon_box[0],
            "y": region[1] + my0 - icon_box[1],
        },
    }

    OUT_SVG.mkdir(parents=True, exist_ok=True)
    (OUT_SVG / "magnus-logotipo.svg").write_text(
        svg(result["wordmark"]["w"], result["wordmark"]["h"], result["wordmark"]["d"], "MAGNUS")
    )
    (OUT_SVG / "magnus-icone.svg").write_text(
        svg(result["icon"]["w"], result["icon"]["h"], result["icon"]["d"], "MAGNUS")
    )
    (OUT_SVG / "magnus-m.svg").write_text(
        svg(result["m"]["w"], result["m"]["h"], result["m"]["d"], "MAGNUS")
    )

    OUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUT_TS.write_text(
        "// Gerado por scripts/vetorizar-logo.py a partir dos arquivos em public/brand/originais.\n"
        "// Não edite à mão: rode o script de novo se o logo mudar.\n\n"
        f"export const WORDMARK = {json.dumps(result['wordmark'], ensure_ascii=False)} as const;\n\n"
        f"export const ICON = {json.dumps(result['icon'], ensure_ascii=False)} as const;\n\n"
        f"export const M_SYMBOL = {json.dumps(result['m'], ensure_ascii=False)} as const;\n"
    )
    print(
        "ok",
        {k: (v["w"], v["h"], len(v["d"])) for k, v in result.items()},
        "stroke M:",
        result["m"]["stroke"],
    )


if __name__ == "__main__":
    main()
