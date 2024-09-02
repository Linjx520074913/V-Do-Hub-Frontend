import { spawn } from "child_process";


/** static class */
class SoftwareUpdater {
      static update(platform: string, installerPath: string, callback: Function) {
            switch(platform) {
                  case "darwin":
                        SoftwareUpdater.updateAppDarwin(installerPath);
                        break;
                  case "win32":
                        SoftwareUpdater.updateAppWin(installerPath);
                        break;
                  default:
                        break;
            }

            callback();
      };

      static updateAppWin(installerPath: string) {
		let command: string = "";
		let commandArgs: string[] = [];

		command = installerPath;
		commandArgs = [ "auto" ];

		console.log(command, commandArgs);
		const child = spawn(
			command,
			commandArgs,
			{
				windowsHide: false,
				timeout: 0,
				killSignal: 'SIGTERM',
				detached: true,
				stdio: ['ignore', 'pipe', 'pipe'], // 标准输入被忽略，标准输出和错误流使用管道
			}
		);
	};

	static updateAppDarwin(installerPath: string) {
		let command: string = "";
		let commandArgs: string[] = [];

		command = "open";
		commandArgs = [ installerPath ];

		console.log(command, commandArgs);
		const child = spawn(
			command,
			commandArgs,
			{
				windowsHide: false,
				timeout: 0,
				killSignal: 'SIGTERM',
				detached: true,
				stdio: ['ignore', 'pipe', 'pipe'], // 标准输入被忽略，标准输出和错误流使用管道
			}
		);
	};

	updateAppUni(platform: string, installerPath: string) {
		let command: string = "";
		let commandArgs: string[] = [];

		switch (platform) {
			case "darwin":
				command = "open";
				commandArgs = [ installerPath ];
				break;
			case "win32":
			default:
				command = installerPath;
				commandArgs = [ "auto" ];
				break;
		}

		console.log(command, commandArgs);
		const child = spawn(
			command,
			commandArgs,
			{
				windowsHide: false,
				timeout: 0,
				killSignal: 'SIGTERM',
				detached: true,
				stdio: ['ignore', 'pipe', 'pipe'], // 标准输入被忽略，标准输出和错误流使用管道
			}
		);
	};
}

export default SoftwareUpdater;