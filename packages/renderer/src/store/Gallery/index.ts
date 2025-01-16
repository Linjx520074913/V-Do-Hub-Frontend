import { ref } from 'vue'
import { MediaType } from '../TypeDefine'
import { fs, path } from '@common/index'

interface GalleryMeta{
    fileName: string,
    filePath: string,
    type: MediaType,
    thumbnail: string,
    time: string
}

const GalleryRef = ref({
    data:{
        all: [] as GalleryMeta[]
    },
    methods:{
        /**
         * 查找指定目录下所有指定后缀的文件
         * @param folderPath 
         * @param exts 
         * @returns 
         */
        async findFilesWithExts(folderPath: string, exts: string[]){
            Gallery.data.all.length = 0
            return new Promise((resolve, reject) => {
                function traverseFolder(currentPath: string) {
                    const files = fs.readdirSync(currentPath);
    
                    for (const file of files) {
                        const fullPath = path.join(currentPath, file);
                        const stats = fs.statSync(fullPath);
    
                        if (stats.isDirectory()) {
                            // 递归遍历子文件夹
                            traverseFolder(fullPath);
                        } else if (stats.isFile() && exts.some(ext => fullPath.endsWith(ext))) {
                            // 添加符合后缀条件的文件
                            const dir = path.dirname(fullPath);
                            const fileName = path.parse(fullPath).name;
                            const fileExt = path.extname(fullPath);

                            const modifiedTime = new Date(stats.mtime);
                            const formattedTime = `${modifiedTime.getFullYear()}/${(modifiedTime.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}/${modifiedTime.getDate().toString().padStart(2, '0')}`;
                            // TODO: 这里添加视频截图的显示
                            if(fileName != 'screenShot.png'){
                                switch(fileExt){
                                case '.png':
                                    Gallery.data.all.push({ fileName: fileName, filePath: fullPath, type: MediaType.IMAGE, time: formattedTime, thumbnail: fullPath });
                                    break;
                                case '.mp4':
                                    Gallery.data.all.push({ fileName: fileName, filePath: fullPath, type: MediaType.VIDEO, time: formattedTime, thumbnail: path.join(dir, 'screenShot.png') });
                                    break;
                                }
                                
                            }
                        }
                    }
                }
    
                traverseFolder(folderPath);

                // 按时间排序，最新的在最前面
                Gallery.data.all = Gallery.data.all.reverse()

                resolve(Gallery.data.all)
            })
        },
        /**
         * 获取页数
         * @param pageCapacity 
         */
        getTotalPages(pageCapacity: number){
            return Math.ceil(Gallery.data.all.length / pageCapacity)
        },
        getTotalCount(){
            return Gallery.data.all.length
        },
        /**
         * 获取指定页内容
         * @param pageIndex 
         * @param pageCapacity 
         */
        fetchFilesByPage(pageIndex: number, pageCapacity: number): GalleryMeta[] {
            const totalCount = Gallery.data.all.length;
            const totalPages = Gallery.methods.getTotalPages(pageCapacity);

            pageIndex = pageIndex - 1
            
            // 校验页索引是否有效
            if (pageIndex < 0 || pageIndex >= totalPages) {
                console.error('Invalid page index');
                return [];
            }
            
            const startIndex = pageIndex * pageCapacity;
            let effectiveCapacity = pageCapacity;
        
            // 处理最后一页的容量
            if (pageIndex === totalPages - 1) {
                effectiveCapacity = totalCount - startIndex;
            }
        
            // 返回分页后的数据
            return Gallery.data.all.slice(startIndex, startIndex + effectiveCapacity)
        }
    }
})

const Gallery = GalleryRef.value

export { Gallery }