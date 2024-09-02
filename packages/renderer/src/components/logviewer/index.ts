import { ref, onMounted } from "vue";
import { ObEvent } from "@common/index";
import { ipcRenderer } from "electron";

const vsl = ref(null);


function handleYResize(log: any): void {
    var resize = document.getElementById("log-resize");
    var logMain = document.getElementById("log-main");

    if (resize && logMain) {
          resize.onmousedown = (e) => {
                // 设置移动条颜色
                if (resize) {
                      resize.style.background = "#818181";
                }

                // 获取原高度
                if (logMain) {
                      var initHeight = logMain.clientHeight;
                }
                // 获取起始Y坐标
                var startY = e.clientY;

                // 初始化移动距离
                var moveLen = 0;

                // 设置鼠标拖拽时的表现
                document.onmousemove = (e) => {
                      // 获取当前拖动时的鼠标Y坐标
                      var endY = e.clientY;

                      // 计算移动距离
                      moveLen = startY - endY;

                      // 使log区域能从隐藏状态展开
                      if (moveLen > 0 && !log.isShow) {
                            log.show();
                      }

                      let targetHeight = initHeight + moveLen;

                      if (targetHeight <= 0 && log.isShow) {
                        log.show();
                      }

                      // 根据移动距离设置log区域高度
                      if (logMain) {
                            logMain.style.height = (targetHeight).toString() + "px";
                      }
                };

                // 设置拖拽结束时表现
                document.onmouseup = (evt) => {

                      // 重置移动条颜色
                      if (resize) {
                            resize.style.background = "";
                      }

                      // 重置事件
                      evt.stopPropagation();
                      document.onmousemove = null;
                      document.onmouseup = null;

                      // @ts-ignore
                      resize.releaseCapture && resize.releaseCapture();
                }
                // @ts-ignore
                resize.releaseCapture && resize.releaseCapture();
                return false;
          };
    }

}

function init(){

    onMounted(() => {

        // 监听日志缓存变化
        ipcRenderer.on(ObEvent.LOG_BUFFER_CHANGED, (event: any, args: any) => {
            if(vsl != undefined && vsl.value != undefined){
                (vsl.value as any).scrollToBottom();
            }
        });
    })

}

export {  init, vsl };