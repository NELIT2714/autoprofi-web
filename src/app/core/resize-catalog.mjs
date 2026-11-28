import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const input = '../../../public/images/cars';
const output = '../../../public/images/catalog';

for (const file of readdirSync(input)) {
  await sharp(`${input}/${file}`)
    .resize(1200, 675, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(`${output}/${file.replace(/\.\w+$/, '.webp')}`);
}
