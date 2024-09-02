import { ref } from "vue";

export function useFloatWindow(): any {
    let showFloat = ref<boolean>(false);

    function toggleFloatWindow(): void {
        showFloat.value = !showFloat.value;
    };

    return {
        showFloat,
        toggleFloatWindow
    }
}
