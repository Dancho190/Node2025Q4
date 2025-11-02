import * as os from 'os';

export function showOSInfo(flag) {
  switch (flag) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;
    case '--cpus':
      const c = os.cpus();
      c.forEach((cpu, i) => {
        console.log(`CPU ${i + 1}: ${cpu.model}, ${(cpu.speed / 1000).toFixed(2)} GHz`);
      });
      break;
    case '--homedir':
      console.log(os.homedir());
      break;
    case '--username':
      console.log(os.userInfo().username);
      break;
    case '--architecture':
      console.log(process.arch);
      break;
    default:
      throw new Error('Invalid OS flag');
  }
}