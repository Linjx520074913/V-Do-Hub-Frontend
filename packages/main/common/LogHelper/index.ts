import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { RWHelper } from "../index";


/** Static Class */
class LogHelper {
      // Function to get the most recent txt files
	static async getRecentTxtFiles(dir: string, startWith: string, count: number): Promise<string[]> {
		if (!fs.existsSync(dir)) {
			return [];
		}

		const files = fs.readdirSync(dir);
		const txtFiles = files.filter(file => file.startsWith(startWith));
	
		const fileStats = await Promise.all(
			txtFiles.map(async file => {
				const filePath = path.join(dir, file);
				const stats = fs.statSync(filePath);
				return { filePath, mtime: stats.mtime };
			})
		);
	
		fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
	
		return fileStats.slice(0, count).map(fileStat => fileStat.filePath);
  	}

	// Function to create a Zip file in memory using JSZip
	static async createZipBuffer(filePaths: string[]): Promise<ArrayBuffer> {
		const zip = new JSZip();
	
		for (const filePath of filePaths) {
			if (fs.existsSync(filePath)) {
				try {
					const data = fs.readFileSync(filePath);
					console.log(`Adding ${filePath} to zip`, data.length);
					zip.file(path.basename(filePath), data);
				} catch (err) {
					console.log("file fetch err: ", err);
				}

			}
		}
	
		const zipContent = await zip.generateAsync({ type: "arraybuffer" });

		return zipContent;
	}
	
	// Function to create a File from an ArrayBuffer
	static createFileFromArrayBuffer(arrayBuffer: ArrayBuffer, fileName: string, mimeType: string = "application/zip"): File {
		return new File([arrayBuffer], fileName, { type: mimeType });
	}

	static async getZippedLogs(LocalLogConfigs: { dir: string, startWith: string, num: number }[]): Promise<ArrayBuffer|null> {
		let allLogsPaths = [];

		try {

			for (const config of LocalLogConfigs) {
				const logPaths = await LogHelper.getRecentTxtFiles(config.dir, config.startWith, config.num);
				allLogsPaths.push(...logPaths);
			}

			if (0 < allLogsPaths.length) {
				const zippedArrBuf = await LogHelper.createZipBuffer(allLogsPaths);
				
				return zippedArrBuf;
			}

		} catch (err) {
			console.log(err);
		};

		return null;
	}
}

export default LogHelper;