// @ts-nocheck
import * as THREE from 'three';
import ResourceTracker from './track';

import {curFrameMaterial, hisFrameMaterial, markerMaterial} from './shader/materials';
import {ArcballControls, GUI, ObParam, PointCloudType} from "./typings";

import {Model, ModelLoader, modelMap} from './loader/index';

import {LassoHelper, ToolMode} from './editor/lassoHelper';
import {DataEditor, SelectionMode} from "./editor/index";
import {MeshBVH} from 'three-mesh-bvh';

import Stats from "stats-js";

const html2canvas = require('html2canvas');  


enum PointCloudColorType{
    NONE,
    SPECTROGRAM,
    REALITY
};

interface LoadModelTask {
    path: string,
    callback: Function
};

class Queue {
    items: LoadModelTask[]

    constructor() {
        this.items = [];
    }

    enQueue(element) {
        this.items.push(element);
    }

    deQueue() {
        return this.items.shift();
    }

    front() {
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
};

// var scope;
let save = true;
let currentScale = 1;

class PCLPlayer{

    lassoHelper: LassoHelper;
    editor: DataEditor;

    canvas: any;

    scene:    THREE.Scene
    camera:   THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer

    ground: THREE.Mesh                // 地板

    param: ObParam
    control: ArcballControls

    pointcloud: Map<PointCloudType, THREE.Points>

    gui: GUI
    inverseMatOfPose: THREE.Matrix4   // pose矩阵的逆

    tmpPointCloud: any;

    colorType: number;

    // 点云缩放比，根据历史点云包围盒归一化计算所得
    scale: number

    centerPCL: boolean
    updateCameraPos: boolean

    plyModel: any
    objModel: any

    resMgr: any
    track: any

    model?: Model

    timer: NodeJS.Timer

    group: THREE.Group

    markersGroup: THREE.Group

    useBVH: boolean

    initPositionOfGroup: THREE.Vector3
    initRotationOfGroup: THREE.Vector3

    canSelection: boolean

    stats: Stats

    selectedPointsListener: Function;

    center: THREE.Vector3

    loadQueue: Queue

    frameIndex: number

    vBuffer: THREE.BufferAttribute
    nBuffer: THREE.BufferAttribute

    markerMesh?: THREE.Mesh

    constructor(canvas: any){

        this.frameIndex = 0;

        this.loadQueue = new Queue();

        this.center = new THREE.Vector3();

        this.group = new THREE.Group();
        this.markersGroup = new THREE.Group();
        this.initPositionOfGroup = this.group.position.clone();
        this.initRotationOfGroup = this.group.rotation.clone();

        this.canSelection = false;
        this.useBVH = false;

        this.resMgr = new ResourceTracker();
        this.track = this.resMgr.track.bind(this.resMgr);

        this.stats = new Stats();

        this.canvas = canvas;

        this.scale = 1;

        this.colorType = 0;

        this.centerPCL = false;

        this.updateCameraPos = false;

        this.param = this.initDefaultParam(canvas);

        this.pointcloud = new Map<PointCloudType, PointCloud>();

        this.camera   = this.initPerspectiveCamera(this.param);

        this.scene    = this.initScene(this.param);

        this.renderer = this.initRenderer(this.param);

        this.control = this.initArcballControl();

        this.canvas.appendChild(this.renderer.domElement);
        // this.canvas.appendChild(this.stats.dom);

        this.inverseMatOfPose = new THREE.Matrix4();

        this.scene.add(this.group);
        this.scene.add(this.markersGroup);

        // this.createGrid();
        // this.createArrows();
        
        const scope = this;
        this.lassoHelper = new LassoHelper(canvas);
        document.addEventListener("keyup", (event) => {
            
            if(!scope.canSelection) return;
            if(this.lassoHelper.points.length > 0){
                scope.lassoHelper.onPointerUp(event);
        
                if(event.key == "Shift" || event.key == "Control"){
                    if(event.key == "Control"){
                        scope.editor.setInvertSelect(true);
                    }
                    scope.control.enableRotate = true;
                    scope.control.enablePan = true;
                }
            }
            if(event.key == "Delete" || event.key == "Backspace"){
                scope.deleteSelection(scope.tmpPointCloud);
                scope.render();
            }

        });
        this.canvas.addEventListener("pointerdown", (event) => {
            if(!scope.canSelection) return;

            if(event.shiftKey || event.ctrlKey){
                if(event.ctrlKey){
                    this.editor.setInvertSelect(true);
                }
                scope.control.enableRotate = false;
                scope.control.enablePan = false;
                scope.lassoHelper.onPointerDown(event);
            }
        });
        this.canvas.addEventListener("pointerup", (event) => {
            if(!scope.canSelection) return;

            if(event.shiftKey || event.ctrlKey){
                scope.lassoHelper.onPointerUp(event);
            }
            scope.control.enableRotate = true;
            scope.control.enablePan = true;
        });
        this.canvas.addEventListener("pointermove", (event) => {
            if(!scope.canSelection) return;

            if(event.shiftKey || event.ctrlKey){
                scope.lassoHelper.onPointerMove(event);
            }
        });
        this.lassoHelper.setUpdateSelectionCallback((points: any, event: any) => {
            if(this.lassoHelper.toolMode == ToolMode.POINT){
                if(event.shiftKey){
                    this.editor.process(points, this.lassoHelper.toolMode, this.tmpPointCloud, this.camera, this.scene, (list) => {
                        if(this.selectedPointsListener){
                            this.selectedPointsListener(list);
                        }
                    });
                    this.editor.setInvertSelect(false);
                }else if(event.ctrlKey) {
                    this.editor.cancelSelectShperes(points, this.tmpPointCloud, this.camera, (list) => {
                        if(this.selectedPointsListener){
                            this.selectedPointsListener(list);
                        }
                    })
                }
            }else{
                this.editor.process(points, this.lassoHelper.toolMode, this.tmpPointCloud, this.camera, this.scene, (list) => {
                    if(this.selectedPointsListener){
                        this.selectedPointsListener(list);
                    }
                });
                this.editor.setInvertSelect(false);
            }

        })
        this.scene.add(this.camera);
        this.camera.add(this.lassoHelper.shape); 

        this.editor = new DataEditor();
        this.editor.addGroupToScene(this.scene);

        this.resetModelMaterial();

        this.render();

    }

