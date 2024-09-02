// @ts-nocheck
import * as THREE from 'three';

// import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { PLYLoader } from './PLYLoader'; 
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

import { newModelMaterial } from "../shader/materials";
import { MeshBVH } from 'three-mesh-bvh';

import fs from "fs";

import { OBJLoader2, MtlObjBridge } from 'wwobjloader2';

const modelMap = new Map<string, Model>();

class Model{

    mesh:  THREE.Mesh | THREE.Points
    faces: number
    points: number
    uniforms: any
    fileLength: number

    constructor(mesh: THREE.Mesh | THREE.Points, fileLength: number){
        this.mesh = mesh;
        this.fileLength = fileLength;
        switch(mesh.type){
            case "Points":
                {
                    this.points = this.mesh.geometry.attributes.position.count;
                }
                break;
            case "Mesh":
                {
                    if(this.mesh.geometry.attributes.normal){
                        this.faces = this.mesh.geometry.attributes.normal.array.length / 9;
                    }
                    if(this.mesh.geometry.index){
                        this.faces = this.mesh.geometry.index.array.length / 3;
                    }
                    break;
                }
            default:
                break;
        }

        this.uniforms = this.mesh.material.uniforms;
        if(this.uniforms && this.uniforms.uTexture.value){
            this.uniforms.useTexture.value = true;
            this.uniforms.useTexture.needsUpdate = true;
        }
    }

    toggle(){
        
        if(this.uniforms.uTexture.value){
            this.uniforms.useTexture.value = !this.mesh.material.uniforms.useTexture.value;
            this.uniforms.useTexture.needsUpdate = true;
        }
    }

    resetMaterial(){
        this.setPointSize(5);
        // if(this.mesh.material){
        //     this.mesh.material.uniforms.uTexture.value = null;
        //     this.mesh.material.uniforms.useTexture.value = false;
        // }
    }

    setPointSize(size: number){
        if(this.mesh.material && this.mesh.material.uniforms && this.mesh.material.uniforms.size){
            this.mesh.material.uniforms.size.value = size;
        }
        this.mesh.material.uniforms.size.needsUpdate = true;
    }

    isToggleable(){
        return this.uniforms.uTexture.value != undefined && this.mesh.geometry.attributes.uv != undefined;
    }

    dispose(){
        this.mesh.geometry.dispose();
        if(this.uniforms.uTexture.value){
            this.mesh.material.uniforms.uTexture.value.dispose();
        }
        this.mesh.material.dispose();
    }

}

class ModelLoader{

    constructor(){

    }

    load(path: string){
        return new Promise( async (resolve, reject) => {
            try{

            const fileObj = await fs.statSync(path);
            const fileLength = fileObj.size;

            if(modelMap.get(path)){
                if(fileLength != modelMap.get(path)?.fileLength){
                   modelMap.set(path, null); 
                }else{
                    const model = modelMap.get(path);
                    if(model.uniforms.uTexture && model.uniforms.uTexture.value){
                        model.uniforms.useTexture.value = true;
                        model.uniforms.useTexture.needsUpdate = true;
                    }
                    resolve(modelMap.get(path));
                    console.log("get model from cache", path, modelMap.get(path));
                    return;
                }
            }

            // 获取后缀名
            const postfix = path.split(".").pop()?.toLocaleLowerCase();
            
            const scope = this;

            var loader, texture;
            let forceRenderMesh = false;

            switch(postfix){
                case "stl":
                    loader = new STLLoader();
                    forceRenderMesh = true;
                    break;
                case "ply":
                    loader = new PLYLoader();
                    const texturePath = path.substring(0, path.lastIndexOf(".")) + ".png";
                    if (fs.existsSync(texturePath)) {  
                        console.log('文件存在'); 
                        texture = await this.createTexture(texturePath); 
                    } else {  
                        console.log('文件不存在');  
                    }
                    break;
                case "obj":
                    // loader = new OBJLoader();
                    loader = new OBJLoader2();

                    // Note : 这里只能加载和 obj 同名的png，加载不同名 png 会有异常
                    const pngName = path.substring(0, path.lastIndexOf(".")) + ".png";
                    // Note ：加载由 CreatilyScan 生成的 obj 正常，加载其他 obj 文件，因为 mtl 的原因，存在问题，待解决
                    texture = await this.createTexture(pngName);
                    break;
                default:
                    break;
            }
    
            if(loader){
                loader.load(
                    path,
                    ( result ) => {
                        // console.log("##########", result)
                        var geometry = (result.type == "BufferGeometry" ? result : result.children[0].geometry);
                        const model = scope.createModel(postfix, fileLength, geometry, newModelMaterial(), texture, forceRenderMesh);
                        modelMap.set(path, model);
                        resolve(model);
                        
                    },
                    ( xhr ) => {
                        // console.log("aaaaaaaaa", xhr)
                    }
                );
            }
            }catch(error: any){
                reject(error);
            }  
        });
        
    }

