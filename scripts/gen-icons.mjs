import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

// Generate a 1024x1024 icon: navy background + cream logo centered
const NAVY = { r: 9, g: 60, b: 93, alpha: 1 }

const sizes = {
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png': 48,
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png': 48,
  'android/app/src/main/res/mipmap-hdpi/ic_launcher.png': 72,
  'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png': 72,
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png': 96,
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png': 96,
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png': 144,
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png': 144,
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png': 144,
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png': 192,
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png': 192,
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png': 192,
}

async function makeIcon(size) {
  const padding = Math.round(size * 0.15)
  const logoSize = size - padding * 2

  const logo = await sharp('public/logo-cream.png')
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background: NAVY }
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer()
}

for (const [relPath, size] of Object.entries(sizes)) {
  const fullPath = path.join(process.cwd(), relPath)
  const buf = await makeIcon(size)
  writeFileSync(fullPath, buf)
  console.log(`✓ ${relPath} (${size}x${size})`)
}

console.log('Done.')
