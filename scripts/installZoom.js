const { spawn } = require("child_process");
const path = require("path");

function installZoomSDK() {
  const installProcess = spawn(
    "yarn",
    ["add", "@zoom/meetingsdk-react-native"],
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
      console.log("@zoom/meetingsdk-react-native installed successfully");
    } else {
      console.error(`Installation failed with code ${code}`);
    }
  });
}

installZoomSDK();
