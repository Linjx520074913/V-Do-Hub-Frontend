<template>
      <FloatWindowTemplate
            :enable-blur="blurBackground"
            @onHide="ignore()"
      >
            <template v-slot:center>
                  <ObMessage
                        :cross-enabled="crossEnabled"
                        :title="title"
                        :message="message"
                        :confirmText="confirmText"
                        :cancelText="cancelText"
                        :disableControl="disableControl"
                        :confirmOnly="confirmOnly"
                        :smallText="smallText"
                        @onCancel="cancelAction()"
                        @onConfirm="confirmAction()"
                  />
            </template>
      </FloatWindowTemplate>
  </template>
  
  <script lang="ts">
  import { SetupContext, toRefs, ref, onMounted, computed } from "vue";
  import { Props } from "@/common/export/interface";
  import { ObMessage, FloatWindowTemplate } from "..";
  
  export default {
      name: "ObMessageFunc",
  
      props: {
            ignoreable: {
                  type: Boolean,
                  default: false,
            },

            blurBackground: {
                  type: Boolean,
                  default: true,
            },

            crossEnabled: {
                  type: Boolean,
                  default: false
            },

            title: {
                  type: String,
                  default: ""
            },

            message: {
                  type: String,
                  default: "",
            },

            confirmText: {
                  type: String,
                  default: "Confirm",
            },

            cancelText: {
                  type: String,
                  default: "Cancel"
            },

            disableControl: {
                  type: Boolean,
                  default: false
            },

            confirmOnly: {
                  type: Boolean,
                  default: false
            },

            smallText: {
                  type: Boolean,
                  default: false
            },

            confirmCallback: {
                  type: Function,
                  default: () => {}
            },

            cancelCallback: {
                  type: Function,
                  default: () => {}
            }
      },

      components: { ObMessage, FloatWindowTemplate },
  
      emits: ["onCancel", "onConfirm"],
  
  
      setup(props: Props<any>, context: SetupContext) {
          const {
            ignoreable,
            blurBackground,
            crossEnabled,
            title,
            message,
            confirmText,
            cancelText,
            disableControl,
            confirmOnly,
            smallText,
          } = toRefs(props);
  
          const cancelCallback: Function = props.cancelCallback;
          const confirmCallback: Function = props.confirmCallback;
          
          function confirmAction(): void {
            if (confirmCallback) {
                  confirmCallback();
            }

          }
  
          function cancelAction(): void {
            if (cancelCallback) {
                  cancelCallback();
            }
          };

          function ignore(): void {
            if (ignoreable.value) {
                  cancelAction();
            }
          }
  
  
          return {
            blurBackground,
            crossEnabled,
            title,
            message,
            confirmText,
            cancelText,
            disableControl,
            confirmOnly,
            smallText,
  
            confirmAction,
            cancelAction,
            ignore
          }
  
      }
  
  }
  </script>
  
  <style lang="scss" scoped>
  @import "./local.scss";
  @import "@/common/styles/elementPlusDefault.scss";
  </style>