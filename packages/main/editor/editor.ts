import { app, protocol, BrowserWindow, ipcMain, shell, HandlerDetails } from 'electron'
import MainWindow from './mainwindow'
import { windowConfig } from '../config/config'
import { ObEvent } from '../../common/index';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.commandLine.appendSwitch('js-flags', '--expose-gc');
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=30720");
app.commandLine.appendSwitch("--no-sandbox");

const isDevelopment = process.env.NODE_ENV !== 'production'
export default class Editor{

	mainWindow?: MainWindow

	constructor(){

		this.initWindows();
		this.initApp();
		
	}

	initWindows(){

		this.mainWindow = new MainWindow(windowConfig)

	}

	initApp(){


		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit()
			}
		})

		app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) (this.mainWindow as MainWindow).createWindow(process.platform)

		})

        app.whenReady().then(() => {

            (this.mainWindow as MainWindow).win!.webContents!.setWindowOpenHandler((details: HandlerDetails) => {
                let url = (details.url as string)
                shell.openExternal(url)
                return { action: "deny" }
            })
        })

		app.on('ready', async () => {
            app.commandLine.appendSwitch('force-device-scale-factor', '1');
            app.commandLine.appendSwitch('high-dpi-support', '1');
			(app as any).allowRendererProcessReuse=false;
			await (this.mainWindow as MainWindow).createWindow(process.platform)  
		})

		app.on("window-all-closed", () => {
			if(process.platform !== "darwin"){
				app.quit()
			}
		})

	
		ipcMain.on(ObEvent.APP_RELAUNCH, (event: any, args: any) => {
	
			app.relaunch();
			app.exit(0)
	
		});

		if (isDevelopment) {
			if (process.platform === 'win32') {
				process.on('message', (data) => {
					if (data === 'graceful-exit') {
						app.quit()
					}
				})
			} else {
				process.on('SIGTERM', () => {
					app.quit()
				})
			}
		}

	}

}
