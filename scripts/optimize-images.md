# Image Optimization Scripts

Use these scripts and tools to optimize images before uploading to your site.

## Quick Reference

**Current image sizes:**
- 499224803_1298277118970954_217332104034590816_n.jpg: 145KB ✅
- 504832693_1315643813900951_7295640018996093784_n.jpg: 370KB ⚠️ (could be smaller)
- 518043519_1347303007401698_1369059919729502128_n.jpg: 74KB ✅
- 526989708_1365785275553471_2217496400386426939_n.jpg: 242KB ✅
- 555083929_1415827430549255_2308349470188256460_n.jpg: 58KB ✅
- 577045367_1454099106722087_8385517091408693551_n.jpg: 323KB ✅

**Target:** Keep images under 300KB for optimal performance.

---

## Manual Optimization Tools

### Online Tools (No Installation)

1. **TinyPNG** - https://tinypng.com/
   - Drag and drop up to 20 images
   - Compresses JPG and PNG
   - Reduces file size by 50-70%
   - **Best for:** Quick batch compression

2. **Squoosh** - https://squoosh.app/
   - Google's image compressor
   - Advanced settings (quality, format)
   - Side-by-side comparison
   - **Best for:** Fine-tuning single images

3. **Compress JPEG** - https://compressjpeg.com/
   - Batch compression
   - Adjustable quality slider
   - Download as ZIP
   - **Best for:** Multiple JPEGs at once

### Desktop Applications

**Windows:**
- **RIOT** (Radical Image Optimization Tool)
  - Download: https://riot-optimizer.com/
  - Free, open source
  - Side-by-side comparison
  - Batch processing

**Mac:**
- **ImageOptim**
  - Download: https://imageoptim.com/
  - Free, drag-and-drop
  - Removes metadata
  - Excellent compression

**Cross-Platform:**
- **GIMP** (Free Photoshop alternative)
  - File > Export As > Adjust quality
  - Set quality to 85-90%

---

## Command-Line Tools

For developers comfortable with terminal.

### ImageMagick (Recommended)

**Installation:**
```bash
# Mac
brew install imagemagick

# Windows (via Chocolatey)
choco install imagemagick

# Or download from: https://imagemagick.org/
```

**Resize images:**
```bash
# Resize single image (maintains aspect ratio)
magick input.jpg -resize 1200x1600 output.jpg

# Resize to max width (height auto)
magick input.jpg -resize 1200x output.jpg

# Batch resize all JPGs in folder
magick mogrify -resize 1200x1600 *.jpg
```

**Compress images:**
```bash
# Adjust quality (85 is good balance)
magick input.jpg -quality 85 output.jpg

# Batch compress
magick mogrify -quality 85 *.jpg

# Strip metadata to reduce size
magick input.jpg -strip output.jpg
```

**Convert to WebP:**
```bash
# Single image
magick input.jpg -quality 85 output.webp

# Batch convert
magick mogrify -format webp -quality 85 *.jpg
```

### cwebp (WebP Converter)

**Installation:**
```bash
# Mac
brew install webp

# Windows: Download from
# https://developers.google.com/speed/webp/download
```

**Convert to WebP:**
```bash
# Single file (85% quality)
cwebp -q 85 input.jpg -o output.webp

# Batch convert all JPGs
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done

# PowerShell (Windows)
Get-ChildItem *.jpg | ForEach-Object {
  cwebp -q 85 $_.FullName -o ($_.BaseName + ".webp")
}
```

### jpegoptim (JPEG Only)

**Installation:**
```bash
# Mac
brew install jpegoptim

# Linux (Ubuntu/Debian)
sudo apt install jpegoptim
```

**Optimize JPEGs:**
```bash
# Optimize to target size
jpegoptim --size=200k image.jpg

# Set max quality
jpegoptim --max=85 image.jpg

# Strip metadata
jpegoptim --strip-all image.jpg

# Batch optimize
jpegoptim --max=85 --strip-all *.jpg
```

