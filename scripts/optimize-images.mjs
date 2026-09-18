/**
 * One-shot optimizer for public/images.
 * Archives originals and writes compressed WebP only.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const imagesDir = path.resolve("public/images");
const archiveDir = path.resolve("public/_old-images-to-delete/uncompressed-originals");

const presets = {
  "hero-": { width: 720, quality: 72 },
  "client-": { width: 320, quality: 70 },
  "service-feature": { width: 900, quality: 72 },
  "service-banner": { width: 1600, quality: 72 },
  default: { width: 1400, quality: 72 },
};

function presetFor(name) {
  if (name.startsWith("hero-")) return presets["hero-"];
  if (name.startsWith("client-")) return presets["client-"];
  if (name.startsWith("service-feature")) return presets["service-feature"];
  if (name.startsWith("service-banner")) return presets["service-banner"];
  return presets.default;
}

fs.mkdirSync(archiveDir, { recursive: true });

const files = fs
  .readdirSync(imagesDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith("."));

let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const srcPath = path.join(imagesDir, file);
  const base = path.parse(file).name;
  const { width, quality } = presetFor(base);
  const before = fs.statSync(srcPath).size;
  beforeTotal += before;

  const archivePath = path.join(archiveDir, file);
  if (!fs.existsSync(archivePath)) {
    fs.copyFileSync(srcPath, archivePath);
  }

  const buffer = fs.readFileSync(srcPath);
  const webpPath = path.join(imagesDir, `${base}.webp`);

  await sharp(buffer)
    .rotate()
    .resize({
      width,
      height: width,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 4 })
    .toFile(webpPath);

  // Keep only WebP in the live images folder
  if (file !== `${base}.webp`) {
    fs.unlinkSync(srcPath);
  }
  const leftoverJpg = path.join(imagesDir, `${base}.jpg`);
  if (fs.existsSync(leftoverJpg)) fs.unlinkSync(leftoverJpg);

  const after = fs.statSync(webpPath).size;
  afterTotal += after;
  console.log(
    `${file} → ${base}.webp (${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB @ max ${width}px)`
  );
}

console.log(
  `\nDone. WebP total ~${(afterTotal / 1024 / 1024).toFixed(2)}MB (from ~${(beforeTotal / 1024 / 1024).toFixed(2)}MB input).`
);
