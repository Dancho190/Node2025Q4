import { createInterface } from 'readline/promises';
import { stdin, stdout } from 'process';
import { homedir } from 'os';
import { goUp, changeDirectory, listDirectory } from './src/navigation.js';
import { readFile, createFile, createDirectory, renameFile, deleteFile } from './src/files.js';
import { copyFile, moveFile } from './src/operations.js';
import { showOSInfo } from './src/os-info.js';
import { calculateHash } from './src/hash.js';
import { compressFile, decompressFile } from './src/compression.js';

const userArg = process.argv.find(arg => arg.startsWith('--username='));
const username = userArg ? userArg.split('=')[1] : 'User';
let currentDir = homedir();
const rl = createInterface({ input: stdin, output: stdout });

function showDir() {
  console.log(`\nYou are currently in ${currentDir}`);
}

async function handleCommand(input) {
  const [cmd, ...args] = input.trim().split(' ');
  if (!cmd) return;
  
  try {
    if (cmd === 'up') {
      currentDir = goUp(currentDir);
    } else if (cmd === 'cd') {
      if (!args[0]) 
        throw new Error('Invalid input');
      currentDir = changeDirectory(currentDir, args[0]);
    } else if (cmd === 'ls') {
      await listDirectory(currentDir);
    } else if (cmd === 'cat') {
      if (!args[0]) 
        throw new Error('Invalid input');
      await readFile(currentDir, args[0]);
    } else if (cmd === 'add') {
      if (!args[0]) 
        throw new Error('Invalid input');
      await createFile(currentDir, args[0]);
    } else if (cmd === 'mkdir') {
      if (!args[0]) 
        throw new Error('Invalid input');
      await createDirectory(currentDir, args[0]);
    } else if (cmd === 'rn') {
      if (args.length < 2) 
        throw new Error('Invalid input');
      await renameFile(currentDir, args[0], args[1]);
    } else if (cmd === 'rm') {
      if (!args[0]) 
        throw new Error('Invalid input');
      await deleteFile(currentDir, args[0]);
    } else if (cmd === 'cp') {
      if (args.length < 2) 
        throw new Error('Invalid input');
      await copyFile(currentDir, args[0], args[1]);
    } else if (cmd === 'mv') {
      if (args.length < 2) 
        throw new Error('Invalid input');
      await moveFile(currentDir, args[0], args[1]);
    } else if (cmd === 'os') {
      if (!args[0]) 
        throw new Error('Invalid input');
      showOSInfo(args[0]);
    } else if (cmd === 'hash') {
      if (!args[0]) 
        throw new Error('Invalid input');
      await calculateHash(currentDir, args[0]);
    } else if (cmd === 'compress') {
      if (args.length < 2) 
        throw new Error('Invalid input');
      await compressFile(currentDir, args[0], args[1]);
    } else if (cmd === 'decompress') {
      if (args.length < 2) 
        throw new Error('Invalid input');
      await decompressFile(currentDir, args[0], args[1]);
    } else if (cmd === '.exit') {
      console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
      process.exit(0);
    } else {
      console.log('Invalid input');
    }
  } catch (error) {
    console.log('Operation failed');
  }
}

async function main() {
  console.log(`Welcome to the File Manager, ${username}!`);
  showDir();
  
  while (true) {
    try {
      const input = await rl.question('');
      await handleCommand(input);
      showDir();
    } catch {
      break;
    }
  }
}

process.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

main();