---

## Automation Scripts

### Batch Optimize Script

Save as `optimize-new-images.sh` (Mac/Linux) or `optimize-new-images.ps1` (Windows):

**Bash version:**
```bash
#!/bin/bash
# optimize-new-images.sh
# Place new images in "new-images" folder, run script

INPUT_DIR="new-images"
OUTPUT_DIR="assets/images/artworks"

# Create output directory if doesn't exist
mkdir -p $OUTPUT_DIR

# Process each image
for img in $INPUT_DIR/*.jpg $INPUT_DIR/*.jpeg $INPUT_DIR/*.png; do
  filename=$(basename "$img")

  echo "Processing: $filename"

  # Resize to max 1200x1600, quality 85, strip metadata
  magick "$img" -resize 1200x1600 -quality 85 -strip "$OUTPUT_DIR/$filename"

  # Also create WebP version
  cwebp -q 85 "$img" -o "$OUTPUT_DIR/${filename%.*}.webp"

  echo "Optimized: $filename"
done

echo "All images optimized!"
```

**PowerShell version (Windows):**
```powershell
# optimize-new-images.ps1
$inputDir = "new-images"
$outputDir = "assets\images\artworks"

# Create output directory if doesn't exist
New-Item -ItemType Directory -Force -Path $outputDir

# Process each image
Get-ChildItem $inputDir -Include *.jpg,*.jpeg,*.png -Recurse | ForEach-Object {
    $filename = $_.Name
    $outputPath = Join-Path $outputDir $filename

    Write-Host "Processing: $filename"

    # Resize and optimize
    magick $_.FullName -resize 1200x1600 -quality 85 -strip $outputPath

    # Create WebP version
    $webpPath = Join-Path $outputDir ($_.BaseName + ".webp")
    cwebp -q 85 $_.FullName -o $webpPath

    Write-Host "Optimized: $filename"
}

Write-Host "All images optimized!"
```

**Usage:**
1. Create `new-images` folder in project root
2. Place new artwork images in that folder
3. Run script:
```bash
chmod +x optimize-new-images.sh
./optimize-new-images.sh
```
4. Optimized images appear in `assets/images/artworks/`

---

## Pre-Upload Checklist

Before uploading any new image to your site:

- [ ] **Resize** to appropriate dimensions
  - Artwork images: 1200×1600px max
  - Blog images: 1200×630px
  - Thumbnails: 600×800px
  - Hero images: 1920×1080px

- [ ] **Compress** to reduce file size
  - Use TinyPNG, Squoosh, or ImageOptim
  - Target quality: 85-90%
  - Target size: < 300KB

- [ ] **Format** for web
  - Primary: JPG for photos/artwork
  - Alternative: WebP for better compression
  - Avoid: PNG for photos (too large)

- [ ] **Strip metadata**
  - Removes EXIF data (location, camera info)
  - Reduces file size by 5-20KB
  - Use ImageMagick `-strip` flag

- [ ] **Name properly**
  - Descriptive filename
  - Lowercase
  - Hyphens not spaces: `lunar-dreams.jpg`
  - No special characters

---

## Responsive Images

For best performance, create multiple sizes of each image.

### Create Image Variants

```bash
# Create thumbnail (600px wide)
magick artwork.jpg -resize 600x artwork-thumb.jpg

# Create medium (1200px wide)
magick artwork.jpg -resize 1200x artwork-medium.jpg

# Create full size (1600px wide)
magick artwork.jpg -resize 1600x artwork-full.jpg

# All with 85% quality
magick artwork.jpg -resize 600x -quality 85 artwork-thumb.jpg
magick artwork.jpg -resize 1200x -quality 85 artwork-medium.jpg
magick artwork.jpg -resize 1600x -quality 85 artwork-full.jpg
```

### Use in HTML

