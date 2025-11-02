
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';

export async function copyFile(dir, src, dst) {
  const s = path.resolve(dir, src);
  if (!fs.existsSync(s)) throw new Error('Source file does not exist');
  
  let d = path.resolve(dir, dst);
  if (fs.existsSync(d) && fs.statSync(d).isDirectory()) {
    d = path.join(d, path.basename(s));
  }
  if (fs.existsSync(d)) throw new Error('Destination file already exists');
  
  await pipeline(fs.createReadStream(s), fs.createWriteStream(d));
}

export async function moveFile(dir, src, dst) {
  await copyFile(dir, src, dst);
  await fs.promises.unlink(path.resolve(dir, src));
}