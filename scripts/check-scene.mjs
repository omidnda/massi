// Geometric audit only: does not replace browser/GPU rendering verification.
import assert from "node:assert/strict";
import { createCameraPaths } from "../src/lib/camera-path.ts";
const { path, look } = createCameraPaths();
for (const mobile of [false, true])
  for (let sample = 0; sample <= 1000; sample++) {
    const p = path.getPoint(sample / 1000);
    const target = look.getPoint(sample / 1000);
    if (mobile) {
      p.z += 2;
      p.y += 0.4;
      target.x += 0.4;
    }
    assert(p.toArray().every(Number.isFinite));
    assert(target.toArray().every(Number.isFinite));
    assert(p.x > -5.5 && p.x < 5.5, "camera crosses side wall");
    assert(p.y > 0.7 && p.y < 5.5, "camera crosses floor or ceiling");
    assert(p.z > -10.5, "camera crosses back wall");
    assert(p.distanceTo(target) > 1, "camera target degenerates");
    for (const z of [-5.2, -0.4, 4.4])
      assert(
        Math.hypot(p.x + 3.93, p.z - z) > 1.1,
        "camera intersects styling chair",
      );
    assert(
      Math.hypot(p.x - 3.3, p.z + 6.3) > 0.9,
      "camera intersects sculpture",
    );
    assert(
      !(p.x > 3.45 && p.x < 4.85 && p.z > -0.45 && p.z < 3.25),
      "camera intersects lounge sofa",
    );
    assert(
      !(p.x > -1.4 && p.x < 2.4 && p.z > -9.95 && p.z < -8.55),
      "camera intersects reception desk",
    );
  }
console.log(
  "PASS: 2,002 desktop/mobile camera samples; finite transforms, room and furniture clearances. GPU rendering remains a separate check.",
);
