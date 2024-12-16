const { spawn } = require('child_process');
const path = require('path');

function removeZoom() {
  const installProcess = spawn('npm', ['uninstall', 'zoom-msdk-rn'], {
    stdio: 'inherit',
    shell: true
  });

  installProcess.on('error', (error) => {
    console.error(`Error installing package: ${error.message}`);
  });

  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('zoom-msdk-rn uninstalled successfully');
    } else {
      console.error(`Uninstallation failed with code ${code}`);
    }
  });
}

removeZoom();