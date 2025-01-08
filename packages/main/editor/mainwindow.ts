import { app, BrowserWindow, globalShortcut, ipcMain, ipcRenderer, Menu, screen, dialog, shell, powerSaveBlocker, session } from "electron";
import path, { join, resolve } from "path";
import { WindowConfig } from '../config/typing';
import { ObEvent, Util, config, fs, MultiLingual, sudo } from "../../common/index";
import { ChildProcess, execFile, exec, spawn } from "child_process";
import { format } from "date-fns";

import { ThirdPartyLauncher, RWHelper, LogHelper, IpHelper } from "../common/index";
import { ExcuteSegmentTask } from "./segmentaion";

// import sudo from "sudo-prompt";

interface BrowserWindowConfig {
	frame: boolean,
	titleBarStyle: "hidden" | "default" | "hiddenInset" | "customButtonsOnHover" | undefined,
	trafficLightPosition: undefined | Electron.Point,
};

export default class MainWindow{

	win?: BrowserWindow;
	windowConfig: WindowConfig;

	childProcess: ChildProcess | undefined;

	platform: string;

	locale: MultiLingual;

	rendererDropped: boolean;

	constructor(config: WindowConfig){
		this.windowConfig = config;
		this.platform = config.platform;
		this.locale = MultiLingual.getInstance(true);
		this.rendererDropped = false;
	}

	/**
	 * 创建 elctron 窗体
	 */
	async createWindow(platform?: string){

		var browserWindowConfig: BrowserWindowConfig = {
			frame: false,
			titleBarStyle: "hidden",
			trafficLightPosition: undefined,
		};

		switch (platform) {
			case "darwin":
				browserWindowConfig.frame = true;
				browserWindowConfig.titleBarStyle = "hiddenInset";
				browserWindowConfig.trafficLightPosition = { x: 10, y: 15 };
				break;
			case "win32":
				break;
			default:
				break;
		}

        const { workArea } = screen.getPrimaryDisplay();

		this.win = new BrowserWindow({
			width: 1280,
			height: 720,
			minWidth: 1280,
			minHeight: 720,
            resizable: false,
            transparent: true,
			title: this.windowConfig.title,
			frame: browserWindowConfig.frame,
			titleBarStyle: browserWindowConfig.titleBarStyle,
			trafficLightPosition: browserWindowConfig.trafficLightPosition,
			icon: this.windowConfig.icon,
			show: false,
			webPreferences: {
				preload: path.join(__dirname, '../preload/index.cjs'),
				devTools: true,
				nodeIntegration: true,
				webviewTag: true,
				webSecurity: false,
				contextIsolation: false,
			}

		});
	
		if (app.isPackaged) {
			this.win.loadFile(path.join(__dirname, '../renderer/index.html'))
		} else {
			// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
			const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
			this.win.loadURL(url);
			// this.win.webContents.openDevTools()
		}

		// 快捷键打开开发者
		if (this.windowConfig.isDev) {
			globalShortcut.register('CommandOrControl+i', () => {
				(this.win as BrowserWindow).webContents.toggleDevTools();
			})
			// 开发模式强制刷新快捷键，用于代码报错修改后重刷
			globalShortcut.register('CommandOrControl+r', () => {
				(this.win as BrowserWindow).webContents.reload()
			});
		} else {
			globalShortcut.register('CommandOrControl+i', () => {
				(this.win as BrowserWindow).webContents.toggleDevTools();
			});
		}

		/** 取消菜单栏 */
		this.initMenu(platform);
 
		/** 启动默认全屏 */
        // TODO: 优化 可记录软件关闭时的状态，下次启动时恢复
		// (this.win as BrowserWindow).maximize();
        // const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
        // (this.win as BrowserWindow).setBounds({ x: 0, y: 0, width: screenWidth, height: screenHeight });

		this.win.show();

		this.initListeners();

		const id = powerSaveBlocker.start('prevent-display-sleep');
		powerSaveBlocker.stop(id);


        // (this.win as BrowserWindow).maximize()
        // (this.win as BrowserWindow).setBounds({ x: 0, y: 200, width: 1920, height: 1080 });
	};

