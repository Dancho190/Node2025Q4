import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { pipeline } from 'stream/promises';

export async function calculateHash(dir, file) {
  const p = path.resolve(dir, file);
  if (!fs.existsSync(p)) throw new Error('File does not exist');
  
  const h = crypto.createHash('sha256');
  await pipeline(fs.createReadStream(p), h);
  console.log(h.digest('hex'));
}