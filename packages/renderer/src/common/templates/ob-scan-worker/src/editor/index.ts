// @ts-check
import { Util } from "./util";

import * as THREE from "three";
import { ref } from "vue";
import { 
    MeshBVHVisualizer,
    acceleratedRaycast,
    computeBoundsTree,
    disposeBoundsTree,
    MeshBVH,
    CONTAINED,
    INTERSECTED,
    NOT_INTERSECTED,
    CENTER 
} from "three-mesh-bvh";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { PLYExporter } from "three/examples/jsm/exporters/PLYExporter";

import * as path from 'path';
import { call } from "naive-ui/es/_utils";
import { SpriteManage } from "../sprite";
import { ToolMode } from "./lassoHelper";

THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

enum EditAction{
    EMPTY,
    DELETE,
    UNDO,
    REDO
}

// TODO 对于不同大小的模型，这个地方需要注意设置对应的数值,这个值是用于点选的时候设置碰撞的范围的

const pointSize = 0.01;

enum SelectionMode{
    PENERTRATE,
    SURFACE
}

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
    pointSize: 0.001,
    raycastThreshold: 0.05,
    useBVH: true,
    invertSelected: false
};

class DataEditor{

    pointCloud?: THREE.Points;

    invWorldMatrix: THREE.Matrix4;
    camLocalPosition: THREE.Vector3;
    tempRay: THREE.Ray;
    centroid: THREE.Vector3;
    screenCentroid: THREE.Vector3;
    faceNormal: THREE.Vector3;
    toScreenSpaceMatrix: THREE.Matrix4;
    boxPoints: Array<THREE.Vector3>;
    boxLines: Array<THREE.Line3>;

    lassoSegments: THREE.Line3[];
    perBoundsSegments: THREE.Line3[];

    raycaster: THREE.Raycaster;

    delHistory: number[][];
    redoHistory: number[][];

    pointsNum: any;
    facesNum: any;

    lastNum: number;

    sphereGroup: THREE.Group;

    spriteManage: SpriteManage;

    action: EditAction

    constructor(){

        this.spriteManage = new SpriteManage();

        this.sphereGroup = new THREE.Group();

        this.delHistory = [];
        this.redoHistory = [];
        this.pointsNum = ref(0);
        this.facesNum = ref(0);
        this.lastNum = 0;

        this.action = EditAction.EMPTY;

        this.raycaster = new THREE.Raycaster();
        // this.pointCgetPointloud = new THREE.Points();
        this.invWorldMatrix   = new THREE.Matrix4();
        this.camLocalPosition = new THREE.Vector3();
        this.tempRay = new THREE.Ray();
        this.centroid = new THREE.Vector3();
        this.screenCentroid = new THREE.Vector3();
        this.faceNormal = new THREE.Vector3();
        this.toScreenSpaceMatrix = new THREE.Matrix4();
        this.boxPoints = Array.from({length: 8}, () => new THREE.Vector3());
        this.boxLines = Array.from({ length: 8}, () => new THREE.Line3())

        this.lassoSegments = [];
        this.perBoundsSegments = [];

    }

