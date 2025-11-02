import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { pipeline } from 'stream/promises';

export async function compressFile(dir, src, dst) {
  const s = path.resolve(dir, src);
  const d = path.resolve(dir, dst);
  if (!fs.existsSync(s)) throw new Error('Source file does not exist');
  
  await pipeline(
    fs.createReadStream(s),
    zlib.createBrotliCompress(),
    fs.createWriteStream(d)
  );
}

export async function decompressFile(dir, src, dst) {
  const s = path.resolve(dir, src);
  const d = path.resolve(dir, dst);
  if (!fs.existsSync(s)) throw new Error('Source file does not exist');
  
  await pipeline(
    fs.createReadStream(s),
    zlib.createBrotliDecompress(),
    fs.createWriteStream(d)
  );
}