    setSelectedPointsListener(callback: Function){
        this.selectedPointsListener = callback;
    }

    resetModelMaterial(){

        if(this.model){
            this.model.resetMaterial();
        }

    }

    debug(value: boolean){
        this.gui.domElement.style.display = value ? "inherit" : "none";
    }

    initDefaultParam(canvas: any){

        const param: ObParam = {

            canvas: {
                width: canvas.clientWidth,
                height: canvas.clientHeight
            },
            perspectiveCamera: {
                distance: 1.5,
                fov: 45,
                aspect: canvas.clientWidth / canvas.clientHeight,
                near: 0.01,
                far: 5000
            },
            scene: {
                background: new THREE.Color("#00FFF0")
            },
            renderer: {
                // background: new THREE.Color("#334C4C")
                background: new THREE.Color("#131A20")
            },
            effect: {
                frontcolor: new THREE.Color(0.5, 0.5, 0.5),
                backcolor:  new THREE.Color(0.8, 0.8, 0.5),
                specularcolor: new THREE.Color(2.0, 2.0, 2.0),
                shininess: 200.0
            }

        };

        return param;

    }

    /**
     * 初始化透视相机
     * @param aspect 
     * @returns 
     */
    initPerspectiveCamera(param: ObParam){

        const camera = new THREE.PerspectiveCamera(param.perspectiveCamera.fov, 
                                                   param.perspectiveCamera.aspect,
                                                   param.perspectiveCamera.near,
                                                   param.perspectiveCamera.far);

        camera.position.set(0, 0.1, param.perspectiveCamera.distance);
        camera.updateProjectionMatrix();

        return camera;

    }

    setScale(value: number){
        this.scale = value;
    }

    setCameraPosition(x: number, y: number, z: number){
        // this.camera.position.set(x, y, z);
    }

    initArcballControl(){

        const control = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
        // control.enableRotate = false;
        control.setGizmosVisible( false );
        control.enableZoom = true;
        // control.enablePan = false;
        control.saveState();
        control.minDistance = 0.1;
        control.maxDistance = 10;

        const scope = this;

        control.addEventListener("change", ()=>{

            // TODO: 可优化
            scope.render();
        });
        

        return control;

    }

    initScene(param: ObParam){

        const scene = new THREE.Scene();
        // scene.background = param.scene.background;
        const light = new THREE.HemisphereLight( 0xFFFFFF, 0x080820, 1 );
        scene.add(light);

        return scene;

    }

