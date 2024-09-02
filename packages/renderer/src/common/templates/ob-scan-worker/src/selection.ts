import {
    BufferGeometry, Mesh, Color, SRGBColorSpace, WebGLRenderer, Scene, DirectionalLight, AmbientLight, PerspectiveCamera, Vector2, TOUCH, MOUSE, Float32BufferAttribute, MathUtils, Matrix4, Vector3, Ray, Line3, DoubleSide, Group, Line, Int8BufferAttribute, DynamicDrawUsage, Int16BufferAttribute, Int32BufferAttribute, Raycaster
  } from 'three'

  import * as THREE from "three";
  
  import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter';
  import Stats from "stats.js";
  
  import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  import { Util } from './editor/util';

  import {
    MeshBVHVisualizer,
    acceleratedRaycast,
    computeBoundsTree,
    disposeBoundsTree,
    MeshBVH,
    CONTAINED,
    INTERSECTED,
    NOT_INTERSECTED,
    SAH,
    CENTER,
    AVERAGE,
  } from "three-mesh-bvh";
  import { PointsMaterial } from 'three';
  import { Points } from 'three';
  Mesh.prototype.raycast = acceleratedRaycast;
  BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

  import { modelMaterial } from "./shader/materials";
  
  let renderer: any, scene: any, camera: any, light, pointCloud: any, selectionShape: any, rootGroup: any, stats: any, helper: any, controls: any, selectionShapeNeedsUpdate = false, selectionNeedsUpdate = false;
  let mouse = new Vector2();
  const raycaster = new Raycaster();
  // raycaster.firstHitOnly = true;
  let selectionPoints: number[] = [];

  const pointSize = 0.01;
  const currentConfig = {
    toolMode: "lasso",// 
    selectionMode: "intersection",
    liveUpdate: false,
    selectModel: false,
    wireframe: false,
    useBoundsTree: true,
  
    displayHelper: false,
    helperDepth: 10,
    displayParents: false,
  
    strategy: CENTER,
    pointSize: pointSize,
    raycastThreshold: pointSize,
    useBVH: true,
    invertSelected: false
  };
  
  function initRenderContext(canvas: any, scene1: any, renderer1: any, camera1: any, controls1: any) {
  
    renderer = renderer1;
    canvas.appendChild(renderer.domElement);
  
    // scene = new Scene();
    scene = scene1;
    rootGroup = new Group();
    scene.add(rootGroup);

    camera = camera1;
  
    scene.add(camera);
  
    stats = new Stats();
    canvas.appendChild(stats.dom);
  
    controls = controls1;
   
    window.addEventListener(
      "resize",
      () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );
  
    // initSelection();
  }
  
  function startRenderer() {
    renderer.setAnimationLoop(() => {
      if (pointCloud) {
        stats ? stats.update() : 0;
        if (helper) {
          helper.visible = currentConfig.displayHelper;
        }
  
        if (selectionShapeNeedsUpdate) {
          if (currentConfig.toolMode === "lasso") {
            const ogLength = selectionPoints.length;
            selectionPoints.push(
              selectionPoints[0],
              selectionPoints[1],
              selectionPoints[2]
            );
  
            selectionShape.geometry.setAttribute(
              "position",
              new Float32BufferAttribute(selectionPoints, 3, false)
            );
  
            selectionPoints.length = ogLength;
          } else {
            selectionShape.geometry.setAttribute(
              "position",
              new Float32BufferAttribute(selectionPoints, 3, false) 
            );
          }
  
          selectionShape.frustumCulled = false;
          selectionShapeNeedsUpdate = false;
        }
  
        if (selectionNeedsUpdate) {
          selectionNeedsUpdate = false;
  
          
        }
  
        const yScale =
          Math.tan((MathUtils.DEG2RAD * camera.fov) / 2) *
          selectionShape.position.z;
        selectionShape.scale.set(-yScale * camera.aspect, -yScale, 1);
      }
  
      renderer.render(scene, camera);
  
    })
  }
  
  function initSelection() {
    selectionShape = new Line();
    selectionShape.material.color.set(0xff9800).convertSRGBToLinear();
    selectionShape.renderOrder = 1;
    selectionShape.position.z = -.2;
    selectionShape.depthTest = false;
    selectionShape.scale.setScalar(1);
    camera.add(selectionShape);
  
    let startX = -Infinity;
    let startY = -Infinity;
  
    let prevX = -Infinity;
    let prevY = -Infinity;
  
    const tempVec0 = new Vector2();
    const tempVec1 = new Vector2();
    const tempVec2 = new Vector2();
    renderer.domElement.addEventListener("pointerdown", (e: any) => {
    //   if(controls.enablePan) return
      prevX = e.clientX;
      prevY = e.clientY;
      startX = (e.clientX / window.innerWidth) * 2 - 1;
      startY = -((e.clientY / window.innerHeight) * 2 - 1);
      selectionPoints.length = 0;
    });
  
  
    renderer.domElement.addEventListener("pointerup", (event: any) => {
    //   if(controls.enablePan) return
      if (currentConfig.toolMode === "pointSelect" && event.button === 0) {
  
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // camera.updateProjectionMatrix();
        (raycaster.params.Points as any).threshold = currentConfig.raycastThreshold / 3;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(pointCloud, true);
        if (Array.isArray(intersects) && intersects.length > 0) {
          const hit = intersects[0];
          if (hit) {
            if (currentConfig.invertSelected) {
              if (pointCloud.geometry.attributes.status.array[hit.index as number] === -1) {
                pointCloud.geometry.attributes.status.array[hit.index as number] = 1;
              } 
            } else {
              pointCloud.geometry.attributes.status.array[hit.index as number] = pointCloud.geometry.attributes.status.array[hit.index as number] === 0 ? 0 : -1;
            }
            pointCloud.geometry.attributes.status.needsUpdate = true;
          }
        }
      }
  
      selectionShape.visible = false;
      if (selectionPoints.length) {
        selectionNeedsUpdate = true;
      }
      if (selectionPoints.length > 0) {
        // updateSelection();
      }
    });
  
    renderer.domElement.addEventListener("pointermove", (e: any) => {
    //   if(controls.enablePan) return
      // 判断是否鼠标左键
      if ((1 & e.buttons) === 0) {
        return;
      }
  
      const ex = e.clientX;
      const ey = e.clientY;
  
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
  
      if (currentConfig.toolMode === "box") {
        // set points for the corner of the box
        selectionPoints.length = 3 * 5;
  
        selectionPoints[0] = startX;
        selectionPoints[1] = startY;
        selectionPoints[2] = 0;
  
        selectionPoints[3] = nx;
        selectionPoints[4] = startY;
        selectionPoints[5] = 0;
  
        selectionPoints[6] = nx;
        selectionPoints[7] = ny;
        selectionPoints[8] = 0;
  
        selectionPoints[9] = startX;
        selectionPoints[10] = ny;
        selectionPoints[11] = 0;
  
        selectionPoints[12] = startX;
        selectionPoints[13] = startY;
        selectionPoints[14] = 0;
  
        if (ex !== prevX || ey !== prevY) {
          selectionShapeNeedsUpdate = true;
        }
  
        prevX = ex;
        prevY = ey;
        selectionShape.visible = true;
        if (currentConfig.liveUpdate) {
          selectionNeedsUpdate = true;
        }
      } else if (currentConfig.toolMode === "lasso") {
        // If the mouse hasn't moved a lot since the last point
        if (Math.abs(ex - prevX) >= 3 || Math.abs(ey - prevY) >= 3) {
          // Check if the mouse moved in roughly the same direction as the previous point
          // and replace it if so.
          const i = selectionPoints.length / 3 - 1;
          const i3 = i * 3;
          let doReplace = false;
          if (selectionPoints.length > 3) {
            // prev segment direction
            tempVec0.set(selectionPoints[i3 - 3], selectionPoints[i3 - 3 + 1]);
            tempVec1.set(selectionPoints[i3], selectionPoints[i3 + 1]);
            tempVec1.sub(tempVec0).normalize();
  
            // this segment direction
            tempVec0.set(selectionPoints[i3], selectionPoints[i3 + 1]);
            tempVec2.set(nx, ny);
            tempVec2.sub(tempVec0).normalize();
  
            const dot = tempVec1.dot(tempVec2);
            doReplace = dot > 0.99;
          }
  
          if (doReplace) {
            selectionPoints[i3] = nx;
            selectionPoints[i3 + 1] = ny;
          } else {
            selectionPoints.push(nx, ny, 0);
          }
  
          selectionShapeNeedsUpdate = true;
          selectionShape.visible = true;
  
          prevX = ex;
          prevY = ey;
  
          if (currentConfig.liveUpdate) {
            selectionNeedsUpdate = true;
          }
        }
      }
    });
  }
  
  const invWorldMatrix = new Matrix4();
  const camLocalPosition = new Vector3();
  const tempRay = new Ray();
  const centroid = new Vector3();
  const screenCentroid = new Vector3();
  const faceNormal = new Vector3();
  const toScreenSpaceMatrix = new Matrix4();
  const boxPoints = Array.from({length: 8}, () => new THREE.Vector3());
  const boxLines = Array.from({ length: 8}, () => new THREE.Line3())
  const lassoSegments: any[] = [];
  const perBoundsSegments: any[] = [];
  
  function updateSelection(points: any) {
    // TODO: Possible improvements
    // - Correctly handle the camera near clip
    // - Improve line line intersect performance?
    
    selectionPoints = points;
    toScreenSpaceMatrix
      .copy(pointCloud.matrixWorld)
      .premultiply(camera.matrixWorldInverse)
      .premultiply(camera.projectionMatrix);
  
    // create scratch points and lines to use for selection
    while (lassoSegments.length < selectionPoints.length) {
      lassoSegments.push(new Line3());
    }
  
    lassoSegments.length = selectionPoints.length;
  
    for (let s = 0, l = selectionPoints.length; s < l; s += 3) {
      const line = lassoSegments[s];
      const sNext = (s + 3) % l;
      line.start.x = selectionPoints[s];
      line.start.y = selectionPoints[s + 1];
  
      line.end.x = selectionPoints[sNext];
      line.end.y = selectionPoints[sNext + 1];
    }
  
    invWorldMatrix.copy(pointCloud.matrixWorld).invert();
    camLocalPosition
      .set(0, 0, 0)
      .applyMatrix4(camera.matrixWorld)
      .applyMatrix4(invWorldMatrix);
  
    const startTime = window.performance.now();
    const indices: number[] = [];
    pointCloud.geometry.boundsTree.shapecast({
      intersectsBounds: (box: any, isLeaf: any, score: any, depth: any) => {
        // check if bounds intersect or contain the lasso region
        if (!currentConfig.useBoundsTree) {
          return INTERSECTED;
        }
  
        // Get the bounding box points
        const { min, max } = box;
        let index = 0;
  
        let minY = Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        // 根据盒子模型，计算每个顶点对应的极值
        for (let x = 0; x <= 1; x++) {
          for (let y = 0; y <= 1; y++) {
            for (let z = 0; z <= 1; z++) {
              const v = boxPoints[index];
              v.x = x === 0 ? min.x : max.x;
              v.y = y === 0 ? min.y : max.y;
              v.z = z === 0 ? min.z : max.z;
              (v as any).w = 1;
              v.applyMatrix4(toScreenSpaceMatrix);
              index++;
  
              if (v.y < minY) minY = v.y;
              if (v.y > maxY) maxY = v.y;
              if (v.x < minX) minX = v.x;
            }
          }
        }
  
        // Find all the relevant segments here and cache them in the above array for
        // subsequent child checks to use.
        const parentSegments = perBoundsSegments[depth - 1] || lassoSegments;
        const segmentsToCheck = perBoundsSegments[depth] || [];
        segmentsToCheck.length = 0;
        perBoundsSegments[depth] = segmentsToCheck;
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
  
        if (segmentsToCheck.length === 0) {
          return NOT_INTERSECTED;
        }
  
        // Get the screen space hull lines
        // 计算盒子顶点的凸多边形线段
        const hull: any = Util.getConvexHull(boxPoints);
        const lines = hull.map((p: any, i: any) => {
          const nextP = hull[(i + 1) % hull.length];
          const line = boxLines[i];
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
  
      intersectsTriangle: (tri: any, index: any, contained: any, depth: any) => {
        const i3 = index * 3;
        const a = i3 + 0;
        const b = i3 + 1;
        const c = i3 + 2;
  
        // check all the segments if using no bounds tree
        const segmentsToCheck = currentConfig.useBoundsTree
          ? perBoundsSegments[depth]
          : lassoSegments;
        if (
          currentConfig.selectionMode === "centroid" ||
          currentConfig.selectionMode === "centroid-visible"
        ) {
          // get the center of the triangle
          centroid
            .copy(tri.a)
            .add(tri.b)
            .add(tri.c)
            .multiplyScalar(1 / 3);
          screenCentroid.copy(centroid).applyMatrix4(toScreenSpaceMatrix);
  
          // counting the crossings
          if (
            contained ||
            Util.pointRayCrossesSegments(screenCentroid, segmentsToCheck) % 2 === 1
          ) {
            // if we're only selecting visible faces then perform a ray check to ensure the centroid
            // is visible.
            if (currentConfig.selectionMode === "centroid-visible") {
              tri.getNormal(faceNormal);
              tempRay.origin.copy(centroid).addScaledVector(faceNormal, 1e-6);
              tempRay.direction.subVectors(camLocalPosition, centroid);
  
              const res = pointCloud.geometry.boundsTree.raycastFirst(
                tempRay,
                DoubleSide
              );
              if (res) {
                return false;
              }
            }
  
            indices.push(a, b, c);
            return currentConfig.selectModel;
          }
        } else if (currentConfig.selectionMode === "intersection") {
          // if the parent bounds were marked as contained then we contain all the triangles within
          if (contained) {
            indices.push(a, b, c);
            return currentConfig.selectModel;
          }
  
          // get the projected vertices
          const vertices = [tri.a, tri.b, tri.c];
  
          // check if any of the vertices are inside the selection and if so then the triangle is selected
          for (let j = 0; j < 3; j++) {
            const v = vertices[j];
            v.applyMatrix4(toScreenSpaceMatrix);
  
            const crossings = Util.pointRayCrossesSegments(v, segmentsToCheck);
            if (crossings % 2 === 1) {
              indices.push(a, b, c);
              return currentConfig.selectModel;
            }
          }
  
          // get the lines for the triangle
          const lines = [boxLines[0], boxLines[1], boxLines[2]];
  
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
  
    const indexAttr = pointCloud.geometry.index;
    if (indices.length && currentConfig.selectModel) {
      // if we found indices and we want to select the whole model
      for (let i = 0, l = indexAttr.count; i < l; i++) {
        const i2 = indexAttr.getX(i);
      }
    } else {
      for (let i = 0, l = indices.length; i < l; i++) {
        const i2 = indexAttr.getX(indices[i]);
        if (currentConfig.invertSelected) {
          if (pointCloud.geometry.attributes.status.array[i2] === -1) {
            pointCloud.geometry.attributes.status.array[i2] = 1;
          }
        } else {
          pointCloud.geometry.attributes.status.array[i2] = pointCloud.geometry.attributes.status.array[i2] === 0 ? 0 : -1;
        }
      }
      pointCloud.geometry.attributes.status.needsUpdate = true;
    }
  }

  function add(model: any){
    pointCloud = model;
    rootGroup.add(pointCloud);
  }

  export {
    initSelection,
    initRenderContext,
    startRenderer,
    add,
    updateSelection
  }