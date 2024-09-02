import { AxiosProgressEvent } from "axios";
import { ref } from "vue";
import { baseRequester } from "@/common/requester/index";

const RequesterRef = ref({
      softwareVersion: "",

      methods: {
            init: (softwareVersion: string) => {
                  Requester.softwareVersion = softwareVersion;
            },

            sampleRequest: async (paramA: boolean): Promise<boolean> => {
                  return new Promise((res, rej) => {
                        baseRequester
                        .post("ota_api/v1/sample", {
                              param: paramA
                        })
                        .then((result: any) => {
                              console.log(result);
                              if (0 == result.data.code) {
                                    res(true);
                              } else {
                                    res(false);
                              }
                        })
                        .catch((err) => {
                              res(false);
                        });
                  });
            },

            getExternalIp: async (): Promise<string|undefined> => {
                  return new Promise((res, rej) => {
                        baseRequester
                              .get("https://ipinfo.io/ip")
                              .then((result: any) => {
                                    console.log("external ip: ", result);
                                    if (200 == result.status) {
                                          res(result.data as string);
                                    }
                                    else {
                                          res(undefined);
                                    }
                              })
                              .catch((err) => {
                                    res(undefined);
                              });
                  });
            },

            // md5 checker
            md5Check: async (targetFile: File, targetMd5Sum: string): Promise<boolean> => {
                  const fileMd5: string = await Requester.methods.generateMd5(targetFile);

                  return targetMd5Sum == fileMd5;
            },

            // file fetcher (Prefer file downloader instead of this one)
            fetchUrlFile: (url: string): Promise<File> => {
                  return new Promise((res, rej) => {
                        fetch(url)
                        .then(res => res.blob())
                        .then((blob) => {
                              let urlArr: string[] = url.split("/");
                              console.log(urlArr[urlArr.length-1]);
                              console.log(blob);
                              const file = new File([blob], urlArr[urlArr.length-1], { type: blob.type });

                              res(file);
                        })
                        .catch((err) => {
                              rej(err);
                        });

                  });
            },

            // file downloader
            downloadUrlFile: (url: string, abortController?: AbortController, progressCallback?: Function): Promise<File> => {

                  // console.log(url);

                  return new Promise((res, rej) => {

                        baseRequester(url, {
                              responseType: "blob",
                              signal: abortController ? abortController.signal : undefined,
                              timeout: 3000000,
                              onDownloadProgress: (e) => { Requester.methods.progressEventHandler(e, progressCallback); }
                        })
                        .then((response) => {
                              const { headers, data } = response;

                              const blob = new Blob([data], {type: headers["content-type"]});
                              let urlArr: string[] = url.split("/");

                              // console.log(urlArr[urlArr.length-1]);
                              // console.log(blob);

                              const file = new File([blob], urlArr[urlArr.length-1], { type: blob.type });

                              // console.log(file);

                              res(file);
                        })
                        .catch((err) => {
                              rej(err);
                        });

                  });
            },

            // generate md5
            generateMd5: (file: File): Promise<string> => {
                  return new Promise((res, rej) => {
                        const fileReader = new FileReader();
                        fileReader.readAsArrayBuffer(file);

                        fileReader.onload = e => {
                              const sparkMd5 = require("spark-md5");
                              const md5 = sparkMd5.ArrayBuffer.hash(e.target?.result);
                              res(md5);
                        }
                  });
            },

            // progress event handler
            progressEventHandler(e: AxiosProgressEvent, progressCallback?: Function) {
                  if (undefined != e.total) {
                        const progress = (e.loaded * 100) / e.total;
                        // console.log(Math.round(progress));
                        if (progressCallback) {
                              progressCallback(progress);
                        }
                  }
            },
      },

      computed: {
            
      },


});

const Requester = RequesterRef.value;


export { Requester };