    createTexture(path: string){
        
        // TIPS : 加载相同路径 + 相同名字的纹理，当纹理改变时，后面的加载不会生效，只会使用到第一次加载的纹理，这是因为浏览器会缓存纹理文件
        // 解决办法：给纹理路径添加唯一的后缀，让浏览器认为这是不同的纹理
        // To fix this issue, you can force Three.js to bypass the browser cache when loading a new texture by appending a unique query string to the texture file path. This will trick the browser into thinking it's a new file and force it to load the new texture. You can use a timestamp or a random number as the query string.
        
        const cacheBuster = '?' + Date.now(); // or '?' + Math.random();
        const newPath = path + cacheBuster;

        return new Promise( (resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                newPath,
                ( texture ) => {
                    resolve(texture);
                },
                undefined,
                ( err ) => {
                    resolve(undefined);
                }
            )
        });
        
    }

    createModel(postfix: string, fileLength: number, geometry: THREE.BufferGeometry, material: any, texture?: THREE.Texture, forceRenderMesh: boolean){

        const g = new THREE.BufferGeometry();
        let mesh;
        const attributes = geometry.attributes;
        let isPoints = false;
        if(attributes.position){ g.setAttribute('position', geometry.attributes.position); }
        if(attributes.normal)  { g.setAttribute('normal',   geometry.attributes.normal); }
        if(attributes.uv)      { g.setAttribute('uv',       attributes.uv); }
        if(geometry.index)     { 
            g.setIndex(geometry.index);
        }else if(postfix != "stl" && !attributes.uv){
            switch(postfix){
                case "ply":
                    isPoints = true;
                    // 生成 bvh
                    const indices = [];
                    const verticesLength = geometry.attributes.position.count;
                    for (let i = 0; i < verticesLength; i++) {
                        indices.push(i, i, i);
                    }
                    g.setIndex(indices);
                    if(g.index){
                        g.index.needsUpdate = true;
                    }
                    break;
                case "stl":
                case "obj":
                    isPoints = false;
                    break;
            }
        }
        const status = [];
        const verticesLength = geometry.attributes.position.count;
        for (let i = 0; i < verticesLength; i++) {
            status.push(1);
        }
        // 手动添加 status 属性，且属性值都为1
        g.setAttribute('status', new THREE.Int32BufferAttribute(status, 1).setUsage(THREE.DynamicDrawUsage));
        
        if(isPoints){
            mesh = new THREE.Points(g, material);
        }else{
            mesh = new THREE.Mesh(g, material);
        }

        mesh.matrixAutoUpdate = false;
        
        if(geometry.attributes.position.array.length > 0){
            mesh.geometry.boundsTree = new MeshBVH(mesh.geometry);
        }
        // TIPS : 解决模型旋转消失的问题
        mesh.frustumCulled = false;

        const uniforms = mesh.material.uniforms;

        let box = new THREE.Box3().setFromObject(mesh);
        let center = box.getCenter(new THREE.Vector3());
        let size = box.getSize(new THREE.Vector3());
        let maxAxis = Math.max(size.x, size.y, size.z);
        if(uniforms){
            // uniforms.scale.value = 1.0 / maxAxis;
            // uniforms.scale.needsUpdate = true;
            // uniforms.center.value.copy(center);
            // uniforms.center.value.needsUpdate = true;

            if(texture){
                uniforms.uTexture.value = texture;
                uniforms.uTexture.value.needsUpdate = true;
                mesh.material.needsUpdate = true;
            }
        }
 
        // mesh.rotateX(Math.PI/2);


        const model = new Model(mesh, fileLength);
        return model;

    }

}

export { ModelLoader, Model, modelMap };