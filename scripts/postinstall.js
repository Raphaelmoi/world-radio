const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");

try {
  if (fs.existsSync("public/cesium")) {
    fs.rmSync("public/cesium", { recursive: true, force: true });
  }

  if (os.platform() === "win32") {
    execSync("xcopy /E /I node_modules\\cesium\\Build\\Cesium public\\cesium", { stdio: "inherit", shell: "cmd.exe" });
  } else {
    execSync("cp -r node_modules/cesium/Build/Cesium public/cesium", { stdio: "inherit" });
  }
  console.log("✅ Cesium successfully copied !");
} catch (error) {
  console.error("❌ Error copying cesium :", error);
  process.exit(1);
}
