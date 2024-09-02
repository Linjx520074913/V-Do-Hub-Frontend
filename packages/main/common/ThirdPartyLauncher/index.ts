import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";

/** static class */
class ThirdPartyLauncher {
  static async launch(platform: string, appName: string, execName: string, args?: string[]): Promise<boolean> {
      let executablePath: string | null = null;
      let commandArgs: string[] = args ? args : [];

      switch(platform) {
            case "darwin":
                  executablePath = await ThirdPartyLauncher.getAppExecPathDarwin(appName);
                  // commandArgs = ["-e", ...commandArgs];     // Add -e flag in darwin
                  break;
            case "win32":
                  executablePath = await ThirdPartyLauncher.getAppExecPathWin(execName);
                  break;
            default:
                  break;
      }

      if (!executablePath) {
            return false;
      }

      // Code to launch the third-party application
      let command: string = "";


      command = `${executablePath}`;

      console.log(command, commandArgs.join(" "));
      try {
            const child = spawn(
                  command,
                  commandArgs,
                  {
                        windowsHide: true,
                        timeout: 0,
                        killSignal: 'SIGTERM',
                        detached: true,
                        stdio: 'ignore', // 标准输入被忽略，标准输出和错误流使用管道
                  }
            );

            return true;
      } catch (e) {
            return false;
      }
  };

  static getAppExecPathDarwin(appName: string): Promise<string | null> {
      return new Promise((resolve, reject) => {
          exec(
            `mdfind "kMDItemFSName == '${appName}.app'"`,
            (err, stdout, stderr) => {
                  if (err) {
                        resolve(null);
                  }

                  // stdout contains paths to found applications, we take the first one
                  const appPaths: string[] = stdout.trim().split("\n");
                  
                  // Use 1st path as default
                  let appPath = 0 < appPaths.length ? appPaths[0] : null;

                  // Find best matches
                  for (let i = 0; i < appPaths.length; i++) {
                        if (-1 != appPaths[i].search("/Applications/")) {
                              appPath = appPaths[i];
                              break;
                        }
                  }

                  if (appPath) {
                        // Find executable here
                        const macOSPath = `${appPath}/Contents/MacOS`;
                        const execPaths: string[] = ThirdPartyLauncher.findExecutables(macOSPath);

                        // Construct the path to the executable within the .app bundle
                        if (0 < execPaths.length) {
                              const executablePath = execPaths[0];
                              resolve(executablePath);
                        } else {
                              resolve(null);
                        }
                  } else {
                        resolve(null); // Application not found
                  }
          });
      });
  };

  static async getAppExecPathWin(execName: string): Promise<string | null> {
      function searchWinRegistry(entryPath: string, execName: string): Promise<string | null> {
            return new Promise((resolve, reject) => {
                  try {
                        exec(
                              `reg query ${entryPath} /s /f "${execName}.exe"`,
                              (err, stdout, stderr) => {
            
                                    if (err) {
                                          resolve(null);
                                    }
                        
                                    // Extract installation directory from the stdout
                                    let matches: string[] = stdout.trim().split("\n").filter(val => -1 != val.search("REG_SZ"));
                                    // console.log(matches);
                                    if (0 < matches.length) {
                                          let match = matches[0].split("REG_SZ");
                                          const executablePath = match[match.length-1].trim();

                                          // console.log(executablePath);
            
                                          resolve(executablePath);
                                    } else {
                                          resolve(null);
                                    }
                              }
                        );
                  } catch(e) {
                        resolve(null);
                  }
            });
      };

      // Search in multiple regist entries
      const targetRegistEntries: string[] = [
            "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths",
            "HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall"
      ]

      let exePaths: string[] = [];

      for(let i = 0; i < targetRegistEntries.length; i++) {
            const res: string|null = await searchWinRegistry(targetRegistEntries[i], execName);

            if (res) {
                  exePaths.push(res);
            }
      }

      if (0 < exePaths.length) {
            return exePaths[0];
      } else {
            return null;
      }
  };

  static isExecutable(filePath: string): boolean {
      try {
            fs.accessSync(filePath, fs.constants.X_OK);
            return true;
          } catch (err) {
            return false;
      }
  };

  static findExecutables(dir: string): string[] {
      let results: string[] = [];
    
      // Read the contents of the directory
      const list = fs.readdirSync(dir);
      // console.log(list);
    
      list.forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
      
            // Skip directories
            if (stat && stat.isDirectory()) {
                  return;
            }

            if (ThirdPartyLauncher.isExecutable(filePath)) {
                  results.push(filePath);
            }
      });
    
      return results;
  }
};

export default ThirdPartyLauncher;