    async loadPly(url: string){

        return new Promise(async (resolve, reject) => {
            const loader = new PLYLoader();
            const geometry = await loader.loadAsync(url).catch(e => { console.error('加载点云数据异常:%o', e) });
            if (geometry) {
                geometry.center();
                const material = new THREE.PointsMaterial({
                    size: pointSize,
                    vertexColors: true
                });
                // 在点材质的着色器代码内添加自定义的顶点选中状态属性 status.
                // 当 status=0 时：顶点不渲染。 
                // 当 status=1 时：顶点正常渲染。
                // 当 status=-1 时：顶点进行混合渲染，混合颜色为‘蓝色’。
            
                material.onBeforeCompile = (shader, shaderRenderer) => {
                    shader.vertexShader = shader.vertexShader.replace('uniform float size;',
                    `uniform float size;
                    attribute int status;
                    flat varying int vStatus;
                    `).replace('void main() {', `
                    void main() {
                    vStatus = status;`);
            
                    shader.fragmentShader = shader.fragmentShader.replace('uniform float opacity;', `
                    uniform float opacity;
                    flat varying int vStatus;
                    `).replace('void main() {', `
                    void main() {
                    if (vStatus == 0) {
                        discard;
                    }
                    `).replace('#include <output_fragment>', `
                    #include <output_fragment>
                    if (vStatus < 0) {
                    gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 1.0, 1.0), 0.8);
                    }
                    `);
                };
                this.pointCloud = new THREE.Points(geometry, material);
                this.pointCloud.matrixAutoUpdate = false;
                // rootGroup.add(pointCloud);
            
                // 生成 bvh
                const status = [];
                const indices = [];
                const verticesLength = geometry.attributes.position.count;
                for (let i = 0; i < verticesLength; i++) {
                    indices.push(i, i, i);
                    status.push(1);
                }
                
                this.pointCloud.geometry.setIndex(indices);
                if(this.pointCloud.geometry.index){
                    this.pointCloud.geometry.index.needsUpdate = true;
                }
                
                // 手动添加 status 属性，且属性值都为1
                this.pointCloud.geometry.setAttribute('status', new THREE.Int32BufferAttribute(status, 1).setUsage(THREE.DynamicDrawUsage));
            
                console.time('计算 boudsTree');
                this.pointCloud.geometry.boundsTree = new MeshBVH(this.pointCloud.geometry);
                console.timeEnd('计算 boudsTree');

                resolve(this.pointCloud);
            }
        });
    }

    setSelectionMode(mode: SelectionMode){
        switch(mode){
            case SelectionMode.PENERTRATE:
                currentConfig.selectionMode = "intersection";
                break;
            case SelectionMode.SURFACE:
                currentConfig.selectionMode = "centroid-visible";
                break;
            default:
                break; 
        }

    }

    setInvertSelect(value: boolean){
        currentConfig.invertSelected = value;
    }

    addGroupToScene(scene: THREE.Scene){
        scene.add(this.sphereGroup);
    }

    generateUniqueColor(index: number): string {
        const forbiddenColors = ["#0000FF", "#FFA500"]; // Blue and Orange in hex
        const colorPalette = [
            "#FF0000", "#00FF00", "#800080", "#FFFF00", "#FFC0CB",
            "#A52A2A", "#008080", "#FF00FF", "#00FFFF", "#00FF00",
        ];

        const validColors = colorPalette.filter(color => !forbiddenColors.includes(color));

        const colorIndex = index % validColors.length;
        return validColors[colorIndex];
    }

    cleanGroup(){
        this.sphereGroup.children = [];
    }

    getSelectedPointsList(){
        var indexs = [];
        for(var i = 0; i < this.sphereGroup.children.length; i++){
          indexs.push(parseInt(this.sphereGroup.children[i].name));
        }
        return indexs;
    }

    cancelSelectShperes(lassoPoints: [],  pointCloud: THREE.Points, camera: THREE.PerspectiveCamera, callback: Function){
        const len: number = 3;
        if(lassoPoints.length == len && this.raycaster.params.Points) {
            this.raycaster.params.Points.threshold = 0.3;
            const mouse = new THREE.Vector2(lassoPoints.at(0), lassoPoints.at(1));
            this.raycaster.setFromCamera(mouse, camera);

            // 查找 sphereGroup 中是否存在相交的点
            const selectedSphere = this.raycaster.intersectObject(this.sphereGroup, true);
            if(selectedSphere.length > 0){
                const selected = selectedSphere[0].object;
                this.sphereGroup.remove(selected);
                // 更新其他球体的颜色
                for(var i = 0; i < this.sphereGroup.children.length; i++){
                    const sphere = this.sphereGroup.children[i];
                    // @ts-ignore TODO: ISSUE HERE
                    sphere.material?.color.set(this.generateUniqueColor(i));
                }

                (pointCloud.geometry.attributes.status.array as any)[parseInt(selected.name)] = 1;
                pointCloud.geometry.attributes.status.needsUpdate = true;

                if(callback){
                    callback(this.getSelectedPointsList());
                }

                return;
            }
        }
    }

