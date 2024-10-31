import { ComputeSpeed, ScannerType, VisibleState } from "./enum";

interface Props<T> {
      [key: string]: T
};

interface Map<T> {
      [key: string]: T
};

interface Switch {
      cur: boolean,
      onChange: boolean
};

interface Select<T> {
      cur: T,
      pre: T,
      options: Option<T>[]
};

interface Option<T> {
      label: string,
      value: T
};

interface Range {
      min: number,
      max: number,
      def: number,
      step: number | any,
      cur: number
}

interface PclOptimizeConfig {
      auto: boolean,
      voxelSize: Range,
      credibleRatio: Range,
      removeMarker: boolean,
      computeSpeed: ComputeSpeed,
      superDetail: boolean
}

interface MeshConfig {
      auto: boolean,
      fillHoles: boolean,
      closed: boolean,
      facet: Range,
      deNoise: Range,
      computeSpeed: ComputeSpeed
}

interface ProcessConfig {
      optimize: PclOptimizeConfig,

      mesh: MeshConfig
}

interface Session {
      id: number,
      name: string,  // TODO: change to session work dir splicing result
      state: VisibleState,
      // session Dir
      projectRoot: string,
      projectName: string,
      workDir: string,
      subDir: string,
      rawPointsPath: string,
      optimizedPointsPath: string,
      meshedModelPath: string,
      textureMappedModelPath: string,
    
      frameNum: number,
    
      scanConfig: any,
    
      postProcessConfig: any,
    
      subProjects: Session[]
}

interface DeviceInfo {
      name: string,
      connectionType: string,
      sn: string,
      firmwareVersion: string,
      wifiFirmwareVersion: string,
      scannerType: ScannerType,
      lastCalibrateTime: number,
      pid: number,
      needCalib: boolean,
      wifiBoxPid?: number
};

export { Props };

export {
      Map,
      Switch,
      Select,
      Option,
      Range,
      ProcessConfig,
      Session,

      DeviceInfo,
      PclOptimizeConfig,
      MeshConfig
};