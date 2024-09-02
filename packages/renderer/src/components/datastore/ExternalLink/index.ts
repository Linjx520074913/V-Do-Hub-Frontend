import { computed, ref } from "vue";
import { shell } from "electron";
import {
      DSLocale as Locale
} from "../index";


const ExternalLinkRef = ref({
    
      methods: {
            openExternal: (link: string) => {
                  shell.openExternal(link);
            }
      },

      computed: {         
            
      }
});

const ExternalLink = ExternalLinkRef.value;


export { ExternalLink };