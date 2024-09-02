// @ts-nocheck
import * as THREE from 'three';

import { ArcballControls } from "three/examples/jsm/controls/ArcballControls.js";
import { GUI } from './gui/lil-gui.module.min.js';

// 透视相机参数
interface PerspectiveCameraParam {

    distance: number,
    fov: number,
    aspect: number,
    near: number,
    far: number,
    offsetY: number

};

// canvas 参数
interface CanvasParam {

    width: number,
    height: number

};

// 场景参数
interface SceneParam {

    background: THREE.Vector3

};

// 渲染参数
interface RendererParam{

    background: THREE.Vector3

};

// 效果参数
interface EffectParam{

    frontcolor: THREE.Color
    backcolor:  THREE.Color
    specularcolor: THREE.Color
    shininess: number

};

interface ObParam {

    canvas: CanvasParam,
    perspectiveCamera: PerspectiveCameraParam,
    scene: SceneParam,
    renderer: RendererParam
    effect: EffectParam

};

/**
 * 点云类型
 */
 enum PointCloudType {
    CURRENT,    // 当前帧点云
    HISTORY     // 历史帧点云
};

export { ArcballControls, GUI };
export { PerspectiveCameraParam, CanvasParam, SceneParam, RendererParam, EffectParam, ObParam };
export { PointCloudType };
