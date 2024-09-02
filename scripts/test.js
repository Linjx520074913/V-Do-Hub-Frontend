{
      outDir: '/Users/dianfengjiang/Project/tb2201/portablescanner/release/1.0.12-20230703-TestHook',
      artifactPaths: [
        '/Users/dianfengjiang/Project/tb2201/portablescanner/release/1.0.12-20230703-TestHook/CrealityScan_1.0.12-20230703-TestHook_arm64.dmg.blockmap',
        '/Users/dianfengjiang/Project/tb2201/portablescanner/release/1.0.12-20230703-TestHook/CrealityScan_1.0.12-20230703-TestHook_arm64.dmg',
        '/Users/dianfengjiang/Project/tb2201/portablescanner/release/1.0.12-20230703-TestHook/CrealityScan_1.0.12-20230703-TestHook_x64.dmg.blockmap',
        '/Users/dianfengjiang/Project/tb2201/portablescanner/release/1.0.12-20230703-TestHook/CrealityScan_1.0.12-20230703-TestHook_x64.dmg'
      ],
      platformToTargets: Map(1) {
        Platform {
          name: 'mac',
          buildConfigurationKey: 'mac',
          nodeName: 'darwin'
        } => Map(1) { 'dmg' => [DmgTarget] }
      },
      configuration: {
        directories: { output: 'release/${version}', buildResources: 'build' },
        appId: 'com.creality.crealityscan',
        productName: 'CrealityScan',
        asar: true,
        files: [ [Object] ],
        extraResources: [ [Object] ],
        win: {
          icon: './build/nsis/logo.ico',
          artifactName: '${productName}_${version}.${ext}',
          requestedExecutionLevel: 'requireAdministrator',
          target: [Array]
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          deleteAppDataOnUninstall: true,
          include: './build/nsis/nsisConfig.nsh'
        },
        appx: {
          applicationId: 'com.creality.crealityscan',
          backgroundColor: '#a3a693',
          publisherDisplayName: 'Creality'
        },
        mac: {
          hardenedRuntime: true,
          entitlements: 'build/mac/entitlements.mac.plist',
          entitlementsInherit: 'build/mac/entitlements.mac.plist',
          gatekeeperAssess: false,
          artifactName: '${productName}_${version}_${arch}.${ext}',
          category: 'public.app-category.utilities',
          icon: './build/mac/logo.icns',
          minimumSystemVersion: '11.7.7',
          target: [Array]
        },
        dmg: { sign: false },
        afterAllArtifactBuild: 'scripts/afterBuild.js',
        linux: { icon: './build/logo.ico', target: 'deb', maintainer: '' },
        electronVersion: '18.0.2'
      }
    }