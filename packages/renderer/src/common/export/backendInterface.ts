interface DeviceConnectMsg {
      event: string,
      list: BeDeviceInfo[],
      active_index: number
};

interface BeDeviceInfo {
      name: string,
      usb_type: string,
      sn: string,
      firmware_version: string,
      wifi_version: string,
      pid: number,
      timestamp: number
};


export {
      DeviceConnectMsg,
      BeDeviceInfo
}