	initMenu(platform?: string) {
		var menuTemplate = null;

		switch (platform) {
			case "darwin":
				menuTemplate = [
					...([{
					  label: app.name,
					  submenu: [
					    { role: 'about' },
					    { type: 'separator' },
					    {
						label: this.locale.t("removeUserData"),
						click: async () => { this.removeUserData() }
					    },
					    { type: 'separator' },
					    { role: 'hide' },
					    { role: 'hideOthers' },
					    { role: 'unhide' },
					    { type: 'separator' },
					    { role: 'quit' }
					  ]
					}]),
				    ]
				break;
			case "win32":
				break;
			default:
				break;
		}

		if (null != menuTemplate) {
			const menu = Menu.buildFromTemplate(menuTemplate as any);
			Menu.setApplicationMenu(menu);
		} else {
			Menu.setApplicationMenu(null);
		}
	}

	/**
	 * 监听 maximize, minimize, close 事件
	 */
	initListeners(){
		const scope = this;

		ipcMain.handle(ObEvent.WECHAT_LOGIN_FINISH, async (event, args) => {
			console.log("Wechat Login Finish", args);
			const defaultSession = session.defaultSession;
			defaultSession.webRequest.onBeforeRequest(null);
		});

		// Handle on event
		/**
		 * 最小化窗口
		 */
		ipcMain.on('WINDOW_MINIMIZE', (event: any, args: any) => {

			(this.win as BrowserWindow).minimize()

		})

		/**
		 * 最大化窗口
		 */
		ipcMain.on('WINDOW_MAXIMIZE', (event: any, args: any) => {

			// const w = this.win as BrowserWindow
			// if(w.isMaximized()){
			// 	w.restore()
			// }else{
			// 	w.maximize()
			// }

		})

		/**
		 * 关闭窗口
		 */
		ipcMain.on(ObEvent.WINDOW_CLOSE, (event: any, args: any) => {
			(this.win as BrowserWindow).close();
		})
		
		/**
		 * 打开开发者
		 */
		ipcMain.on('OPEN_DEV_TOOL', (event: any, args: any) => {

			(this.win as BrowserWindow).webContents.openDevTools()

		})

		ipcMain.on(ObEvent.OPEN_DIRECTORY, async (event: any, args: any) => {

			const path = await dialog.showOpenDialog({ properties: ['openDirectory'] });
			event.returnValue = path;

		})

		ipcMain.on(ObEvent.SAVE_FILE, async (event: any, args: any) => {

			(this.win as BrowserWindow).focus();

			var filters = (args && args.filters) ? args.filters : [ 
				{ name: 'ply', extensions: ['ply'] }, 
				{ name: 'obj', extensions: ['obj'] },
				{ name: 'stl', extensions: ['stl'] } ];

			
			dialog.showSaveDialog({ 
				filters: filters })
				.then( result => {
					var ext = "";
					if(!result.canceled){
						ext = result.filePath?.split(".").pop()?.toLowerCase() as string;
					}
					event.returnValue = { ...result, 'ext': ext };
				})
				.catch( error => {
					console.log("================== error", error);
				});

		});

		ipcMain.on(ObEvent.UI_MOUNTED, (event: any, args: any) => {
			scope.checkNecessary();

			var scaleFactor = screen.getPrimaryDisplay().scaleFactor;
			(this.win as BrowserWindow).webContents.send(ObEvent.SEND_ZOOM_FACTOR, scaleFactor);
            console.log('==============', scaleFactor)
			const allPaths = {
				userData: app.getPath("userData"),
				appData: app.getPath("appData"),
				cache: app.getPath("cache")
			};
			(this.win as BrowserWindow).webContents.send(ObEvent.TEST_CHANNEL, process.env.NODE_ENV);
			
		});

		ipcMain.on(ObEvent.SWITCH_LOCALE, (event: any, args: any) => {
			this.locale.switchLocale(args.targetLocale);
			// TODO: need to reinit menu
			this.initMenu(this.windowConfig.platform);
		});

		ipcMain.on(ObEvent.APP_FORCE_QUIT, (event: any, args: any) => {
			this.quitApp();
		});

		// Handle invoke event
		ipcMain.handle(ObEvent.OPEN_FILE_ASYNC, async (event, args) => {
			const result = await this.openFile(args.filters);

			return result;
		});

		ipcMain.handle(ObEvent.OPEN_DIRECTORY_ASYNC, async (event, args) => {
			const result = await this.openDirectory();

			return result;
		});

		ipcMain.handle(ObEvent.REMOVE_DIRECTORY, async (event, args) => {
			const result = await RWHelper.removeDirectory(args.dir);
			return result;
		});

		ipcMain.handle(ObEvent.OPEN_FILE_OR_DIRECTORY_ASYNC, async (event, args) => {
			const result = await this.openDirectory();

			
			return result;
		});

		ipcMain.handle(ObEvent.SAVE_FILE_ASYNC, async (event, args) => {
			const result = await this.saveFile(args.filters);

			return result;
		});

        ipcMain.handle(ObEvent.IMAGE_SEGMENTAION, async(event, args) => {
            const filePath = args.filePath;
			console.log("MainThread Handle ObEvent.IMAGE_SEGMENTAION", filePath);
            const imgUrl = ExcuteSegmentTask(filePath);
            return imgUrl;
        })

		ipcMain.handle(ObEvent.LAUNCH_BACKEND, async (event, args) => {
			const username = args.username;
			const password = args.password;

			const result = await this.launchBackendUnix2(config.backendPath, username, password);

			console.log(">>>-", result, "-<<<");
			return result;
		});

		ipcMain.handle(ObEvent.WRITE_ARRBUF_TO_DISK, async (event: any, args: any) => {
			// console.log(args);
			return RWHelper.writeArrBufToDisk(args.filename, args.saveDir, args.dataArrBuf);
		});

		ipcMain.handle(ObEvent.WRITE_STR_TO_DISK, async (event: any, args: any) => {
			// console.log(args);
			return RWHelper.writeStrToDisk(args.filename, args.saveDir, args.dataStr);
		});

		ipcMain.handle(ObEvent.SHOW_NATIVE_MESSAGE_DIALOG, async (event: any, args: any) => {
			const message = args.message;

			dialog.showMessageBox({ 
				type: "warning",
				title: "Warning",
				message: message,
				buttons: [this.locale.t("confirm")],
				defaultId: 1,
			})
			.then(() => {
				
			});
		});

		ipcMain.handle(ObEvent.READ_STR_FROM_DISK, async (event: any, args: any) => {
			// console.log(args);
			return RWHelper.readStrFromDisk(args.filename, args.dir);
		});

		ipcMain.handle(ObEvent.VALIDATE_PATH, async (event: any, args: any) => {
			console.log("<<<<-validating", args.path);
			return scope.validatePath(args.path);
		});

		ipcMain.handle(ObEvent.LAUNCH_THIRD_PARTY_APP, async (event: any, args: any) => {
			const appName: string = args.appName;
			const execName: string = args.execName;
			const argsList: string[] | undefined = args.args;
			const result = await ThirdPartyLauncher.launch(this.windowConfig.platform, appName, execName, argsList);

			return result;
		});

        ipcMain.on(ObEvent.WINDOW_RESIZE, (event: any, args: any) => {
            const w: number = args.width as number
            const h: number = args.height as number
            const center: boolean = args.center as boolean
            
            (this.win as BrowserWindow).hide();
            if(center){
                const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
                const x = Math.round((screenWidth - w) / 2);
                const y = Math.round((screenHeight - h) / 2);
                console.log('@@@@@@@@@@@', w, h, screenWidth, screenHeight);
                (this.win as BrowserWindow).setBounds({ x: 0, y: 0, width: screenWidth, height: screenHeight });
                setTimeout(() => {
                    (this.win as BrowserWindow).show();
                }, 1500);
            }
        });

		/** browser window event */
		(this.win as BrowserWindow).on("enter-full-screen", () => {
			(this.win as BrowserWindow).webContents.send(ObEvent.WINDOW_FULLSCREEN, true);
		});

		(this.win as BrowserWindow).on("leave-full-screen", () => {
			(this.win as BrowserWindow).webContents.send(ObEvent.WINDOW_FULLSCREEN, false);
		});

		(this.win as BrowserWindow).on("maximize", () => {
			(this.win as BrowserWindow).webContents.send(ObEvent.WINDOW_MAXIMIZE_UNMAXIMIZE, true);
		});

		(this.win as BrowserWindow).on("unmaximize", () => {
			(this.win as BrowserWindow).webContents.send(ObEvent.WINDOW_MAXIMIZE_UNMAXIMIZE, false);
		});

		(this.win as BrowserWindow).on("close", (event: any) => {
			if (this.rendererDropped) {
				this.quitApp();
			} else {
				this.onAppClose(event);
			}
		});

		(this.win as BrowserWindow).webContents.on("render-process-gone", (event: any) => {
			this.rendererDropped = true;
			
			setTimeout(()=> {
				app.exit();
			}, 3000);
		});
		/** (END) browser window event */

  	}

