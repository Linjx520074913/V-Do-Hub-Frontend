// @ts-nocheck
import {
    BufferGeometry, Mesh, Color, SRGBColorSpace, WebGLRenderer, Scene, DirectionalLight, AmbientLight, PerspectiveCamera, Vector2, TOUCH, MOUSE, Float32BufferAttribute, MathUtils, Matrix4, Vector3, Ray, Line3, DoubleSide, Group, Line, Int8BufferAttribute, DynamicDrawUsage, Int16BufferAttribute, Int32BufferAttribute, Raycaster
} from 'three';
import { LassoHelper } from './editor/lassoHelper';
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LassoHelper } from './editor/lassoHelper';
import { Util } from "./editor/util";
import { DataEditor } from './editor/index';
import {
    CONTAINED,
    INTERSECTED,
    NOT_INTERSECTED,
    CENTER
} from "three-mesh-bvh";

import { Points } from 'three';

  
let renderer, scene, camera, light, pointCloud, rootGroup, helper, controls;
let mouse = new Vector2();
const raycaster = new Raycaster();
const bgColor = 0x263238;
const pointSize = 0.05;
const currentConfig = {
  toolMode: "lasso",// 
  selectionMode: "intersection",
  liveUpdate: false,
  selectModel: false,
  wireframe: false,
  useBoundsTree: true,

  displayHelper: false,
  helperDepth: 2,
  displayParents: false,

  strategy: CENTER,
  pointSize: pointSize,
  raycastThreshold: pointSize,
  useBVH: true,
  invertSelected: false
};
let lassoHelper
let dataEditor = new DataEditor();

  function initRenderContext(canvas: any) {
    
    // 初始化渲染环境
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(canvas.clientWidth / canvas.clientHeight);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(new Color(bgColor), 1);
    renderer.outputColorSpace = SRGBColorSpace;
    canvas.appendChild(renderer.domElement);
  
    scene = new Scene();
    // 添加容器 group，新建对象统一添加为 group 的子对象。
    rootGroup = new Group();
    scene.add(rootGroup);
  
    light = new DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new AmbientLight(0xb0bec5, 0.8));
  
    camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 5);
    camera.updateProjectionMatrix();
    scene.add(camera);
  
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.touches.ONE = TOUCH.PAN;
    controls.mouseButtons.LEFT = MOUSE.PAN;
    controls.touches.TWO = TOUCH.ROTATE;
    controls.mouseButtons.RIGHT = MOUSE.ROTATE;
    controls.enablePan = false;
  
    lassoHelper = new LassoHelper(canvas);
    lassoHelper.enableMouseEvents();
    lassoHelper.setUpdateSelectionCallback((points: any) => {
        
      dataEditor.process(points, pointCloud, camera);
      dataEditor.deleteSelected(pointCloud);
            
    })
   
    camera.add(lassoHelper.shape);

    canvas.addEventListener(
      "resize",
      () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      },
      false
    );
  
    loadPly("F://test.ply");
    startRenderer();

  }
  
  function startRenderer() {
    renderer.setAnimationLoop(() => {
      if(lassoHelper){
        lassoHelper.render(camera.fov, camera.aspect);
      }
      renderer.render(scene, camera);
  
    })
  }
   
  async function loadPly(plyURL) {

    pointCloud = await dataEditor.loadPly(plyURL);
    
    rootGroup.add(pointCloud);
  
  }
  
  function updateConfig(config) {
    Object.assign(currentConfig, config);
  }
  
  function deleteSelected() {
    const array = pointCloud.geometry.attributes.status.array;
    // 更新 status 的值，判断为-1的都赋值为0
    for (let index = 0; index < array.length; index++) {
      if (array[index] === -1) {
        array[index] = 0;
      }
    }
    pointCloud.geometry.attributes.status.needsUpdate = true;
  }
  
  /**
   * 
   * @param {int} exportType 导出Ply文件的格式类型； 0： 
   */
  function exportPly(exportType) {
    let posResult = [];
    let colorResult = [];
    const array = pointCloud.geometry.attributes.status.array;
    // 根据 status 属性，逐顶点判断，如果为0的顶点数据直接忽略。
    for (let index = 0; index < array.length; index++) {
      if (array[index] === 0) {
        continue
      }
      // 重新设置顶点坐标和颜色值数组
      posResult.push(pointCloud.geometry.attributes.position.array[index * 3]);
      posResult.push(pointCloud.geometry.attributes.position.array[index * 3 + 1]);
      posResult.push(pointCloud.geometry.attributes.position.array[index * 3 + 2]);
  
      colorResult.push(pointCloud.geometry.attributes.color.array[index * 3]);
      colorResult.push(pointCloud.geometry.attributes.color.array[index * 3 + 1]);
      colorResult.push(pointCloud.geometry.attributes.color.array[index * 3 + 2]);
    }
    let geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(posResult, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colorResult, 3));
  
    // 通过 PLYExporter 导出模型文件
    const exporter = new PLYExporter();
    const exportPoints = new Points(geometry);
  
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
  
    function save(blob, filename) {
  
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
  
    }
  
    function exportASCII() {
  
      exporter.parse(exportPoints, function (result) {
  
        saveString(result, 'points.ply');
  
      });
  
    }
  
    function saveArrayBuffer(buffer, filename) {
  
      save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  
    }
  
    function saveString(text, filename) {
  
      save(new Blob([text], { type: 'text/plain' }), filename);
  
    }
  
    function exportBinaryBigEndian() {
  
      exporter.parse(exportPoints, function (result) {
  
        saveArrayBuffer(result, 'points.ply');
  
      }, { binary: true });
  
    }
  
    function exportBinaryLittleEndian() {
  
      exporter.parse(exportPoints, function (result) {
  
        saveArrayBuffer(result, 'points.ply');
  
      }, { binary: true, littleEndian: true });
  
    }
  
    switch (exportType) {
      case 0:
        exportBinaryLittleEndian();
        break;
      case 1:
        exportBinaryBigEndian()
        break;
  
      default:
        exportASCII();
        break;
    }
  
  }
  
  /**
   * 获取被选中的点信息
   */
  function getSelectedPointsInfo() {
    let selectedPointsPosition = [];
    let selectedPointsColor = [];
    let selectedPointsIndex = [];
    const array = pointCloud.geometry.attributes.status.array;
    for (let index = 0; index < array.length; index++) {
      if (array[index] < 0) {
  
        selectedPointsPosition.push(pointCloud.geometry.attributes.position.array[index * 3]);
        selectedPointsPosition.push(pointCloud.geometry.attributes.position.array[index * 3 + 1]);
        selectedPointsPosition.push(pointCloud.geometry.attributes.position.array[index * 3 + 2]);
  
        selectedPointsColor.push(pointCloud.geometry.attributes.color.array[index * 3]);
        selectedPointsColor.push(pointCloud.geometry.attributes.color.array[index * 3 + 1]);
        selectedPointsColor.push(pointCloud.geometry.attributes.color.array[index * 3 + 2]);
  
        selectedPointsIndex.push(index * 3)
        selectedPointsIndex.push(index * 3 + 1)
        selectedPointsIndex.push(index * 3 + 2)
      }
    }
    return {
      selectedPointsPosition,
      selectedPointsColor,
      selectedPointsIndex
    }
  }
  
  function toggleEditStatus(value) {
    controls.enablePan = !value;
  }
  
  function cancleSelected() {
    const array = pointCloud.geometry.attributes.status.array;
    for (let index = 0; index < array.length; index++) {
      if (array[index] < 0) {
        array[index] = 1;
      }
    }
    pointCloud.geometry.attributes.status.needsUpdate = true;
  }
  
  export {
    initRenderContext,
    startRenderer,
    loadPly,
    updateConfig,
    deleteSelected,
    exportPly,
    getSelectedPointsInfo,
    toggleEditStatus,
    cancleSelected
  }