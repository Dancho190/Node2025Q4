import * as fs from 'fs';
import * as path from 'path';

export function validateArgsCount(args, minCount) {
  if (args.length < minCount) {
    throw new Error('Invalid input');
  }
}

export function validateFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist');
  }
  if (fs.statSync(filePath).isDirectory()) {
    throw new Error('Path is a directory, not a file');
  }
}

export function validateDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    throw new Error('Directory does not exist');
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    throw new Error('Path is not a directory');
  }
}

export function validateFileNotExists(filePath) {
  if (fs.existsSync(filePath)) {
    throw new Error('File already exists');
  }
}

export function parseUsername(argv) {
  const arg = argv.find(a => a.startsWith('--username='));
  return arg ? arg.split('=')[1] : 'User';
}

export function validateOSFlag(flag) {
  const validFlags = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];
  if (!validFlags.includes(flag)) {
    throw new Error('Invalid OS flag');
  }
}

export function validatePathEmpty(pathStr) {
  if (!pathStr || pathStr.trim() === '') {
    throw new Error('Path cannot be empty');
  }
}

export function resolvePath(currentDir, targetPath) {
  return path.resolve(currentDir, targetPath);
}