    process(lassoPoints: [], toolMode: ToolMode, pointCloud: THREE.Points, camera: THREE.PerspectiveCamera, scene: THREE.Scene, callback: Function){
  
        const len: number = 3;
        if(lassoPoints.length == 0){
            return
        }


        if(lassoPoints.length == len && this.raycaster.params.Points && toolMode == ToolMode.POINT){
            let threshold = 1;
            // if(pointCloud.geometry.attributes.position.array.length >= 9000000){
            //     threshold = 0.001;
            // }

            this.raycaster.params.Points.threshold = threshold;
            
            const mouse = new THREE.Vector2(lassoPoints.at(0), lassoPoints.at(1));
            this.raycaster.setFromCamera(mouse, camera);

            // 查找 sphereGroup 中是否存在相交的点
            const selectedSphere = this.raycaster.intersectObject(this.sphereGroup, true);
            if(selectedSphere.length > 0){
                return;
            }

            const intersects = this.raycaster.intersectObject(pointCloud as any, true);
            if(Array.isArray(intersects) && intersects.length > 0){
                const hit = intersects[0];
                if(hit){
                    
                    const index = hit.index as number;

                    (pointCloud.geometry.attributes.status.array as any)[index] = -(pointCloud.geometry.attributes.status.array as any)[index];
                    pointCloud.geometry.attributes.status.needsUpdate = true;

                    // const sprite = this.spriteManage.createTextSprite(this.sphereGroup.children.length);
                    // sprite.position.set(hit.point.x, hit.point.y, hit.point.z + 0.015);
                    // this.sphereGroup.add(sprite);

                    const s = 0.015;
                    const geometry = new THREE.SphereGeometry(s, 20, 20);
                    const material = new THREE.MeshBasicMaterial({ color: this.generateUniqueColor(this.sphereGroup.children.length) });
                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.name = '' + index;
                    sphere.position.set(hit.point.x, hit.point.y, hit.point.z);
                    this.sphereGroup.add(sphere);

                    if(callback){
                        callback(this.getSelectedPointsList());
                    }
                }
                return;
            }
        }else{
            // 预计算屏幕空间变化矩阵
            this.toScreenSpaceMatrix
            .copy(pointCloud.matrixWorld)
            .premultiply(camera.matrixWorldInverse)
            .premultiply(camera.projectionMatrix);

            // 更新框选点
            while (this.lassoSegments.length < lassoPoints.length) {
                this.lassoSegments.push(new THREE.Line3());
            }

            this.lassoSegments.length = lassoPoints.length;

            // 更新 lassoSegments 的数组顶点信息
            for (let s = 0, l = lassoPoints.length; s < l; s += 3) {
                const line = this.lassoSegments[s];
                const sNext = (s + 3) % l;
                line.start.x = lassoPoints[s];
                line.start.y = lassoPoints[s + 1];
            
                line.end.x = lassoPoints[sNext];
                line.end.y = lassoPoints[sNext + 1];
            }

            // 获取点云模型的逆矩阵
            this.invWorldMatrix.copy(pointCloud.matrixWorld).invert();
            // 计算相机相对坐标
            this.camLocalPosition
                .set(0, 0, 0)
                .applyMatrix4(camera.matrixWorld)
                .applyMatrix4(this.invWorldMatrix);

            const startTime = window.performance.now();
            // 用于保存顶点索引数组的下标
            const indices: number[] = [];
            // 基于 boundsTree 快速计算相交结果
            if(pointCloud.geometry.boundsTree){
                pointCloud.geometry.boundsTree.shapecast({
                    // 盒子模型交点计算
                    intersectsBounds: (box, isLeaf, score, depth) => {

                        if (!currentConfig.useBoundsTree) {
                            return INTERSECTED;
                        }
                
                        // 获取包围盒的两个极值
                        const { min, max } = box;
                        let index = 0;
                
                        let minY = Infinity;
                        let maxY = -Infinity;
                        let minX = Infinity;
                        // 根据盒子模型，计算每个顶点对应的极值
                        for (let x = 0; x <= 1; x++) {
                            for (let y = 0; y <= 1; y++) {
                                for (let z = 0; z <= 1; z++) {
                                const v = this.boxPoints[index];
                                v.x = x === 0 ? min.x : max.x;
                                v.y = y === 0 ? min.y : max.y;
                                v.z = z === 0 ? min.z : max.z;
                                (v as any).w = 1;
                                v.applyMatrix4(this.toScreenSpaceMatrix);
                                index++;
                    
                                if (v.y < minY) minY = v.y;
                                if (v.y > maxY) maxY = v.y;
                                if (v.x < minX) minX = v.x;
                                }
                            }
                        }
                
                        // Find all the relevant segments here and cache them in the above array for
                        // subsequent child checks to use.
                        const parentSegments: any = this.perBoundsSegments[depth - 1] || this.lassoSegments;
                        const segmentsToCheck: any = this.perBoundsSegments[depth] || [];
                        segmentsToCheck.length = 0;
                        this.perBoundsSegments[depth] = segmentsToCheck;
                        // 计算套索顶点和盒子顶点可能存在交集的线段
                        for (let i = 0, l = parentSegments.length; i < l; i++) {
                            const line = parentSegments[i];
                            const sx = line.start.x;
                            const sy = line.start.y;
                            const ex = line.end.x;
                            const ey = line.end.y;
                            if (sx < minX && ex < minX) continue;
                    
                            const startAbove = sy > maxY;
                            const endAbove = ey > maxY;
                            if (startAbove && endAbove) continue;
                    
                            const startBelow = sy < minY;
                            const endBelow = ey < minY;
                            if (startBelow && endBelow) continue;
                    
                            segmentsToCheck.push(line);
                        }
                
                        // 计算相交的数组结果为0，返回 NOT_INTERSECTED 标志。
                        if (segmentsToCheck.length === 0) {
                        return NOT_INTERSECTED;
                        }
                
                        // 计算盒子顶点的凸多边形线段
                        const hull: any = Util.getConvexHull(this.boxPoints);
                        
                        const lines = hull.map((p: any, i: any) => {
                            const nextP = hull[(i + 1) % hull.length];
                            const line = this.boxLines[i];
                            line.start.copy(p);
                            line.end.copy(nextP);
                            return line;
                        });
                
                        // If a lasso point is inside the hull then it's intersected and cannot be contained
                        // 如果套索顶点位于凸多边形内部，说明是被选中的盒子对象
                        if (
                            Util.pointRayCrossesSegments(segmentsToCheck[0].start, lines) % 2 ===
                            1
                        ) {
                            return INTERSECTED;
                        }
                
                        // check if the screen space hull is in the lasso
                        let crossings = 0;
                        for (let i = 0, l = hull.length; i < l; i++) {
                            const v = hull[i];
                            const pCrossings = Util.pointRayCrossesSegments(v, segmentsToCheck);
                    
                            if (i === 0) {
                                crossings = pCrossings;
                            }
                    
                            // if two points on the hull have different amounts of crossings then
                            // it can only be intersected
                            if (crossings !== pCrossings) {
                                return INTERSECTED;
                            }
                        }
                
                        // check if there are any intersections
                        for (let i = 0, l = lines.length; i < l; i++) {
                        const boxLine = lines[i];
                        for (let s = 0, ls = segmentsToCheck.length; s < ls; s++) {
                            if (Util.lineCrossesLine(boxLine, segmentsToCheck[s])) {
                            return INTERSECTED;
                            }
                        }
                        }
                
                        return crossings % 2 === 0 ? NOT_INTERSECTED : CONTAINED;
                    },
                
                    // 根据包围盒的结果计算三角面的相交情况
                    intersectsTriangle: (tri, index, contained, depth) => {
                        const i3 = index * 3;
                        const a = i3 + 0;
                        const b = i3 + 1;
                        const c = i3 + 2;
                
                        // TODO:
                        // check all the segments if using no bounds tree
                        const segmentsToCheck: any = true
                        ? this.perBoundsSegments[depth]
                        : this.lassoSegments;
                        if (
                            currentConfig.selectionMode === "centroid" ||
                            currentConfig.selectionMode === "centroid-visible"
                        ) {
                        // 获取三角面的几何中心点
                        this.centroid
                            .copy(tri.a)
                            .add(tri.b)
                            .add(tri.c)
                            .multiplyScalar(1 / 3);
                        // 计算屏幕空间下的中心点坐标
                        this.screenCentroid.copy(this.centroid).applyMatrix4(this.toScreenSpaceMatrix);
                
                        // 统计交点
                        if (
                            contained ||
                            Util.pointRayCrossesSegments(this.screenCentroid, segmentsToCheck) % 2 === 1
                        ) {
                            // 判断是否针对可见面进行款选
                            if (currentConfig.selectionMode === "centroid-visible") {
                                // 基于三角面的法线来定义射线的起始点。
                                tri.getNormal(this.faceNormal);
                                this.tempRay.origin.copy(this.centroid).addScaledVector(this.faceNormal, 1e-6);
                                // 基于相机相对位置以及中心点的位置，计算射线的方向
                                this.tempRay.direction.subVectors(this.camLocalPosition, this.centroid);
                    
                                // 通过指向相机的射线来判断是否为可见面
                                if(pointCloud.geometry.boundsTree){
                                    const res = pointCloud.geometry.boundsTree.raycastFirst(
                                        this.tempRay,
                                        THREE.DoubleSide
                                    );
                                    if (res) {
                                        return false;
                                    }
                                }
                            }
                
                            // 存储顶点索引的数组下标。用于从index数组下拿到对应的顶点索引。
                            indices.push(a, b, c);
                            return currentConfig.selectModel;
                        }
                        } else if (currentConfig.selectionMode === "intersection") {
                        // 穿透拾取的判断逻辑
                        // if the parent bounds were marked as contained then we contain all the triangles within
                        if (contained) {
                            indices.push(a, b, c);
                            return currentConfig.selectModel;
                        }
                
                        // get the projected vertices
                        const vertices = [tri.a, tri.b, tri.c];
                
                        // check if any of the vertices are inside the selection and if so then the triangle is selected
                        // 判断三角形顶点是否在框选范围内
                        for (let j = 0; j < 3; j++) {
                            const v = vertices[j];
                            v.applyMatrix4(this.toScreenSpaceMatrix);
                
                            const crossings = Util.pointRayCrossesSegments(v, segmentsToCheck);
                            if (crossings % 2 === 1) {
                            indices.push(a, b, c);
                            return currentConfig.selectModel;
                            }
                        }
                
                        // get the lines for the triangle
                        const lines = [this.boxLines[0], this.boxLines[1], this.boxLines[2]];
                
                        lines[0].start.copy(tri.a);
                        lines[0].end.copy(tri.b);
                
                        lines[1].start.copy(tri.b);
                        lines[1].end.copy(tri.c);
                
                        lines[2].start.copy(tri.c);
                        lines[2].end.copy(tri.a);
                
                        // check for the case where a selection intersects a triangle but does not contain any
                        // of the vertices
                        for (let i = 0; i < 3; i++) {
                            const l = lines[i];
                            for (let s = 0, sl = segmentsToCheck.length; s < sl; s++) {
                            if (Util.lineCrossesLine(l, segmentsToCheck[s])) {
                                indices.push(a, b, c);
                                return currentConfig.selectModel;
                            }
                            }
                        }
                        }
                
                        return false;
                    },
                });
                
                const traverseTime = window.performance.now() - startTime;
                console.log(`${traverseTime.toFixed(3)}ms`)
            
                // 拿到顶点索引数组
                const indexAttr: any = pointCloud.geometry.index;
                if (indices.length && currentConfig.selectModel) {
                // 全选，当前实现不需要考虑
                for (let i = 0, l = indexAttr.count; i < l; i++) {
                    const i2 = indexAttr.getX(i);
                }
                } else {
                    for (let i = 0, l = indices.length; i < l; i++) {
                        // 获取顶点数组的下标
                        const i2 = indexAttr.getX(indices[i]);
                        if (currentConfig.invertSelected) {
                            // 反选模式下，把顶点的选中状态改为 1.
                            if (pointCloud.geometry.attributes.status.array[i2] === -1) {
                                (pointCloud.geometry.attributes.status.array as any)[i2] = 1;
                            }
                        } else {
                        // 正常选中时，把顶点选中状态改为-1
                            (pointCloud.geometry.attributes.status.array as any)[i2] = pointCloud.geometry.attributes.status.array[i2] === 0 ? 0 : -1;
                        }
                    }
                    pointCloud.geometry.attributes.status.needsUpdate = true;
                }
            }
        }
        
    }

