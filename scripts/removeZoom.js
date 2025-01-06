const { spawn } = require("child_process");
const path = require("path");

function removeZoom() {
  const installProcess = spawn(
    "yarn",
    ["remove", "@zoom/meetingsdk-react-native"],
    {
      stdio: "inherit",
      shell: true,
    }
  );

  installProcess.on("error", (error) => {
    console.error(`Error installing package: ${error.message}`);
  });

  installProcess.on("close", (code) => {
    if (code === 0) {
      console.log("@zoom/meetingsdk-react-native uninstalled successfully");
    } else {
      console.error(`Uninstallation failed with code ${code}`);
    }
  });
}

removeZoom();
