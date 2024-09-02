import fs from "fs";
import path from "path";


/** Static Class */
class RWHelper {
      static async writeArrBufToDisk(filename: string, dir: string, data: ArrayBuffer): Promise<string> {
		console.log(dir);
		return new Promise((res, rej) => {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
	
			const fullPath = path.join(dir, filename);
	
			fs.writeFile(fullPath, new Uint8Array(data), (err) => {
				res(fullPath);
				if (err) {
					rej(err);
				}
			});
		});
		
	};

	static async writeStrToDisk(filename: string, dir: string, data: string): Promise<string> {
		console.log(dir);
		return new Promise((res, rej) => {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
	
			const fullPath = path.join(dir, filename);
	
			fs.writeFile(fullPath, data, (err) => {
				res(fullPath);
				if (err) {
					rej(err);
				}
			});
		});
		
	};

	static async readStrFromDisk(filename: string, dir: string): Promise<string> {
		const fullPath = path.join(dir, filename);
		return new Promise((res, rej) => {
			if (!fs.existsSync(fullPath)) {
				rej("file path not exist");
			}

			fs.readFile(fullPath, "utf-8", (err, data) => {
				if (err) {
					rej("");
				}

				res(data);
			});

		});
	};

	static async removeFileFromDisk(filePath: string): Promise<void> {
		return new Promise((res, rej) => {
			fs.unlink(filePath, (err) => {
				if (err) {
					rej(err);
				} else {
					res();
				}
			})
		})
	};

	static async removeDirectory(dir: string): Promise<void> {
		return new Promise(async (res, rej) => {
			await fs.rmdirSync(dir, { recursive: true });
			res();
		});
	};
}

export default RWHelper;