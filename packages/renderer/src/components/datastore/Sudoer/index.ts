import { computed, ref } from "vue";
import { ipcRenderer } from "electron";
import { ObEvent } from "@common/";
import { DSLocalStorage as LocalStorage } from "../index";
import { t } from "@/components";
import { LSItem } from "@/common/export";

const SudoerRef = ref({
      showPasswordPrompt: false,

      rememberCurrentAdmin: false,

      pending: false,

      username: "",
      password: "",

      adminObjMap: {} as any,

      methods: {
            clearPassword:()=>{
                  Sudoer.password="";
            },
            writeTestMap: () => {
                  let adminObjMap: any = {};
                  adminObjMap["tim"] = "zxcv";
                  adminObjMap["tom"] = "1234";
                  adminObjMap["0"] = "";
                  adminObjMap[""] = "2345";
                  const stringifiedMap = JSON.stringify(adminObjMap);
                  LocalStorage.methods.set(LSItem.DARWIN_ADMIN_USR_MAP, stringifiedMap);
            },

            saveCurAdminObjMapToLocal: () => {
                  const stringifiedMap = JSON.stringify(Sudoer.adminObjMap);
                  LocalStorage.methods.set(LSItem.DARWIN_ADMIN_USR_MAP, stringifiedMap);
                  console.log("Writed To Local", stringifiedMap);
            },

            init: async (platform: string) => {
                  if ("darwin" != platform) {
                        return;
                  }

                  const storedUserMap = LocalStorage.methods.get(LSItem.DARWIN_ADMIN_USR_MAP);
                  if (storedUserMap) {
                        Sudoer.adminObjMap = JSON.parse(storedUserMap);
                  }

                  // console.log(Sudoer.adminObjMap);
                  const adminObjMapKeys = Object.keys(Sudoer.adminObjMap);

                  if (adminObjMapKeys.length > 0) {
                        for (let username of adminObjMapKeys) {
                              const password = Sudoer.adminObjMap[username];
                              console.log(username, password);
                              if (password) {
                                    const result = await Sudoer.methods.requestSudo(username, password);
                                    if (result) {
                                          console.log("Found useful admin pass");
                                          return;
                                    }

                                    delete Sudoer.adminObjMap[username];
                                    // console.log("failed try...", username, password);
                              }
                              
                        }
                        
                  }

                  // console.log(Sudoer.adminObjMap);
                  Sudoer.methods.togglePasswordPromptVisibility(true);

            },

            togglePasswordPromptVisibility: (value: boolean) => {
                  Sudoer.showPasswordPrompt = value;
            },

            togglePending: (value: boolean) => {
                  Sudoer.pending = value;
            },

            activeRequestSudo: () => {
                  if (Sudoer.pending) {
                        console.log("Pending");
                        return;
                  }
                  Sudoer.methods.togglePending(true);
                  // Sudoer.methods.togglePasswordPromptVisibility(false);
                  Sudoer.methods.requestSudo(Sudoer.username, Sudoer.password).then((res: any) => {
                        if (!res) {
                              // ObDialog({
                              //       message: t("authenFailedPrompt"),
                              //       confirmText: t("confirm"),
                              //       confirmOnly: true,
                              //       confirmCallback: () => {
                              //       },
                              // });

                              ipcRenderer.invoke(
                                    ObEvent.SHOW_NATIVE_MESSAGE_DIALOG,
                                    { message: t("authenFailedPrompt") }
                              ).then(() => {
                                    
                              });
                              // Sudoer.methods.togglePasswordPromptVisibility(true);
                              return;
                        }

                        Sudoer.methods.togglePasswordPromptVisibility(false);
                        console.log(Sudoer.showPasswordPrompt);
                        if (Sudoer.rememberCurrentAdmin) {
                              Sudoer.adminObjMap[Sudoer.username] = Sudoer.password;
                              Sudoer.methods.saveCurAdminObjMapToLocal();
                        }
                  });

            },

            requestSudo: async (username: string, password: string) => {
                  return new Promise((res, rej) => {
                        // Sudoer.methods.togglePending(true);

                        ipcRenderer.invoke(
                              ObEvent.LAUNCH_BACKEND,
                        {
                              username: username,
                              password: password,
                        }
                        ).then((result: boolean) => {
                              console.log(result);
                              Sudoer.methods.togglePending(false);
                              res(result);
                        });
                  })
                  
            }
      },

      computed: {
            hasPassword: computed((): boolean => {
                  return "" != Sudoer.password; 
            })
      }
});

const Sudoer = SudoerRef.value;


export { Sudoer };
