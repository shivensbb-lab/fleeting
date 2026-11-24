"""Map data for one film: fetch tiles, build height grids + graded albedo + water masks, bake low-sun shadows.

<film>/data.json: {"detail": {"bbox": [W,S,E,N], "tz": 12, "iz": 13}, "wide": {...}, "sun": [-150, 62, -70], "ex": 3}
Sources (logged in <film>/raw/manifest.jsonl):
- elevation + bathymetry: AWS Terrain Tiles (terrarium PNG; SRTM/GMTED/ETOPO1/GEBCO), free with attribution
- imagery: EOX Sentinel-2 cloudless 2016 (layer s2cloudless_3857), CC BY 4.0
Writes <film>/assets/{detail,wide}_{height.bin,albedo.jpg,water.png,shadow.png,meta.json}
usage: python -I map-engine/tools/data.py <film>
Technique adapted from the Lemo-Opuscar map-explainer demo tools (fetch/prep/bake).
"""
import sys, os, io, json, math, time, datetime, urllib.request
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image
from scipy import ndimage

F = sys.argv[1]; RAW = os.path.join(F, 'raw'); OUT = os.path.join(F, 'assets')
os.makedirs(RAW, exist_ok=True); os.makedirs(OUT, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None
CFG = json.load(open(os.path.join(F, 'data.json')))
UA = {'User-Agent': 'map-film/1.0 (research)'}
LOG = open(os.path.join(RAW, 'manifest.jsonl'), 'a')
TER = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
IMG = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'


def merc(lon, lat, z):
    n = 2 ** z * 256
    return (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n


def get(url):
    for k in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
                b = r.read()
            LOG.write(json.dumps({'url': url, 'bytes': len(b), 'date': datetime.date.today().isoformat()}) + '\n'); return b
        except Exception:
            if k == 5: raise
            time.sleep(2 + 3 * k)


def mosaic(name, tmpl, bbox, z, ext):
    W, S, E, N = bbox
    dst = os.path.join(RAW, f'{name}_z{z}.{ext}')
    x0, y0 = merc(W, N, z); x1, y1 = merc(E, S, z)
    tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int(x1 // 256), int(y1 // 256)
    if not os.path.exists(dst):
        jobs = [(x, y) for y in range(ty0, ty1 + 1) for x in range(tx0, tx1 + 1)]
        im = Image.new('RGB', ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
        with ThreadPoolExecutor(8) as ex:
            for (x, y), b in ex.map(lambda j: (j, get(tmpl.format(z=z, x=j[0], y=j[1]))), jobs):
                im.paste(Image.open(io.BytesIO(b)).convert('RGB'), ((x - tx0) * 256, (y - ty0) * 256))
        im.save(dst, quality=95) if ext == 'jpg' else im.save(dst)
    return {'z': z, 'tx0': tx0, 'ty0': ty0}


def prep(key, km_px_ref=None, z_ref=None):
    c = CFG[key]; W, S, E, N = c['bbox']; z, zt = c['iz'], c['tz']
    im = mosaic(key + '_s2', IMG, c['bbox'], z, 'jpg'); tm = mosaic(key + '_ter', TER, c['bbox'], zt, 'png')
    x0, y0 = merc(W, N, z); x1, y1 = merc(E, S, z)
    img = Image.open(os.path.join(RAW, f'{key}_s2_z{z}.jpg')).convert('RGB')
    img = img.crop((int(x0 - im['tx0'] * 256), int(y0 - im['ty0'] * 256), int(x1 - im['tx0'] * 256), int(y1 - im['ty0'] * 256)))
    IW, IH = img.size
    if km_px_ref is None:
        km_px = 40075.016 * math.cos(math.radians((S + N) / 2)) / (2 ** z * 256)
    else:
        km_px = km_px_ref * 2 ** (z_ref - z)
    tx0, ty0 = merc(W, N, zt); tx1, ty1 = merc(E, S, zt)
    t = np.asarray(Image.open(os.path.join(RAW, f'{key}_ter_z{zt}.png')).convert('RGB'), np.float64)
    h = t[..., 0] * 256 + t[..., 1] + t[..., 2] / 256 - 32768
    ys = (np.arange(IH) + .5) / IH * (ty1 - ty0) + ty0 - tm['ty0'] * 256 - .5
    xs = (np.arange(IW) + .5) / IW * (tx1 - tx0) + tx0 - tm['tx0'] * 256 - .5
    X, Y = np.meshgrid(xs, ys)
    hi = ndimage.map_coordinates(h, [Y, X], order=3, mode='nearest').astype(np.float32)
    a = np.asarray(img, np.float32) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = .3 * r + .59 * g + .11 * b
    watery = (b > r + .015) & (lum < .42)
    water = (hi <= 1.0) | (watery & (hi < 12))
    it = 2 if key == 'detail' else 1
    water = ndimage.binary_closing(ndimage.binary_opening(water, iterations=it), iterations=it)
    lab, n = ndimage.label(water)
    if n:
        sizes = ndimage.sum(water, lab, range(1, n + 1)); keep = np.zeros(n + 1, bool)
        keep[1:] = sizes * km_px * km_px > c.get('min_water_km2', 19); water = keep[lab]
    land = ~water
    if key == 'detail':      # high-zoom tiles carry little bathymetry: take sea depth from the coarse mosaic, like the wide mesh
        bz = c.get('bz', 9); bm = mosaic(key + '_bathy', TER, c['bbox'], bz, 'png')
        bx0, by0 = merc(W, N, bz); bx1, by1 = merc(E, S, bz)
        tb = np.asarray(Image.open(os.path.join(RAW, f'{key}_bathy_z{bz}.png')).convert('RGB'), np.float64)
        hb = tb[..., 0] * 256 + tb[..., 1] + tb[..., 2] / 256 - 32768
        Yb, Xb = np.meshgrid((np.arange(IH) + .5) / IH * (by1 - by0) + by0 - bm['ty0'] * 256 - .5, (np.arange(IW) + .5) / IW * (bx1 - bx0) + bx0 - bm['tx0'] * 256 - .5, indexing='ij')
        hi = np.where(hi < 1.0, np.minimum(hi, ndimage.map_coordinates(hb, [Yb, Xb], order=1, mode='nearest').astype(np.float32)), hi)
    hl = np.where(land, np.maximum(hi, 2.0), np.minimum(hi, -1.0))
    dist_land = ndimage.distance_transform_edt(water) * km_px
    lin = a ** 2.2
    L = lin.copy(); l = (L * [.2126, .7152, .0722]).sum(-1, keepdims=True)
    L = l + (L - l) * .82; L = L * np.array([1.06, 1.0, .88]); L = np.clip(L * .9, 0, 1); L = L ** 1.12 * 1.08
    depth = np.clip(-hl, 0, 120)
    sh = np.maximum(np.exp(-depth / 9.0), np.exp(-dist_land / .34) * .6)
    deep = np.array([.008, .030, .066]); mid = np.array([.014, .055, .095]); teal = np.array([.03, .17, .19])
    dd = np.clip(depth / 90, 0, 1)[..., None]
    sea = mid * (1 - dd) + deep * dd
    shallow = .55 * teal + .45 * (lin * np.array([.55, .95, 1.0]))
    sea = sea * (1 - sh[..., None] * .85) + shallow * (sh[..., None] * .85)
    wm = ndimage.gaussian_filter(water.astype(np.float32), 1.2 if key == 'detail' else .6)[..., None]
    alb = L * (1 - wm) + sea * wm
    Image.fromarray((np.clip(alb, 0, 1) ** (1 / 2.2) * 255 + .5).astype(np.uint8)).save(os.path.join(OUT, f'{key}_albedo.jpg'), quality=92)
    Image.fromarray((wm[..., 0] * 255).astype(np.uint8)).resize((max(2, IW // 2), max(2, IH // 2)), Image.LANCZOS).save(os.path.join(OUT, f'{key}_water.png'))
    dv = c.get('grid_div', 4)
    GW, GH = IW // dv, IH // dv
    hg = np.asarray(Image.fromarray(hl).resize((GW, GH), Image.BILINEAR), np.float32)
    hg.astype('<f4').tofile(os.path.join(OUT, f'{key}_height.bin'))
    meta = {'GW': GW, 'GH': GH, 'IW': IW, 'IH': IH, 'bbox': [W, S, E, N], 'z': z, 'merc': [x0, y0, x1, y1], 'km_px': km_px,
            'width_km': IW * km_px, 'height_km': IH * km_px, 'hmax': float(hl.max()), 'hmin': float(hl.min())}
    json.dump(meta, open(os.path.join(OUT, f'{key}_meta.json'), 'w'), indent=1)
    print(key, {k: meta[k] for k in ('GW', 'GH', 'IW', 'IH', 'width_km', 'height_km', 'hmax', 'hmin')})
    return meta


EX = CFG.get('ex', 3.0)
SUN = np.array(CFG.get('sun', [-150.0, 62.0, -70.0]))
hor = math.hypot(SUN[0], SUN[2]); TAN = SUN[1] / hor; dx, dz = SUN[0] / hor, SUN[2] / hor


def bake(key, reach):
    m = json.load(open(os.path.join(OUT, f'{key}_meta.json'))); GW, GH = m['GW'], m['GH']
    h = np.fromfile(os.path.join(OUT, f'{key}_height.bin'), '<f4').reshape(GH, GW)
    y = ndimage.zoom(np.maximum(h, 0) / 1000 * EX, 2, order=1)
    H, Wd = y.shape
    kx = m['width_km'] / (Wd - 1); kz = m['height_km'] / (H - 1); step = min(kx, kz) * .75
    R, C = np.mgrid[0:H, 0:Wd].astype(np.float32); occ = np.zeros_like(y); d = step
    while d < reach:
        hs = ndimage.map_coordinates(y, [R + dz * d / kz, C + dx * d / kx], order=1, mode='nearest')
        occ = np.maximum(occ, (hs - (y + d * TAN)) / (0.02 + d * 0.04)); d += step * (1 + d / 25)
    lit = np.clip(1 - occ, 0, 1); lit = lit * lit * (3 - 2 * lit)
    Image.fromarray((lit * 255 + .5).astype(np.uint8)).save(os.path.join(OUT, f'{key}_shadow.png'))
    print('baked', key, Wd, H)


md = prep('detail')
prep('wide', md['km_px'], md['z'])
bake('detail', CFG.get('reach_detail', 25)); bake('wide', CFG.get('reach_wide', 60))
