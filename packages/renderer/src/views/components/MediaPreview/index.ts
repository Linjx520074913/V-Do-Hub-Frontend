import fs from 'fs'
import path from 'path'

function findFilesWithExtensions(folderPath: string, extensions: string[]): { data: { name: string; type: string; url: string }[]; hasVideo: boolean } {
    let data = [] as any
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

                data.push({ name: fileName, type: fileExt == '.png' ? 'image' : 'video', url: fullPath })
            }
        }
    }

    traverseFolder(folderPath)
    return { data, hasVideo }
}

export { findFilesWithExtensions }