    setPointNum(length: number){

        this.pointsNum.value = length;
        this.delHistory.length = 0;

    }

    setFaceNum(length: number){
        
        this.facesNum.value = length;
        this.delHistory.length = 0;

    }

    getPointsNum(){

        return this.pointsNum.value;

    }

    getFacesNum(){

        return this.facesNum.value;

    }

    exportSelection(pointCloud: THREE.Points, projectDir: string){
        
        return new Promise((resolve, reject) => {
            if(!pointCloud || this.pointsNum.value == pointCloud.geometry.attributes.position.array.length / 3){
                // 未发生编辑行为
                resolve([]);
            }else{
                // 发生编辑行为
                let list = [];
                const array = pointCloud.geometry.attributes.status.array;
                for(let index = 0; index < array.length; index++){
                    if(array[index] === 0){
                        list.push(index);
                    }
                }
                resolve(list);
            }
        });

    }

    invertSelection(pointCloud: THREE.Points){
        if(!pointCloud){
            return;
        }

        const array = pointCloud.geometry.attributes.status.array;
        for(let index = 0; index < array.length; index++){
            (array as any)[index] = -(array as any)[index];
        }

        pointCloud.geometry.attributes.status.needsUpdate = true;
    }

    resetSelection(pointCloud: THREE.Points){
        // pointCloud.geometry.attributes.status.array.fill(1);
        if(!pointCloud){
            return;
        }
        this.delHistory = [];
        this.redoHistory = [];
        for(let i = 0; i < pointCloud.geometry.attributes.status.array.length; i++){
            (pointCloud.geometry.attributes.status.array as any)[i] = 1;
        }
    }

