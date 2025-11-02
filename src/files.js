import * as fs from 'fs';
import * as path from 'path';

export async function readFile(dir, file) {
  const p = path.resolve(dir, file);
  if (!fs.existsSync(p)) throw new Error('File does not exist');
  
  const s = fs.createReadStream(p, 'utf-8');
  return new Promise((res, rej) => {
    s.on('data', c => process.stdout.write(c));
    s.on('end', () => { console.log(); res(); });
    s.on('error', rej);
  });
}

export async function createFile(dir, name) {
  const p = path.resolve(dir, name);
  if (fs.existsSync(p)) throw new Error('File already exists');
  await fs.promises.writeFile(p, '');
}

export async function createDirectory(dir, name) {
  const p = path.resolve(dir, name);
  if (fs.existsSync(p)) throw new Error('Directory already exists');
  await fs.promises.mkdir(p);
}

export async function renameFile(dir, old, newName) {
  const oldP = path.resolve(dir, old);
  if (!fs.existsSync(oldP)) throw new Error('File does not exist');
  const newP = path.join(path.dirname(oldP), newName);
  if (fs.existsSync(newP)) throw new Error('Target file already exists');
  await fs.promises.rename(oldP, newP);
}

export async function deleteFile(dir, file) {
  const p = path.resolve(dir, file);
  if (!fs.existsSync(p)) throw new Error('File does not exist');
  if (fs.statSync(p).isDirectory()) throw new Error('Cannot delete directory');
  await fs.promises.unlink(p);
}