	parseLog(line: string){

		let timestamp: string = "";
		let level: string = "debug";
		let module: string = "";
		while(line.includes("[") && line.includes("]")){
			const tmp = line.substring(line.indexOf("[") + 1, line.indexOf("]") );
			if(tmp.includes(":") && tmp.includes("-")){
				timestamp = tmp;
			}else if(tmp.includes("info") || tmp.includes("warn") || tmp.includes("error") || tmp.includes("debug")){
				level = tmp == "warning" ? "warn" : tmp;
			}else{
				module = tmp;
			}
			line = line.substring(line.indexOf("]") + 2, line.length);
		}
		let shortDesc: string =  line;
		return { level: level, timestamp: timestamp, module: module, shortDesc: shortDesc, longDesc: ""};

	}

	/**
	 * 检测必要模块
	 */
	checkNecessary() {
		// 检测 ob-xw-wrapper 是否存在
		if(!fs.existsSync(config.addonPath)){
			const msg = Util.getCurrentTime() + " [Necessary] " + "[error] ob-xw-wrapper doesn't exist";
			(this.win as BrowserWindow).webContents.send(ObEvent.LOG_BUFFER_CHANGED, this.parseLog(msg));
		}

		// 检测 backend 是否存在
		if(!fs.existsSync(config.backendPath)){
			const msg = Util.getCurrentTime() + " [Necessary] " + "[error] Backend application doesn't exist";
			(this.win as BrowserWindow).webContents.send(ObEvent.LOG_BUFFER_CHANGED, this.parseLog(msg));
		}else{
			// 启动后端应用
			this.launchBackend(config.backendPath);
		}
	}

