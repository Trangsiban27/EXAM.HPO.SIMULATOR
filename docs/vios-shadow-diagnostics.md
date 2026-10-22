# Toyota Vios: diagonal stripe diagnosis

## Cause

The stripes are shadow acne, with a second contribution from opaque shadow
casting by the model's blended glass. The sun originally had `bias = 0` and
`normalBias = 0`, with a 2048 px shadow map covering 120 m. The loader also set
`castShadow = true` on every GLB mesh, including transparent glass.

## Checks performed

| Check | Result |
| --- | --- |
| Original GLB structure | 9 meshes, 232,346 triangles, 6 materials |
| Repeated triangle surfaces | 0, including comparisons across meshes with coordinates quantized to 0.000001 m |
| Textures / normal maps | None in the GLB; none installed by the vehicle loader |
| Shadows disabled | Stripes disappear with original geometry/materials |
| Neutral lit material | Stripes remain with zero shadow bias |
| Unlit material | No stripes |
| Camera range 0.1–200 vs 0.5–60 | Only 54 pixels change by more than 6 RGB units in the 1024×768 diagonal comparison; stripe pattern remains |
| Stop receiving shadows | Stripes disappear; diagnostic only, not the production fix |
| Bias/normalBias sweep | Removing acne from the body requires more than the initial -0.00005 / 0.03 trial |
| Blended glass stops casting opaque shadows | Remaining stripes seen through the windscreen/rear glass disappear |

These results identify shadow sampling as the source of the stripes rather than
camera depth precision, duplicated triangles, a texture, or a normal map. No
mesh was deleted and no global polygon offset was applied.

## Applied fix

- `shadowStyle.ts`: sun shadow `bias = -0.0003`, `normalBias = 0.04` m.
- `Vehicle3.ts`: only meshes whose materials are entirely blended/transparent
  stop casting solid shadows. On this asset these are `Object_2` (`auto`) and
  `Object_9` / `Object_10` (`auto4`). Opaque meshes continue casting shadows.
- All original meshes still receive shadows. Glass tint, transparency, depth
  writing, sidedness and material properties remain exactly as loaded.
- The GLB file, geometry attributes, indices, scale, original materials, camera
  clipping range, wheels and vehicle controls are unchanged.

The shadow bias values are calibrated for the current sun/map setup; changing
the map coverage or lighting warrants repeating the visual checks.

## Verification

```sh
node tests/vehicle3-shadow-structure.mjs
node tests/vehicle3-front-lights.mjs
npx tsc --noEmit
```

The structure check verifies original geometry buffer hashes and complete
material JSON before/after attaching the model, plus the three transparent
shadow casters. Original asset SHA-256:
`ed472b008e497032d9993f240fb38f37d018c0c435f2a62649a88f08231300ae`.

For visual diagnosis, run Vite and open
`/tests/fixtures/vios-render-diagnostics.html`. In the browser console:

```js
await viosDiagnostics.render({ view: 'top', variant: 'baseline' });
await viosDiagnostics.render({ view: 'top', variant: 'fixed' });
```

Views: `top`, `side`, `front`, `rear`, `diagonal`, `cabin`.
The `baseline` variant reproduces the original all-mesh shadow casting; `fixed`
uses the production vehicle flags and shadow configuration.

`tests/vehicle3-render-diagnostics.mjs` captures comparisons with a locally
installed Puppeteer module (`VIOS_PUPPETEER_MODULE`) and Chrome
(`VIOS_CHROME_PATH`). No browser/package download is performed. Screenshots and
JSON results go to `VIOS_DIAGNOSTICS_DIR` (default `/private/tmp/vios-diagnostics`).
`tests/vehicle3-game-camera-smoke.mjs` also exercises the actual game top/cabin UI
and captures its mirror/shoulder panes.
