// const { BuildResult } =  require("electron-builder");
const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");


const appName = pkg.name;
const appVersion = pkg.version;
const icnsPath = "../../build/mac/logo.icns";
const targetName = appName + "_" + appVersion;
const appFullName = appName + ".app";

function removeFiles(paths) {
      paths.forEach((path) => {
            fs.unlinkSync(path);
      })

};

async function makeDmg(targetName, appPath, icnsPath, targetDir, arch) {
      console.log("Making dmg...");

      const targetNameWithArch = targetName + "_" + arch;
      const targetNameWithExt = targetNameWithArch + ".dmg";
      const targetFullPath = path.join(targetDir, targetNameWithExt);

      const appdmg = require("appdmg");
      const ee = appdmg({
            target: targetFullPath,
            basepath: targetDir,
            specification: {
                  title: targetNameWithArch,
                  icon: icnsPath,
                  contents: [
                        { "x": 448, "y": 170, "type": "link", "path": "/Applications" },
                        { "x": 192, "y": 170, "type": "file", "path": appPath }
                  ],
                  "format": "UDBZ"
            }
      });

      ee.on("progress", (info) => {
            if (undefined != info.title) {
                  console.log(
                        "DMG [" +
                        info.current + "/" + info.total + "] - " + info.title
                  )
            }
      });

      ee.on("finish", () => {
            console.log("DMG - " + arch + " Done");
      });

      ee.on("error", (err) => {
            console.log(err);
      });
};

async function makeUniversal(x64AppPath, arm64AppPath, outAppPath) {

      console.log("Making universal...");

      const { makeUniversalApp } = require("@electron/universal");
      return await makeUniversalApp({
            x64AppPath: x64AppPath,
            arm64AppPath: arm64AppPath,
            outAppPath: outAppPath,
            force: true,
            x64ArchFiles: "*"
      });
};

async function appSign(appPath) {

      console.log("Signing...");

      const { signAsync } = require("@electron/osx-sign");
      return await signAsync({
            app: appPath
      });
};

async function appNotarize(appPath) {

      console.log("Notarizing...");

      const { notarize } = require("electron-notarize");
      return await notarize({
            tool: "notarytool",
            teamId: "",
            appBundleId: 'com.orbbec.xuanwuclient',
            appPath: appPath,
            appleId: "",
            appleIdPassword: "",
      });
};

function isDarwin() {
      return "darwin" === process.platform;
}

exports.default = async function afterBuild(context) {

      if (!isDarwin()) {
            return;
      }

      const outDir = context.outDir;
      
      const x64AppPath = path.join(outDir, "mac", appFullName);
      const arm64AppPath = path.join(outDir, "mac-arm64", appFullName);
      const universalAppPath = path.join(outDir, "mac-universal", appFullName);

      // const electronArtifactPaths = context.artifactPaths;
      // electronArtifactPaths.forEach((artifactPath) => {
      //       removeFilePath(artifactPath);
      // });


      await makeUniversal(
            x64AppPath,
            arm64AppPath,
            universalAppPath
      )


      await appSign(universalAppPath);

      await appNotarize(universalAppPath);
      
      await makeDmg(targetName, universalAppPath, icnsPath, outDir, "universal");
};