	/** Launch backend */
	launchBackend(path: string) {
		switch (this.windowConfig.platform) {
			case "darwin":
				break;
			case "win32":
				this.launchBackendWin(path);
				break;
			default:
				break;
		}

	};

	launchBackendWin(path: string) {
		const scope = this;

		const child = spawn(
			path,
			[
				config.logBasePath
			],
			{
				windowsHide: false,
				timeout: 0,
				killSignal: 'SIGTERM',
				detached: false,
				stdio: ['ignore', 'pipe', 'pipe'], // 标准输入被忽略，标准输出和错误流使用管道
			}
		);
		
		child.stdout?.on('data', (data: any) => {
			console.log(data.toString());
		});
		child.stderr?.on('data', (data: any) => {
			// console.log("[ ChildProcess ] : stderror " + data);
		});
		child.on("close", (code: any) => {
			console.log("[ ChildProcess ] : Close with code : " + code);
			if (this.childProcess) {
				this.childProcess = undefined;
			}
			// TODO: backend will be launched after actively closed
			this.launchBackend(config.backendPath);
		});

		this.childProcess = child;
	};

	// Launch unix backend using sudo command
	async launchBackendUnix2(path: string, username: string, password: string) {
		console.log("username: " + username, "password: " + password);
		return new Promise((res, rej) => {
			// `echo ${password} | sudo -S \"${path}\"`
			const child = exec(
				`echo ${password} | sudo -S \"${path}\"`,
				{
					windowsHide: false,
					maxBuffer: 1024 * 1024 * 100,
					timeout: 0,
					killSignal: 'SIGTERM',
					// detached: true,
					// priority: 'high'
				}, (error: any, stdout: any, stderr: any) => {
					console.log("!!!!!!!!!!!!!!!!!!!!!error: ", error);
					console.log("!!!!!!!!!!!!!!!!!!!!!stdout: ", stdout);
					console.log("!!!!!!!!!!!!!!!!!!!!!stderr:>>" + stderr + "<<<");
					if (error) {
						this.childProcess = undefined;
						res(false);
					} else {
						res(true);
					}
					
				
			});
	
			setTimeout(()=> {
				res(true);
			}, 3000);
	
			this.childProcess = child;
			this.childProcess.unref();
		})
		
	};
	/** (END) Launch backend */

