const { spawn } = require('child_process');
const path = require('path');

function installZoomSDK() {
  const installProcess = spawn('npm', ['install', 'zoom-msdk-rn'], {
    stdio: 'inherit',
    shell: true
  });

  installProcess.on('error', (error) => {
    console.error(`Error installing package: ${error.message}`);
  });

  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('zoom-msdk-rn installed successfully');
    } else {
      console.error(`Installation failed with code ${code}`);
    }
  });
}

installZoomSDK();