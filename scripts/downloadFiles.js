const spawn = require("child_process").spawn;
const path = require("path");
const { fileURLToPath } = require("url");
const axios = require("axios");
const fs = require("fs");

async function downloadFile(url, destination) {
  const mobilertcFolder = path.resolve(__dirname, "..", "android", "mobilertc");
  const buildGradleMobilertc = path.resolve(
    __dirname,
    "..",
    "android",
    "mobilertc",
    "build.gradle"
  );
  const mobilertcAar = path.resolve(
    __dirname,
    "..",
    "android",
    "mobilertc",
    "mobilertc.aar"
  );
  if (!fs.existsSync(mobilertcFolder))
    fs.mkdirSync(mobilertcFolder, { recursive: true });

  if (fs.existsSync(mobilertcAar) && fs.existsSync(buildGradleMobilertc))
    return;

  const writer = fs.createWriteStream(destination);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

const filesToDownload = [
  {
    url: "https://github.com/Mehul112004/zoom_test/releases/download/zoom/build.gradle",
    destination: path.resolve(
      __dirname,
      "..",
      "android",
      "mobilertc",
      "build.gradle"
    ),
  },
  {
    url: "https://github.com/Mehul112004/zoom_test/releases/download/zoom/mobilertc.aar",
    destination: path.resolve(
      __dirname,
      "..",
      "android",
      "mobilertc",
      "mobilertc.aar"
    ),
  },
];

const main = async () => {
  for (const file of filesToDownload) {
    console.log(`Downloading ${file.url}...`);
    await downloadFile(file.url, file.destination);
    console.log(`Downloaded ${file.url} to ${file.destination}`);
  }

  console.log("All files downloaded successfully!");
};

main().catch((error) => {
  console.error("Error downloading files:", error);
});
