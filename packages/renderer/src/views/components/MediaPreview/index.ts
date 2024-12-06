import fs from 'fs'
import path from 'path'
import { ref } from 'vue'
import { MediaType } from '@/store/index'
interface MediaMeta {
    name: string,
    type: MediaType,
    url: string,
    key: number
}

function findFilesWithExtensions(filePath: string, extensions: string[]): { data: MediaMeta[]; hasVideo: boolean } {
    let data: MediaMeta[] = []
    let hasVideo = false

    function traverseFolder(currentPath: string) {
        const files = fs.readdirSync(currentPath)

        for (const file of files) {
            const fullPath = path.join(currentPath, file)
            const stats = fs.statSync(fullPath)

            if (stats.isDirectory()) {
                // 递归遍历子文件夹
                traverseFolder(fullPath)
            } else if (stats.isFile() && extensions.some(ext => fullPath.endsWith(ext))) {
                // 添加符合后缀条件的文件
                const fileName = path.basename(fullPath)
                const fileExt = path.extname(fullPath)
                if(fileExt.includes('.mp4')){
                    hasVideo = true
                }

                const type: MediaType = fileExt === '.png' ? MediaType.IMAGE : MediaType.VIDEO;
                data.push({ name: fileName, type: type, url: fullPath, key: Date.now()});
            }
        }
    }
    
    if(filePath){
        const stats = fs.statSync(filePath);
        if(stats.isDirectory()){
            traverseFolder(filePath)
        }else if(stats.isFile()){
            const fileExt = path.extname(filePath)
            hasVideo = fileExt === '.mp4'
            const type = fileExt === '.mp4'? MediaType.VIDEO : MediaType.IMAGE
            data.push({ name: path.basename(filePath), type: type, url: filePath, key: Date.now()})
        }
    }
    
    return { data, hasVideo }
}

export { findFilesWithExtensions, MediaMeta, MediaType }

