const { execSync } = require('child_process');
const os = require('os');

if (os.platform() === 'win32') {
  execSync('npm install @rollup/rollup-win32-x64-msvc@4.18.0', { stdio: 'inherit' });
}