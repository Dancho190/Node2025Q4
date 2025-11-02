import * as fs from 'fs';
import * as path from 'path';

export function goUp(dir) {
  const p = path.dirname(dir);
  return p !== dir ? p : dir;
}

export function changeDirectory(dir, target) {
  const p = path.resolve(dir, target);
  if (!fs.existsSync(p)) throw new Error('Path does not exist');
  if (!fs.statSync(p).isDirectory()) throw new Error('Not a directory');
  return p;
}

export async function listDirectory(dir) {
  const items = await fs.promises.readdir(dir, { withFileTypes: true });
  
  const folders = items.filter(i => i.isDirectory())
    .map(i => ({ Name: i.name, Type: 'directory' }))
    .sort((a, b) => a.Name.localeCompare(b.Name));
  
  const files = items.filter(i => i.isFile())
    .map(i => ({ Name: i.name, Type: 'file' }))
    .sort((a, b) => a.Name.localeCompare(b.Name));
  
  const r = [...folders, ...files];
  r.length === 0 ? console.log('Empty directory') : console.table(r);
}