import { DialogId } from "@/common/export/enum";
import { h, render, VNode } from "vue";
import ObMessageFunc from "./index.vue";


export type ObDialogProps = {
      message: string,
      confirmText: string,
      confirmCallback: Function,

      id?: string,

      confirmOnly?: boolean,
      cancelText?: string,
      cancelCallback?: Function,

      title?: string,
      ignoreable?: boolean,
      blurBackground?: boolean,
      crossEnabled?: boolean,

      disableControl?: boolean,

      showDontAskAgain?: boolean,
      dontAskAgainCallback?: Function,
      autoCloseAfter?: number,

      smallText?: boolean,
      notExclusive?: boolean
};


const renderBox = async (rawProps: ObDialogProps): Promise<boolean> => {
      return new Promise((res, rej) => {
            const defaultBoxId = DialogId.DEFAULT;
            const standaloneBoxId = DialogId.STANDALONE;
            const customBoxId = rawProps.id;

            // if exclusive
            if (!rawProps.notExclusive) {
                  const preContainer = document.getElementById(defaultBoxId);
                  // Remove any ob-dialog mounted
                  if (preContainer) {
                        document.body.removeChild(preContainer);
                  }
            }

            let boxId = (undefined != customBoxId) ?
                        customBoxId
                        :
                        (!rawProps.notExclusive) ?
                        defaultBoxId
                        :
                        standaloneBoxId;

            const container = document.createElement("div");
            container.id = boxId;

            const props: ObDialogProps = {
                  ignoreable: (undefined != rawProps.ignoreable) ? rawProps.ignoreable : false,
                  blurBackground: (undefined != rawProps.blurBackground) ? rawProps.blurBackground : true,

                  crossEnabled: (undefined != rawProps.crossEnabled) ? rawProps.crossEnabled : false,
                  title: (undefined != rawProps.title) ? rawProps.title : "",
                  message: rawProps.message,
                  confirmText: rawProps.confirmText,
                  cancelText: (undefined != rawProps.cancelText) ? rawProps.cancelText : "",
                  disableControl: (undefined != rawProps.disableControl) ? rawProps.disableControl : false,
                  confirmOnly: (undefined != rawProps.confirmOnly) ? rawProps.confirmOnly : false,
                  smallText: (undefined != rawProps.smallText) ? rawProps.smallText : false,
                  confirmCallback: () => {
                        rawProps.confirmCallback();
                        document.body.removeChild(container);
                        res(true);
                  },
                  cancelCallback: () => {
                        if (undefined != rawProps.cancelCallback) {
                              rawProps.cancelCallback();
                        }
                        document.body.removeChild(container);
                        res(false);
                  }
            };


            // create vdom
            const boxVNode = h(ObMessageFunc, props);

            render(boxVNode, container);

            document.body.appendChild(container);

            if (undefined != rawProps.autoCloseAfter) {
                  setTimeout(() => {
                        if (undefined != rawProps.cancelCallback) {
                              rawProps.cancelCallback();
                        }
                        document.body.removeChild(container);
                  }, rawProps.autoCloseAfter);
            }

            // return boxVNode;
      });
      
}

const ObDialog = (props: ObDialogProps): Promise<boolean> => {
      return new Promise(async (res, rej) => {
            const result = await renderBox(props);
            res(result);
      });
      // if (boxInstance) {
      //       const boxVue = boxInstance.component;
      //       console.log(boxVue);
      //       boxVue.proxy.open(props);
      // } else {
      //     boxInstance = renderBox();
      //     ObDialog(props);  
      // }
}


export default ObDialog;