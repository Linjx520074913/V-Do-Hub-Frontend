import { ref, computed } from "vue";

const PlatformRef = ref({
  type: "",

  computed: {
      isDarwin: computed((): boolean => {
        return "darwin" == Platform.type;
      }),
  },

  init: (type: string) => {
      Platform.type = type;
  }
});


const Platform = PlatformRef.value;


export { Platform };