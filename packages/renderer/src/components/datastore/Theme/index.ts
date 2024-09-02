import { ref } from "vue";
import { msDark, msLight } from "@/common/theme/index";

const ThemeRef = ref({
      curTheme: "dark",

      switchTheme(targetTheme: string): void {
            let themeMaps;
            switch(targetTheme) {
                  case "light":
                  themeMaps = msLight;
                  break;
                  case "dark":
                  default:
                  themeMaps = msDark;
                  break;

            }

            let hBody = document.getElementsByTagName("body")[0];
            if (hBody) {
                  themeMaps.forEach((value, key) => {
                  hBody.style.setProperty(key, value);
                  });
            }
      }

});

const Theme = ThemeRef.value;


export { Theme };