	async removeUserData() {
		console.log(app.getPath("userData"));
		dialog.showMessageBox({
			type: "warning",
			title: "Warning",
			message: this.locale.t("removeUserDataPrompt"),
			buttons: [this.locale.t("yes"), this.locale.t("no")],
			defaultId: 0,
		})
		.then((it) => {
			console.log("result", it);
			if (0 == it.response) {
				console.log(app.getPath("userData"));
				// Remove local storage
				fs.rmSync(path.join(app.getPath("userData"), "Local Storage"), { recursive: true });
			
				// (this.win as BrowserWindow).webContents.send(ObEvent.REMOVE_LOCALSTORAGE, app.getPath("userData"));
				dialog.showMessageBox({
					type: "info",
					message: this.locale.t("removeUserDataSucceed"),
					buttons: [this.locale.t("confirm")],
				});
			}
		});
	};

	async openFile(filters: any) {
		(this.win as BrowserWindow).focus();

		var filters = undefined != filters ? filters : [ 
			{ name: '*(ply, obj, stl)', extensions: ['ply', 'obj', 'stl'] },
			{ name: 'ply', extensions: ['ply'] }, 
			{ name: 'obj', extensions: ['obj'] },
			{ name: 'stl', extensions: ['stl'] } ];

		const result = await dialog.showOpenDialog(
			(this.win as BrowserWindow),
			{
				properties: ['openFile', 'promptToCreate'],
				filters:filters
			}
		)
		.catch( error => {
			console.log("================== error", error);
		});

		
		var ext = "";
		if(result && !result.canceled){
			ext = result.filePaths[0].split(".").pop()?.toLowerCase() as string;
		}
		return { ...result, 'ext': ext };
	}

	async openDirectory() {
		(this.win as BrowserWindow).focus();

		const path = await dialog.showOpenDialog(
			(this.win as BrowserWindow),
			{ properties: ['openDirectory'] }
		);
		return path;
	}

