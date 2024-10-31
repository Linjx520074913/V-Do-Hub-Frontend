
import { computed, ref } from "vue";
const MainWindowRef = ref({
      fullScreen: false,
      maximized: true,

      computed: {
        isMaximized: computed((): boolean => {
            return MainWindow.maximized
        }),

        isFullScreen: computed((): boolean => {
            return MainWindow.fullScreen
        }),
      },

      methods: {
          toggleFullScreen: (value?: boolean) => {
              if (undefined != value) {
                  MainWindow.fullScreen = value;
              } else {
                  MainWindow.fullScreen = !MainWindow.fullScreen;
              }
          },

          toggleMaximize: (value?: boolean) => {
              if (undefined != value) {
                  MainWindow.maximized = value;
              } else {
                  MainWindow.maximized = !MainWindow.maximized;
              }
          },
      },
});

const MainWindow = MainWindowRef.value;


export { MainWindow };