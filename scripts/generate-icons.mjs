import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const sourcesDir = fileURLToPath(new URL('./icon-sources/', import.meta.url))
const iconsDir = fileURLToPath(new URL('../public/icons/', import.meta.url))

await sharp(`${sourcesDir}icon-source.svg`)
  .resize(192, 192)
  .png()
  .toFile(`${iconsDir}icon-192.png`)

await sharp(`${sourcesDir}icon-source.svg`)
  .resize(512, 512)
  .png()
  .toFile(`${iconsDir}icon-512.png`)

await sharp(`${sourcesDir}icon-maskable-source.svg`)
  .resize(512, 512)
  .png()
  .toFile(`${iconsDir}icon-maskable-512.png`)

console.log('Icons generated.')