```html
<picture>
  <source srcset="/assets/images/artworks/lunar-dreams-full.webp"
          media="(min-width: 1200px)"
          type="image/webp">
  <source srcset="/assets/images/artworks/lunar-dreams-medium.webp"
          media="(min-width: 768px)"
          type="image/webp">
  <source srcset="/assets/images/artworks/lunar-dreams-thumb.webp"
          type="image/webp">
  <img src="/assets/images/artworks/lunar-dreams-full.jpg"
       alt="Lunar Dreams digital collage"
       loading="lazy">
</picture>
```

---

## WebP with Fallback

Always provide JPG fallback for older browsers.

### Convert Existing Images

```bash
# Convert all artwork JPGs to WebP (keep originals)
cd assets/images/artworks
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

### Update HTML Templates

In `assets/js/content-loader.js`, update image rendering:

```javascript
function createArtworkCard(artwork) {
  const card = document.createElement('div');
  card.className = 'artwork-card';

  // Use WebP with JPG fallback
  const imagePath = artwork.images.thumbnail;
  const webpPath = imagePath.replace('.jpg', '.webp');

  card.innerHTML = `
    <picture>
      <source srcset="${webpPath}" type="image/webp">
      <img src="${imagePath}"
           alt="${artwork.seo.altText}"
           loading="lazy">
    </picture>
    <div class="artwork-info">
      <h3>${artwork.title}</h3>
      <p>${artwork.category}</p>
    </div>
  `;

  return card;
}
```

---

## Monitoring Image Performance

### Check Image Sizes

```bash
# List all images with sizes
find assets/images -type f -name "*.jpg" -o -name "*.png" | xargs ls -lh

# Find images over 300KB
find assets/images -type f -size +300k

# Total size of all images
du -sh assets/images/
```

### Identify Largest Images

```bash
# Sort by size, show top 10 largest
find assets/images -type f -exec ls -lh {} + | sort -k5 -hr | head -10
```

### Before/After Comparison

Track optimization results:

```bash
# Before
Original Size: 450KB
Page Load: 3.2s

# After optimization
Optimized Size: 180KB (60% reduction)
Page Load: 1.8s (44% faster)
```

---

## Image Optimization Workflow

**For every new artwork:**

1. **Export** from design tool (Photoshop, etc.)
   - Export as JPG, quality 90-95%
   - Size: 1600px on longest side

2. **Compress** with TinyPNG
   - Upload to https://tinypng.com/
   - Download compressed version
   - Check file size (should be < 300KB)

3. **Convert** to WebP (optional but recommended)
   ```bash
   cwebp -q 85 artwork.jpg -o artwork.webp
   ```

4. **Upload** to site
   ```bash
   # Copy to assets folder
   cp artwork.jpg assets/images/artworks/
   cp artwork.webp assets/images/artworks/
   ```

5. **Add to JSON**
   - Update `content/artworks.json`
   - Reference image path

6. **Commit and deploy**
   ```bash
   git add assets/images/artworks/artwork.* content/artworks.json
   git commit -m "Add new artwork: [Title]"
   git push
   ```

---

## Performance Impact

**Example savings:**

| Image | Original | Optimized | Savings |
|-------|----------|-----------|---------|
| Hero background | 1.2 MB | 280 KB | 77% |
| Artwork 1 | 850 KB | 195 KB | 77% |
| Artwork 2 | 620 KB | 148 KB | 76% |
| Blog image | 540 KB | 125 KB | 77% |
| **Total** | **3.21 MB** | **748 KB** | **77%** |

**Result:**
- Page load time: 4.2s → 1.6s (62% faster)
- Bandwidth saved: 2.5 MB per visitor
- PageSpeed score: 68 → 94 (+26 points)

---

## Resources

- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim**: https://imageoptim.com/ (Mac)
- **ImageMagick**: https://imagemagick.org/
- **WebP Info**: https://developers.google.com/speed/webp
- **Can I Use WebP**: https://caniuse.com/webp (98%+ browser support)

---

**Remember:** Optimizing images is the #1 way to improve site performance. Spend time on this!
