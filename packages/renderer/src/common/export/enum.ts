enum ExportOption {
      EXPORT,
      CREALITY_PRINT,
      HALOT_BOX
}

enum DevicePid {
      TB2302 = 1704,
      TB2401 = 1754,
      TB2201 = 1692,
      TB2201_WIRELESS_BRIDGE = 1697
}

enum DialogId {
      DEFAULT = "ob-default-dialog-id",
      STANDALONE = "ob-standalone-dialog-id",
      DEVICE_BIND = "ob-device-bind-dialog-id"
}

enum ToastType {
      IR_BRIGHTNESS,
      LASER_BRIGHTNESS
}

enum CalibrationStatus {
      INVALID,
      NORMAL_CAPTURING,
      TOO_CLOSE,
      TOO_FAR,
      PROCESSING,
      STOPPED,
      CALIB_BOARD_UNDETECTED,
      CALIB_BOARD_UNMATCH,
      CALIB_BOARD_WRONG_ALIGN
}

enum LSItem {
      DEFAULT_PROJECT_PATH = "defaultProjectPath",
      LOCALE = "locale",
      RECENT_PROJECT_PATH_LIST = "recentProjectPathList",
      REVERSE_RECENT_PROJECT_PATH_LIST = "reverse",
      HIDE_QUICK_START = "dontShowQuickStart",
      DARWIN_ADMIN_USR_MAP = "adminObjMap",
      MUTE_DEVICE = "muteDevice",
      HIDE_DEVICE_CONNECTED_PROMPT = "dontShowDeviceConnectedPrompt",
      USED_DEVICE_PID_LIST = "usedDevicePidList",
      SHOW_DEPTH_DIAGRAM = "showDepthDiagram",
      CALIB_BOARD_INFO_LIST = "calibBoardInfoList",
      DEFAULT_EXPORT_PATH = "defaultExportPath",
      LAST_DEVICE_SN = "lastDeviceSn",
      ENTER_PROCESS_PAGE_NUMBER ="EnterProcessPageNumber"
}

// enum = pid
enum ScannerType {
      BOOT_DEVICE = -1,
      TB2201 = 0x069c,
      TB2302 = 0x06a8,
      TB2401 = 0x06da,
      TB2201_Legacy = 0x06a1,
}

enum DisplayDirection {
      HORIZONTAL = 0,
      VERTICAL
}

enum ToolStep {
      DEVICE,
      SCAN_COVER,
      SCAN_CONFIG,
      SCAN_WORK,
      SCAN_POST_WORK,
      POST_PROCESS
}

enum ProcessStage {
      UNKNOWN = 0,
      NONE,
      FUSING,
      FUSING_SUCCESS,
      FUSING_FAILED,
      MESHING,
      MESHING_SUCCESS,
      MESHING_FAILED,
      TEXTURE_MAPPING,
      TEXTURE_MAPPING_SUCCESS,
      TEXTURE_MAPPING_FAILED
};

enum WorkMode {
      UNSELECTED,
      SCAN,
      VIEW,
      PROCESS
};

enum ScanStatus {
      NONE,
      STOPPED,
      PAUSING,
      PREVIEWING,
      SCANNING
};

enum ProjectionMode {
      INFRARED,
      BLUE_LIGHT,
};

enum ScanMode {
      NORMAL,
      FACIAL,
      BODY
};

enum OptimizationMode {
      FAST,
      ACCURATE,
};

enum DepthMode {
      NEAR,
      FAR
};

enum FeatureMode {
      GEOMETRY,
      TEXTURE,
      MARKER,
};

enum ColorMode {
      WHITE,
      COLOR,
};

enum ObjectMode {
      SMALL = 0,
      MEDIUM,
      LARGE,
};

enum TurntableMode {
      USING,
      NOT_USING
};

enum PclOptimize {
      NONE,
      HIGH_QUALITY,
      QUICK
};

enum MeshOptimize {
      NONE,
      HIGH_QUALITY,
      QUICK
};

enum PclProcess {
      NONE,
      CROPPING,
      SMOOTHING,
      ISOLATING,
      SIMPLIFYING
};

enum MeshProcess {
      NONE,
      SMOOTHING,
      ISOLATING,
      SIMPLIFYING,
      FILLING
};

enum FusionMode {
      QUICK,
      ACCURATE
};

enum MeshMode {
      QUICK,
      ACCURATE
};

enum DepthViewMode {
      IR,
      DEPTH,
};

enum DistanceStatus {
      TOO_NEAR = 0,
      NEAR_GOOD,
      PERFECT,
      FAR_GOOD,
      TOO_FAR,
      INVALID,
};


enum ProcessConfigOption {
      DEFAULT,
      FACIAL,
      BODY,
      OBJECT_SMALL,
      OBJECT_MEDIUM,
      OBJECT_LARGE,
      PIONEER_BLUE_LIGHT,
      PIONEER_INFRARED
};

enum ExportFormat {
      ASC = "asc",
      STL = "stl",
      PLY = "ply",
      OBJ = "obj"
};

enum PointCloudRenderMode {
      PURE,
      SPECTROGRAM,
      COLOR
};

enum UsbType {
      NONE,
      USB20,
      USB30
};

enum ScanToast {
      START_GUIDE,
      SPECTRO_GUIDE,
      WARN_MESSAGE
};

enum TrackingStatus {
      SUCCESS = 0,
      LOST,
      AMBIGUOUS_PLANE,
      INSUFFICIENT_VALID_POINTS,
      TEXTURELESS,
      INSUFFI_MARKER
};

enum ComputeSpeed {
      FAST = 0,
      NORMAL
};

enum EditTool {
      NONE,
      LASSO,
      RECTANGLE,
      POINT,
};

enum EditMode {
      PENETRATE,
      SURFACE
};

enum SpliceMode {
      AUTO = "auto",
      MANUAL = "manual",
};

enum VisibleState {
      RAW,
      OPTIMIZED,
      MESHED,
      MAPPED,
      NONE,
};

enum SpliceStage {
      UNKNOWN = 0,
      NONE,
      SPLICING,
      SPLICING_SUCCESS,
      OPTIMIZING,
      OPTIMIZING_SUCCESS
};

enum LocalFileServerStatus {
      LAUNCHING = 0,
      LAUNCHED,
      ERROR
}

export {
      ExportOption,
      DevicePid,
      DialogId,
      ToastType,
      CalibrationStatus,
      LSItem,
      ScannerType,
      DisplayDirection,
      ProjectionMode,
      ScanMode,
      OptimizationMode,
      DepthMode,
      FeatureMode,
      ColorMode,
      ObjectMode,
      TurntableMode,

      PclOptimize,
      MeshOptimize,
      PclProcess,
      MeshProcess,
      ProcessConfigOption,

      FusionMode,
      MeshMode,
      ComputeSpeed,

      ScanStatus,
      ProcessStage,

      ToolStep,

      WorkMode,
      DepthViewMode,
      DistanceStatus,
      ExportFormat,
      PointCloudRenderMode,
      UsbType,
      ScanToast,
      TrackingStatus,

      EditTool,
      EditMode,
      SpliceMode,
      VisibleState,
      SpliceStage,
      LocalFileServerStatus,
};