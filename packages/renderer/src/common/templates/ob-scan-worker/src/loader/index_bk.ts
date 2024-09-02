// @ts-nocheck
import * as THREE from 'three';

import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

class ModelLoader{

    constructor(){

    }

    load(path: string){

        // 获取后缀名
        const postfix = path.split(".").pop()?.toLocaleLowerCase();
        
        switch(postfix){
            case "ply":
                return this.loadPly(path);
            case "obj":
                return this.loadObj(path);
            default:
                break;
        }

    }

    loadPly(path: string){

        return new Promise((resolve, reject) => {
            const loader = new PLYLoader();
        
            loader.load(
                path,
                function(geometry){
                    geometry.computeVertexNormals();
                    
                    const param = {
                        color: 0x0035c4,
                        specular: 0x000000,
                        shininess: 10,
                        side: THREE.DoubleSide,
                        flatShading: true
                    };
        
                    const material = new THREE.MeshPhongMaterial(param);    
                    const mesh = new THREE.Mesh(geometry, material);
        
                    // TIPS: 不同模型自动居中及缩放到合适大小
                    // https://qa.1r1g.com/sf/ask/3658997821/
                    // 1、计算 mesh 包围盒
                    // 2、找到包围盒中心点及大小，然后对其重新缩放，使其最大范围为 1 (缩放)
                    // 3、计算缩放后的 mesh 的包围盒的中心，反向移动到原点          (居中) 
        
                    // 计算包围盒，包围盒中心点位置以及包围盒大小
                    let box = new THREE.Box3().setFromObject(mesh);
                    let center = box.getCenter(new THREE.Vector3());
                    let size = box.getSize(new THREE.Vector3());
                    let maxAxis = Math.max(size.x, size.y, size.z);
                    mesh.scale.multiplyScalar(1 / maxAxis);
                    box.setFromObject(mesh);
                    box.getCenter(center);
                    box.getSize(size);
        
                    // mesh 根据中心点位置反向移动到原点
                    mesh.position.copy(center).multiplyScalar(-1);
                    const group = new THREE.Group();
                    group.position.set(0, 0, 0);
                    group.add(mesh);
                    group.rotateX(Math.PI);
                    resolve(group);
                },
                (xhr) => {
                    
                },
                (error) => {
                    console.log(error)
                }
            )
        });

    }

    loadObj(path: string){

        const dirPath = path.substring(0, path.lastIndexOf("\\") + 1);
        const mtlname = path.substring(path.lastIndexOf("\\") + 1, path.lastIndexOf(".")) + ".mtl";
        
        return new Promise((resolve, reject) => {
            new MTLLoader()
                .setPath(dirPath)
                .setMaterialOptions({ side: THREE.DoubleSide})
                .load(mtlname,
                ( material ) => {
                    material.preload();
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(material);
                    objLoader.load(path,
                        ( obj ) => {
                            // 计算包围盒，包围盒中心点位置以及包围盒大小
                            let box = new THREE.Box3().setFromObject(obj);
                            let center = box.getCenter(new THREE.Vector3());
                            let size = box.getSize(new THREE.Vector3());
                            let maxAxis = Math.max(size.x, size.y, size.z);
                            obj.scale.multiplyScalar(1 / maxAxis);
                            box.setFromObject(obj);
                            box.getCenter(center);
                            box.getSize(size);

                            // mesh 根据中心点位置反向移动到原点
                            obj.position.copy(center).multiplyScalar(-1);
                            const group = new THREE.Group();
                            group.position.set(0, 0, 0);
                            group.add(obj);
                            group.rotateX(Math.PI);
                            resolve(group);
                        },
                        ( xhr ) => {
                            // console.log(xhr)
                        },
                        ( error ) => {
                            console.log("Aaaaaaaaa", error)
                        }
                    );
                }
            )
        });
    }

}

const loader = new ModelLoader();

export { loader as ModelLoader };