    deleteSelection(pointCloud: THREE.Points){
        const array = pointCloud.geometry.attributes.status.array;
        const delIndex = [];
        for(let index = 0; index < array.length; index++){
            if(array[index] === -1){
                (array as any)[index] = 0;
                delIndex.push(index);
            }
        }
        if(delIndex.length > 0){
            this.updatePointsNum(pointCloud);
            this.updateFacesNum(pointCloud);
            // this.facesNum = Math.floor(this.facesNum - delIndex.length / 3);
            this.delHistory.push(delIndex);
            this.action = EditAction.DELETE;
        }
        
        pointCloud.geometry.attributes.status.needsUpdate = true;

    }

    clearSelection(pointCloud: THREE.Points){
        const array = pointCloud.geometry.attributes.status.array;
        for(let index = 0; index < array.length; index++){
            if(array[index] === -1){
                (array as any)[index] = 1;
            }
        }
        
        pointCloud.geometry.attributes.status.needsUpdate = true;
    }

    redo(pointCloud: THREE.Points){
        if(this.action != EditAction.DELETE){
            if(this.redoHistory.length > 0){
                const redoIndex = this.redoHistory.pop();
                const array = pointCloud.geometry.attributes.status.array;
                
                if(redoIndex){
                    redoIndex.forEach(index => {
                        (array as any)[index] = -1;
                    })
                    // this.pointsNum = this.pointsNum - redoIndex.length;
                    // this.facesNum = this.facesNum - redoIndex.length / 3;
                }
                pointCloud.geometry.attributes.status.needsUpdate = true; 
                this.deleteSelection(pointCloud);
                this.action = EditAction.REDO;
                return true;
            }
        }
        return false;
    }

