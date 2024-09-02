import os from "os";


/** Static Class */
class IpHelper {
      static isVmNetwork(mac: string) {
            let vmNetwork = [
                "00:05:69", //vmware1
                "00:0C:29", //vmware2
                "00:50:56", //vmware3
                "00:1C:42", //parallels1
                "00:03:FF", //microsoft virtual pc
                "00:0F:4B", //virtual iron 4
                "00:16:3E", //red hat xen , oracle vm , xen source, novell xen
                "08:00:27", //virtualbox
                "0A:00:27", //virtualbox1
                "00:00:00", // VPN
            ]
            for (let i = 0; i < vmNetwork.length; i++) {
                let mac_per = vmNetwork[i];
                let macPerLower = mac_per.toLowerCase();
                let macLower = mac.toLowerCase();

            //     console.log("@@@", macLower, macPerLower);
                if (macLower.startsWith(macPerLower)) {
                  return true
                }
            }
            return false;
      };

      static getRealIp() {
		let result = [];
            let netDict = os.networkInterfaces();
            for (const devName in netDict) {
                  let netList = netDict[devName];
                  if (netList) {
                        for (var i = 0; i < netList.length; i++) {
                              let { address, family, internal,mac } = netList[i];
                              let isvm = IpHelper.isVmNetwork(mac);
                              // console.log("******", mac, address, isvm);

                              if (family === 'IPv4' && address !== '127.0.0.1' && !internal && !isvm) {
                                    result.push(address);
                              }
                        }
                  }
            }

            // console.log(result);
            return result;
      };
}

export default IpHelper;