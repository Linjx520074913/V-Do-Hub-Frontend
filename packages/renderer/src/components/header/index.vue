<template>
  <div
    id="client-header"
    :class="{
      'darwin-header': Platform.computed.isDarwin,
      'darwin-fullscreen':
        Platform.computed.isDarwin && MainWindow.computed.isFullScreen,
    }"
  >
    <div id="header__left">
      <div class="app-logo">
        <img :src="curLogoSrc" class="static-img" />
      </div>
      <div class="app-name">{{ Package.name }}</div>
      <div class="app-version">{{ packageVersion }}</div>
    </div>

    <div />

    <div id="header__middle"></div>

    <!-- <div id="header__right" class="no-dragable">
			<button
				class="reserved-button icon-setting2"
				
				@click="toggleUserMenuVisibility()"
			/>
			<Teleport to="body">
				<FloatWindowTemplate
					v-if="userMenuVisible"
					:enable-blur="false"
					:top-right-right="Platform.computed.isDarwin ? '14px' : '110px'"
					@onHide="toggleUserMenuVisibility()"
				>
					<template v-slot:top-right>
						<UserMenu
							@onClose="toggleUserMenuVisibility()"
						/>
					</template>
				</FloatWindowTemplate>
			</Teleport>
		</div> -->

    <Teleport v-if="!Platform.computed.isDarwin" to="body">
      <div id="unblockable-window-control">
        <div id="header__reserved" class="no-dragable">
          <button
            v-for="(item, index) in UI.header.right"
            :key="index"
            class="reserved-button"
            :class="[item.icon, 'm-1']"
            @click="item.click"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { UI, Package, Platform, MainWindow } from "@/components/index";
import {
  FloatWindowTemplate,
  Navigator,
  Stepper,
} from "@/common/templates/index";
import { UserMenu } from "./components/index";
import LogoWin32 from "@/assets/logo_win32.png";
import LogoDarwin from "@/assets/logo_darwin.png";

export default {
  name: "Header",

  components: { FloatWindowTemplate, Navigator, Stepper, UserMenu },

  setup() {
    let userMenuVisible = ref<boolean>(false);

    function toggleUserMenuVisibility(): void {
      userMenuVisible.value = !userMenuVisible.value;
    }

    const packageVersion = Package.version.split("-")[0];

    const curLogoSrc = computed(() => {
      if (Platform.computed.isDarwin) {
        return LogoDarwin;
      } else {
        return LogoWin32;
      }
    });

    return {
      UI,
      Platform,
      MainWindow,
      Package,
      userMenuVisible,
      toggleUserMenuVisibility,

      packageVersion,
      curLogoSrc,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
</style>