    updatePointsNum(pointCloud: THREE.Points){
        var num = 0;
        const array = pointCloud.geometry.attributes.status.array;
        for(let index = 0; index < array.length; index++){
            if(array[index] === 0){
                num++;
            }
        }
        this.pointsNum.value = array.length - num;
    }

    updateFacesNum(pointCloud: THREE.Points){
        var num = 0;
        const array = pointCloud.geometry.attributes.status.array;
        for(let index = 0; index < array.length; index++){
            if(array[index] === 0){
                num++;
            }
        }
        this.facesNum.value = Math.floor((array.length - num) / 3);
    }

    undo(pointCloud: THREE.Points){
        this.action = EditAction.UNDO;
        this.clearSelection(pointCloud);
        if(this.delHistory.length > 0){
            this.action = EditAction.UNDO;
            const delIndex = this.delHistory.pop() as [];
            this.redoHistory.push(delIndex);
            const array = pointCloud.geometry.attributes.status.array;
            if(delIndex){
                delIndex.forEach(index => {
                    (array as any)[index] = 1;
                })
                this.updatePointsNum(pointCloud);
                this.updateFacesNum(pointCloud);
            }
            if(this.pointsNum.value == pointCloud.geometry.attributes.position.array.length / 3){
                this.delHistory.length = 0;
                this.redoHistory.length = 0;
            }
            pointCloud.geometry.attributes.status.needsUpdate = true; 
            return true;
        }
        return false;
    }
}

export { DataEditor, SelectionMode }