	async openFileOrDirectory() {
		(this.win as BrowserWindow).focus();

		let filters = [ 
			{ name: '*(ply, obj, stl)', extensions: ['ply', 'obj', 'stl'] },
			{ name: 'ply', extensions: ['ply'] }, 
			{ name: 'obj', extensions: ['obj'] },
			{ name: 'stl', extensions: ['stl'] } ];

		const result = await dialog.showOpenDialog(
			(this.win as BrowserWindow),
			{
				properties: ['openDirectory', 'openFile'],
				filters:filters
			}
		)
		.catch( error => {
			console.log("================== error", error);
		});

		console.log(result);
		
		return result;
	}

	async saveFile(filters: any) {
		(this.win as BrowserWindow).focus();

		var filters = undefined != filters ? filters : [ 
			{ name: 'ply', extensions: ['ply'] }, 
			{ name: 'obj', extensions: ['obj'] },
			{ name: 'stl', extensions: ['stl'] } ];

		
		const result = await dialog.showSaveDialog(
			(this.win as BrowserWindow),
			{ filters:filters }
		);

		var ext = "";
		if(result && !result.canceled){
			ext = result.filePath?.split(".").pop()?.toLowerCase() as string;
		}
		return { ...result, 'ext': ext };
	};

	isRunning(query: any, cb: any) {
		let platform = process.platform;
		let cmd = '';
		switch (platform) {
			case 'win32' : cmd = `tasklist`; break;
			case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
			case 'linux' : cmd = `ps -A`; break;
			default: break;
		}
		exec(cmd, (err, stdout, stderr) => {
			console.log("Message: ", stdout);
			cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
		});
	};

	viewProcessMessage(name: any, cb: Function) {
		let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
		exec(cmd, function (err, stdout, stderr) {
		  if (err) {
		    return console.error(err)
		  }
		  stdout.split('\n').filter((line) => {
		    let processMessage = line.trim().split(/\s+/)
		    let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
		    if (processName === name) {
			return cb(processMessage[1])
		    }
		  })
		});
	};

	// cur >= target
	version3GE(current: string, target: string): boolean|null {
		const validVersionLength = 3;

		const currentVersionArr = current.split(".");
		const targetVersionArr = target.split(".");

		if (validVersionLength != currentVersionArr.length || validVersionLength != targetVersionArr.length) {
		    return null;
		}

		function compareVersionArr(curVerArr: string[], tarVerArr: string[], cur: number):boolean {
		    const curVerInt = parseInt(curVerArr[cur]);
		    const tarVerInt = parseInt(tarVerArr[cur]);

		    if (curVerInt < tarVerInt) { return false; }
		    else if ((curVerInt > tarVerInt) || (curVerArr.length-1 <= cur)) { return true; }


		    return compareVersionArr(curVerArr, tarVerArr, cur+1);
		}

		return compareVersionArr(currentVersionArr, targetVersionArr, 0);
	};

	/** Handle app close behavior */
	onAppClose(event: any) {
		event.preventDefault();

		switch (this.windowConfig.platform) {
			case "win32":
				this.onAppCloseWin();
				break;
			case "darwin":
			default:
				this.onAppCloseUnix();
				break;
		}
	};

	onAppCloseWin() {
		(this.win as BrowserWindow).webContents.send(ObEvent.QUIT_APP);
	};

	onAppCloseUnix() {
		if (undefined == this.childProcess) {
			this.quitApp();
			return;
		}


		dialog.showMessageBox({
			type: "warning",
			title: "Warning",
			message: this.locale.t("closeAppPrompt"),
			buttons: [ this.locale.t("yes"), this.locale.t("no") ],
			defaultId: 0,
		})
		.then(async (it) => {
			if (0 == it.response) {
				(this.win as BrowserWindow).webContents.send(ObEvent.QUIT_APP);
			}
		});
	};
	/** (END) Handle app close behavior */

	quitApp() {
		(this.win as BrowserWindow).removeAllListeners();
		app.exit();
	};

	validatePath(path: string) {
		if (fs.existsSync(path)) {
			return true;
		}

		return false;
	};
}