    initRenderer(param: ObParam){

        // TIPS : threejs 实现渐变色背景
        // https://www.cnblogs.com/yejunweb/p/15437612.html
        // 1、WebGLRender 示例化时添加 alpha 属性，如 : 
        //    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        // 2、renderer dom 元素设置渐变色样式，如 : 
        //    renderer.domElement.style.background = 'linear-gradient( 180deg, rgba( 0,0,0,1 ) 0%, rgba( 128,128,255,1 ) 100% )';
        // 注意： scene 不能指定背景颜色

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: false, precision:'lowp', powerPreference: 'high-performance', autoClear: false});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(param.canvas.width, param.canvas.height);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        // renderer.shadowMap.enabled = true;
        // renderer.domElement.style.background = 'linear-gradient( 180deg, rgba( 0,0,0,1 ) 0%, rgba( 128,128,255,1 ) 100% )';
        
        // renderer.domElement.style.background = "#" + param.renderer.background.getHexString();

        return renderer;

    }



    /**
     * 创建网格
     */
    createGrid(){

        const grid = new THREE.GridHelper(10, 100, 0x000000, 0x000000);
        grid.position.y = 0;
        grid.material.opacity = 0.5;
        grid.material.transparent = true;

        this.scene.add(this.track(grid));

    }

    /**
     * 创建坐标轴
     */
    createArrows(){

        const arrowLength = 2;

        const xArrow = new THREE.ArrowHelper(
            new THREE.Vector3(1.0, 0.0, 0.0),
            new THREE.Vector3(0.0, 0.0, 0.0),
            arrowLength,
            0xFF0000);

        const yArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0.0, 1.0, 0.0),
            new THREE.Vector3(0.0, 0.0, 0.0),
            arrowLength,
            0x00FF00);

        const zArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0.0, 0.0, 1.0),
            new THREE.Vector3(0.0, 0.0, 0.0),
            arrowLength,
            0x0000FF);
        
        this.scene.add(this.track(xArrow));
        this.scene.add(this.track(yArrow));
        this.scene.add(this.track(zArrow));

    }

    cleanModelCache(path: string){
        modelMap.set(path, null);
    }

    /**
     * 加载模型
     * @param path 
     * @returns 
     */
    loadModel(path: string){
        const scope = this;
        return new Promise((resolve, reject) => {
            // 清空当前帧点云和历史点云
            this.hide(PointCloudType.CURRENT);
            this.hide(PointCloudType.HISTORY);
            new ModelLoader().load(path)?.then( (model: Model) => {
                // 如果是第一次加载模型，则重置相机视角
                //if(!scope.model){
                if(scope.model){
                    scope.model.mesh.removeFromParent();
                    scope.model.dispose();
                    scope.model = undefined;
                    
                }
                scope.control.reset();
                scope.camera.position.set(0, 0, 2);                
                //}else{
                //    scope.model.mesh.removeFromParent();
                //    scope.model.dispose();
                //}
                scope.model = model;
                this.tmpPointCloud = model.mesh;

                const length = this.tmpPointCloud.geometry.attributes.position.array.length / 3;
                this.editor.setPointNum(length);

                this.group.position.copy(this.initPositionOfGroup);
                this.group.rotation.copy(this.initRotationOfGroup);

                this.group.add(scope.model.mesh);
                this.group.rotateX(Math.PI)

                model.mesh.geometry.computeBoundingBox();
                let box = new THREE.Box3().setFromObject(model.mesh);
  
                let center = box.getCenter(new THREE.Vector3());
                let size = box.getSize(new THREE.Vector3());
                let maxAxis = Math.max(size.x, size.y, size.z);
                
                this.group.scale.multiplyScalar(1/maxAxis);

                box.setFromObject(this.group);
                box.getCenter(center);
                box.getSize(size);

                // mesh 根据中心点位置反向移动到原点
                // group.position.copy(box.min).multiplyScalar(-1);
                this.group.position.copy(center).multiplyScalar(-1);

                // const helper = new THREE.Box3Helper( box, 0xffff00 );
                // scope.scene.add( helper );
                
                scope.render();
                resolve({ faces: model.faces, points: model.points, toggleable: scope.model.isToggleable() });
            }).catch( (error: any) => {
                console.log(error)
                reject();
            })
        });

    }

    // loadModel in call sequence
    loadModelSeq(path: string, pointSize: number, end: Function){
        const scope = this;

        function handleLoadTask() {
            const curTask = scope.loadQueue.front();

            // 清空当前帧点云和历史点云
            scope.hide(PointCloudType.CURRENT);
            scope.hide(PointCloudType.HISTORY);

            new ModelLoader().load(curTask.path)?.then( (model: Model) => {
        
                // 如果是第一次加载模型，则重置相机视角
                //if(!scope.model){
                if(scope.model){
                    scope.model.mesh.removeFromParent();
                    // scope.model.dispose();
                    scope.model = undefined;
                    
                }
                scope.control.reset();
                scope.camera.position.set(0, 0, 2);

                model.setPointSize(pointSize);
                scope.model = model;
                scope.tmpPointCloud = model.mesh;
                if(!!scope.model.points){
                    const length = scope.tmpPointCloud.geometry.attributes.position.array.length / 3;
                    scope.editor.setPointNum(length);
                }
                scope.editor.setFaceNum(model.faces);

                scope.group.position.copy(scope.initPositionOfGroup);
                scope.group.rotation.copy(scope.initRotationOfGroup);

                scope.group.add(scope.model.mesh);
                scope.group.rotateX(Math.PI)

                model.mesh.geometry.computeBoundingBox();
                let box = new THREE.Box3().setFromObject(model.mesh);

                let center = box.getCenter(new THREE.Vector3());
                let size = box.getSize(new THREE.Vector3());
                let maxAxis = Math.max(size.x, size.y, size.z);
                
                scope.group.scale.multiplyScalar(1.0/maxAxis);

                box.setFromObject(scope.group);
                box.getCenter(center);
                box.getSize(size);

                // mesh 根据中心点位置反向移动到原点
                // group.position.copy(box.min).multiplyScalar(-1);
                scope.group.position.copy(center).multiplyScalar(-1);

                // const helper = new THREE.Box3Helper( box, 0xffff00 );
                // scope.scene.add( helper );
                
                scope.render();
                curTask.callback({ faces: model.faces, points: model.points, toggleable: scope.model.isToggleable() });

                scope.loadQueue.deQueue();
                if (!scope.loadQueue.isEmpty()) {
                    handleLoadTask();
                }

            }).catch( (error: any) => {
                console.log(error)
                curTask.callback({ faces: 0, points: 0, toggleable: false });

                scope.loadQueue.deQueue();
                if (!scope.loadQueue.isEmpty()) {
                    handleLoadTask();
                }
            })
        }

        scope.loadQueue.enQueue({path: path, callback: end});

        if (1 == scope.loadQueue.size()) {
            handleLoadTask();
        } else {
            return;
        }
    }

    cleanModel(){

        this.editor.cleanGroup();

        if(this.model){
            this.model.mesh.removeFromParent();
            this.model.dispose();
            this.model = undefined;
        }
    }

    toggleModel(){
        
        if(this.model){
            this.model.toggle();
        }

        this.render();

    }

    async test(url: string){
        // await this.loadModel("E:\\Projects\\CreatilyScan\\frontend\\portablescanner\\node_modules\\electron\\dist\\projects\\scan-2023-07-11_16-31-47\\result\\Optimization.ply");
        // await this.loadModel("C:\\test\\scan-2023-06-27_15-05-45\\result\\Mesh.stl");
        // await this.loadModel("F://scene.ply");
        await this.loadModel("F://Optimization.ply");
        // await this.loadModel("F://scene.ply");
        // await this.loadModel("F://Optimization.ply");
        // await this.loadModel("F://Optimization.ply");
        // this.editor.loadPly("F://scene.ply").then((geometry) => {
        //     console.log("===========", geometry)
        //     tmpPointCloud = geometry;
        //     this.scene.add(geometry);
        // });
        return;
    }
    
    updateTestPoints(type: PointCloudType, vertices?: Float32Array, normals?: Float32Array){

        this.initPoints(type);

        const points = this.pointcloud.get(type);

        if(!points){
            return;
        }
        
        points.geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        points.geometry.setAttribute( 'normal',   new THREE.BufferAttribute(normals, 3));


        const status = [];
        const indices = [];
        const verticesLength = points.geometry.attributes.position.count;
        for (let i = 0; i < verticesLength; i++) {
            indices.push(i, i, i);
            status.push(1);
        }
        
        points.geometry.setIndex(indices);
        if(points.geometry.index){
            points.geometry.index.needsUpdate = true;
        }
        
        // 手动添加 status 属性，且属性值都为1
        points.geometry.setAttribute('status', new THREE.Int32BufferAttribute(status, 1).setUsage(THREE.DynamicDrawUsage));
        console.time('计算 boudsTree');
        points.geometry.boundsTree = new MeshBVH(points.geometry);
        console.timeEnd('计算 boudsTree');

        this.tmpPointCloud = points;
      

        this.render();

    }

    setSelectionMode(mode: SelectionMode){

        this.editor.setSelectionMode(mode);

    }

    setPointSize(size: number, type?: PointCloudType){
        if(type == PointCloudType.HISTORY){
            hisFrameMaterial.forEach((material) => {
                material.uniforms.size.value = size;
                material.needsUpdate = true;
            });
        }else if(type == PointCloudType.CURRENT){
            curFrameMaterial.uniforms.size.value = size;
            curFrameMaterial.needsUpdate = true;
        }else{
            if(this.model){
                this.model.setPointSize(size);
            }
        }
    }

    initPoints(type: PointCloudType){

        if(!this.pointcloud.get(type)){
            const geometry = new THREE.BufferGeometry();
            
            let material;
            if(this.useBVH){
                material = modelMaterial;
            }else{
                material = (type == PointCloudType.CURRENT? curFrameMaterial : hisFrameMaterial.get(this.colorType));
            }
            
            const points = this.track(new THREE.Points(geometry, material));
            points.name = type == PointCloudType.CURRENT ? "current" : "history";
            points.frustumCulled = false;

            this.pointcloud.set(type, points);

            this.scene.add(points);
        }
    }

    clear(){

        // 清除当前帧点云对象
        const currentPointCloud = this.pointcloud.get(PointCloudType.CURRENT);
        if (currentPointCloud) {
            // 从场景中移除当前帧点云对象
            this.scene.remove(currentPointCloud);
            // // 释放当前帧点云对象相关资源
            // currentPointCloud.geometry.dispose();
            // currentPointCloud.material.dispose();
        }

        // 清除历史帧点云对象
        const historyPointCloud = this.pointcloud.get(PointCloudType.HISTORY);
        if (historyPointCloud) {
            // 从场景中移除历史帧点云对象
            this.scene.remove(historyPointCloud);
            // // 释放历史帧点云对象相关资源
            // historyPointCloud.geometry.dispose();
            // historyPointCloud.material.dispose();
        }

        this.hideMarkers();
        // 清空点云对象的 Map
        // this.pointcloud.clear();

    }

    moveToCenter(value: boolean){
        
        this.centerPCL = value;
        this.updateCameraPos = true;

    }

    enableBVH(){
        this.useBVH = true;
    }

    enableSelection(value: boolean){

        this.canSelection = value;

    }


    updatePoints(type: PointCloudType, vertices?: Float32Array, normals?: Float32Array, colors?: Uint8Array, info: any, forceUpdate?: boolean, ){

        const tracked: boolean = (0 == info.tracking);

        // 取出 pose 矩阵
        const poseMatrix = new THREE.Matrix4();
            
        poseMatrix.set(info.pose[0],  info.pose[1],  info.pose[2],  info.pose[3],
                       info.pose[4],  info.pose[5],  info.pose[6],  info.pose[7],
                       info.pose[8],  info.pose[9],  info.pose[10], info.pose[11],
                       info.pose[12], info.pose[13], info.pose[14], info.pose[15]);
        this.inverseMatOfPose.copy(poseMatrix.invert());

        this.initPoints(type);

        const points = this.pointcloud.get(type);
        if(!points){
            return;
        }
        
        const obj = this.scene.getObjectByName(type == PointCloudType.CURRENT ? "current" : "history");
        if(!obj){
            this.scene.add(points);
        }
        
        let scale = this.scale;

        // 计算包围盒尺寸及缩放比例
        // if(type == PointCloudType.CURRENT){
            
            if(info.min && info.max){
                const box = new THREE.Box3(new THREE.Vector3(info.min[0], info.min[1], info.min[2]),
                                           new THREE.Vector3(info.max[0], info.max[1], info.max[2]));
                
                let size = box.getSize(new THREE.Vector3());
                let maxAxis = Math.max(size.x, size.y, size.z);

                scale = 1 / maxAxis * 0.7 * this.scale;
                currentScale = scale;
                this.center.set(info.center[0], -info.center[1] + 0.01, -info.center[2] - 0.112);
            }

            
        // }

        this.vBuffer = null;
        this.nBuffer = null;

        if(vertices){
            this.vBuffer = new THREE.BufferAttribute(vertices,4);
            points.geometry.setAttribute( 'position', this.vBuffer );
        }
        if(normals){
            this.nBuffer = new THREE.BufferAttribute(normals, 3);
            points.geometry.setAttribute( 'normal', this.nBuffer);
        }
        
        points.material.uniforms.scale.value = scale;

        if(type == PointCloudType.HISTORY){
            // 

            if(this.colorType != info.color){
                points.material = hisFrameMaterial.get(info.color);
                points.material.needsUpdate = true;
            }

            // TODO : 这里使用历史帧包围盒，改成当前帧的试试
            // this.center.set(info.center[0] * s, info.center[1] * s, -info.center[2] * s);
            
            
            switch(info.color){
                case 0:
                    // none
                    break;
                case 1:
                    // spectrogram
                    if(vertices){
                        points.geometry.setAttribute( 'ipos', new THREE.BufferAttribute( vertices, 4 ));
                    }
                    
                    break;
                case 2:
                    // reality

                    if(colors != undefined && colors.length > 0){
                        points.geometry.setAttribute( 'icolor', new THREE.BufferAttribute(colors, 3));
                    }
                    break;
                default:
                    break;
            }
                
            this.colorType = info.color;

        }
        if(tracked){
            if(points.material.uniforms.inverseMatOfPose){
                points.material.uniforms.inverseMatOfPose.value.copy(this.inverseMatOfPose);
                points.material.uniforms.inverseMatOfPose.value.needsUpdate = true;
            }
        }

        points.material.uniforms.center.value.copy(this.center);

        if(type == PointCloudType.CURRENT){
            points.material.uniforms.color.value = tracked ? new THREE.Vector3(0, 139.0/255, 41.0/255) : new THREE.Vector3(0.9, 0.22, 0.22);
            points.material.uniforms.color.value.needsUpdate = true;
            // points.material.depthTest = true;
            // points.material.needsUpdate = true;
            // this.updateMarkers(info.markers.num, info.markers.inner, info.markers.outer, info.markers.flags, info.markers.position, info.markers.normal);
            // this.updateMarkers(info.markers.vertices, info.markers.triangles, info.markers.colors, this.inverseMatOfPose, this.center, scale);

        }

        this.render();

    }

    // TODO : 添加点云法向量数据，修改 shader ，实现 phong 效果
    updateMesh(type: PointCloudType, vertices?: Float32Array, normals?: Float32Array, colors?: Uint8Array, info: any, forceUpdate?: boolean){
        // this.updateTestPoints(type, vertices, normals);
        this.updatePoints(type, vertices, normals, colors, info, forceUpdate);
    }

    hideMarkers(){
        if(this.markerMesh){
            this.markerMesh.visible = false;
        }
    }

    updateMarkers(v: Float32Array, c: Float32Array, pose: Float32Array){

        const matrix = new THREE.Matrix4();
            
        if (undefined == pose) {
            return;
        }
        matrix.set(pose[0],  pose[1],  pose[2],  pose[3],
                   pose[4],  pose[5],  pose[6],  pose[7],
                   pose[8],  pose[9],  pose[10], pose[11],
                   pose[12], pose[13], pose[14], pose[15]);

        const center = this.center;
        const scale = currentScale;

        if(!this.markerMesh){
            const geometry = new THREE.BufferGeometry();   

            this.markerMesh = new THREE.Mesh(geometry, markerMaterial);
            this.markerMesh.frustumCulled = false;

            this.scene.add(this.track(this.markerMesh));
            
        }

        this.markerMesh.visible = true;

        if(v.length == 0 || c.length == 0){
            return;
        }
        
        // let verticesArray = new Float32Array(v.length);
        // let colorArray = new Float32Array(c.length);
        // for(let i = 0; i < v.length; i++){
        //     verticesArray[i] = v[i];
        //     colorArray[i] = c[i];
        // }
        // TODO: marker 点的渲染添加 scale 属性

        // this.markerMesh.depthTest = true;
        this.markerMesh.material.uniforms.factor.value = scale;
        this.markerMesh.material.uniforms.factor.needsUpdate = true;

        this.markerMesh.material.uniforms.inverseMatOfPose.value.copy(matrix.invert());
        this.markerMesh.material.uniforms.inverseMatOfPose.value.needsUpdate = true;

        this.markerMesh.material.uniforms.center.value.copy(center);
        this.markerMesh.material.uniforms.center.value.needsUpdate = true;

      
        this.markerMesh.geometry.setAttribute('position', new THREE.BufferAttribute( v, 3 ));  
        this.markerMesh.geometry.attributes.position.needsUpdate = true;
        
        this.markerMesh.geometry.setAttribute( 'icolor', new THREE.BufferAttribute(c, 3));
        this.markerMesh.geometry.attributes.icolor.needsUpdate = true;

        this.markerMesh.material.needsUpdate = true;
    }

    movePointCloud(offsetX: number, offsetY: number){
        
        this.camera.position.x += offsetX;
        this.camera.position.y += offsetY;

        this.render();

    }

    scalePointCloud(scale: number){
        
        this.camera.position.z += scale;
        this.render();

    }

    /**
     * 重置大小
     * @param {number} width 
     * @param {number} height 
     */
    resize(width: number, height: number){

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setPixelRatio(width / height)
        this.renderer.setSize(width, height)

        this.render();

    }



    enableRotate(value: boolean){
        this.control.enableRotate = value;
    }

    enablePan(value: boolean){
        
        this.control.enablePan = value;

    }

    async takeScreenShot(){ 
        
        function dataURLtoArrayBuffer(dataURL) {  
            const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");  
            const raw = window.atob(base64Data);  
            const rawLength = raw.length;  
            const uInt8Array = new Uint8Array(rawLength);  
        
            for (let i = 0; i < rawLength; ++i) {  
                uInt8Array[i] = raw.charCodeAt(i);  
            }  
        
            return uInt8Array.buffer;  
        }

        return new Promise((resolve, reject) => {
            html2canvas(this.canvas, {  
                backgroundColor: null // null或transparent可将canvas背景设置为透明
            }).then((canvas) => {  
                const dataURL = canvas.toDataURL('image/png');  
                const arrayBuffer = dataURLtoArrayBuffer(dataURL);  
                resolve(arrayBuffer);  
            }).catch(error => {  
                reject(error);  
            });  
        });     
    }

    /**
     * 重置
     */
    reset(){

        // this.control.reset();
        if(this.control){
            this.control.reset();
        }

    }

    /**
     * 渲染
     */
    render(){

        if(this.lassoHelper){
            this.lassoHelper.render(this.camera.fov, this.camera.aspect);
        }

        // if(this.stats){
        //     this.stats.update();
        // }
        this.renderer.render(this.scene, this.camera);

    }

    show(type: PointCloudType){

        if(this.pointcloud.get(type)){
            this.scene.add(this.pointcloud.get(type));
        }

    }

    hide(type: PointCloudType){
        
        this.scene.remove(this.pointcloud.get(type));

    }

    change(){
        this.pointcloud.get(PointCloudType.HISTORY)?.toggleColorType(PointCloudColorType.REALITY);
    }

    getPointsNum(){
        return this.editor.pointsNum;
    }

    getFacesNum(){
        return this.editor.facesNum;
    }

    free(){

        if(this.timer){
            clearInterval(this.timer);
        }

        if(this.model){
            this.model.dispose();
        }

        this.scene.clear();
        this.resMgr && this.resMgr.dispose();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.content = null;
        let gl = this.renderer.domElement.getContext("webgl");
        gl && gl.getExtension("WEBGL_lose_context").loseContext();
        console.log(this.renderer.info);
        console.log("================ free", this.resMgr)
    }

    invertSelection(){
        console.log("invertSelection")
        this.editor.invertSelection(this.tmpPointCloud);
    }

    deleteSelection(){
        this.editor.deleteSelection(this.tmpPointCloud);
    }

    exportSelection(path: string){
        return this.editor.exportSelection(this.tmpPointCloud, path);
    }

    resetSelection(){
        this.editor.resetSelection(this.tmpPointCloud);
    }

    undo(){
        this.editor.undo(this.tmpPointCloud);
    }

    redo(){
        this.editor.redo(this.tmpPointCloud);
    }

    toggleToolMode(mode: ToolMode){
        this.lassoHelper.toggleToolMode(mode);
    }

}

export { PCLPlayer, PointCloudType, ToolMode, SelectionMode };