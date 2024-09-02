// @ts-nocheck
import * as THREE from 'three';

const frontColor = new THREE.Vector3(0.0, 133.0/255, 196.0/255);
const backColor = new THREE.Vector3(209.0/255, 94.0/255, 0.0);
const specularColor = new THREE.Vector3(174.0/255, 66.0/255, 66.0/255); 
const shininess = 1000.0;

const curFrameMaterial = new THREE.ShaderMaterial({
    uniforms: 
    {
        color: { value: new THREE.Vector3(0, 139.0/255, 41.0/255)},
        size: { value: 1.0 },
        inverseMatOfPose: { value: new THREE.Matrix4() },
        center: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        scale: { value: 1 },
        offsetY: { value: 0 }
    },
    vertexShader: `
        uniform float size;
        uniform vec3 color;
        uniform mat4 inverseMatOfPose;
        uniform vec3 center;
        uniform float scale;
        varying vec3 c;

        void main() {
            c = color;
            vec4 p = vec4( position.x, position.y, position.z, 1.0 );
            // p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale + 0.05, (-p.z - center.z) * scale, 1.0);
            p = vec4(p.x - center.x, -p.y - center.y, -p.z - center.z, 1.0);
            gl_Position = projectionMatrix  * modelViewMatrix * p;
            gl_PointSize = size;
        }
    `,
    fragmentShader: `
        varying vec3 c;

        void main() {
            gl_FragColor = vec4( c, 1.0 );
        }
    `
});

const hisFrameMaterial_none = new THREE.ShaderMaterial({
    uniforms: {
        color: { value: new THREE.Vector3(0.5, 0.5, 0.8) },
        size: { value: 6.0 },
        inverseMatOfPose: { value: new THREE.Matrix4() },
        center: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        scale: { value: 1.0 },
        frontcolor: { value: frontColor },
        backcolor: { value: backColor },
        shininess: { value: shininess },
        specularcolor: { value: specularColor },
        offsetY: { value: 0 }
    },
    vertexShader: 
        // 历史帧点云 - 蓝橙
        `
            uniform float size;
            uniform mat4 inverseMatOfPose;
            uniform vec3 center;
            uniform float scale;

            varying vec3 vnormal;

            attribute vec4 ipos;

            attribute vec3 icolor;
            varying vec3 ocolor;

            void main() {
                // ocolor = vec3(icolor.x / 255.0, icolor.y / 255.0, icolor.z / 255.0);
                // ocolor = vec3(1.0, 0.5, 0.5) * (1.0 - position.w) + vec3(0.5, 1.0, 0.5) * position.w;
                vec4 p = inverseMatOfPose *  vec4( position.x, position.y, position.z, 1.0 );
                // vec4 p = vec4( position.x, position.y, position.z, 1.0 );
                // p = vec4(p.x, -p.y, -p.z , 1.0);
                vec3 n = mat3(inverseMatOfPose )*  vec3( normal.x, normal.y, normal.z);
                // p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale + 0.05, (-p.z - center.z) * scale, 1.0);
                p = vec4(p.x - center.x, -p.y - center.y, -p.z - center.z, 1.0);
                n = vec3(n.x ,  -n.y  ,  -n.z );
                gl_Position =  projectionMatrix * modelViewMatrix * p;
                // gl_Position = projectionMatrix * p;
                gl_PointSize = size;
                vnormal =  mat3(modelViewMatrix) * n;
            }
        `,
    fragmentShader: `
        uniform vec3 frontcolor;
        uniform vec3 backcolor;
        uniform float shininess;
        uniform vec3 specularcolor;
        varying vec3 c;
        varying vec3 vnormal;

        void main() {

            vec3 light_dir = normalize(vec3(0.2, 0.2, 1.0));
            float diffuse = abs(dot(light_dir, vnormal));
            vec3 view_dir = vec3(0.0, 0.0, 1.0);
            vec3 half_dir = normalize(view_dir + light_dir);
            float specular = pow(abs(dot(vnormal, half_dir)), shininess);
            float a = step(0.0, vnormal.z);
            vec3 color = mix(backcolor, frontcolor, a);
            // gl_FragColor = vec4( color * diffuse * 0.1 + specular * specularcolor * 0.1, 1.0 );
            gl_FragColor = vec4( color * diffuse + specular * specularcolor, 1.0 );

        }
    `
});

const hisFrameMaterial_spec = new THREE.ShaderMaterial({
    uniforms: {
        color: { value: new THREE.Vector3(0.5, 0.5, 0.8) },
        size: { value: 6.0 },
        inverseMatOfPose: { value: new THREE.Matrix4() },
        center: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        scale: { value: 1.0 },
        frontcolor: { value: frontColor },
        backcolor: { value: backColor },
        shininess: { value: shininess },
        specularcolor: { value: specularColor },
        offsetY: { value: 0 }
    },
    vertexShader: 
        // 历史帧点云 - 蓝橙
        `
            uniform float size;
            uniform mat4 inverseMatOfPose;
            uniform vec3 center;
            uniform float scale;

            varying vec3 vnormal;

            attribute vec4 ipos;

            attribute vec3 icolor;
            varying vec3 ocolor;

            void main() {
                ocolor = vec3(1.0, 0.5, 0.5) * (1.0 - ipos.w) + vec3(0.5, 1.0, 0.5) * ipos.w;
                vec4 p = inverseMatOfPose *  vec4( ipos.x, ipos.y, ipos.z, 1.0 );
                vec3 n = mat3(inverseMatOfPose )*  vec3( normal.x, normal.y, normal.z);
                //p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale + 0.05, (-p.z - center.z) * scale, 1.0);
                p = vec4(p.x - center.x, -p.y - center.y, -p.z - center.z, 1.0);
                n = vec3(n.x ,  -n.y  ,  -n.z );
                gl_Position = projectionMatrix * modelViewMatrix * p;
                gl_PointSize = size;
                vnormal =  mat3(modelViewMatrix) * n;
            }
        `,
    fragmentShader: `
        uniform vec3 frontcolor;
        uniform vec3 backcolor;
        uniform float shininess;
        uniform vec3 specularcolor;
        varying vec3 ocolor;
        varying vec3 vnormal;

        void main() {

            vec3 light_dir = normalize(vec3(0.2, 0.2, 1.0));
            float diffuse = abs(dot(light_dir, vnormal));
            vec3 view_dir = vec3(0.0, 0.0, 1.0);
            vec3 half_dir = normalize(view_dir + light_dir);
            float specular = pow(abs(dot(vnormal, half_dir)), shininess);
            float a = step(0.0, vnormal.z);
            vec3 color = mix(backcolor, frontcolor, a);
            // gl_FragColor = vec4( color * diffuse * 0.1 + specular * specularcolor * 0.1, 1.0 );
            gl_FragColor = vec4( diffuse * ocolor, 1.0 );

        }
    `
});

const hisFrameMaterial_real = new THREE.ShaderMaterial({
    uniforms: {
        color: { value: new THREE.Vector3(0.5, 0.5, 0.8) },
        size: { value: 6.0 },
        inverseMatOfPose: { value: new THREE.Matrix4() },
        center: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        scale: { value: 1.0 },
        frontcolor: { value: frontColor },
        backcolor: { value: backColor },
        shininess: { value: shininess },
        specularcolor: { value: specularColor },
        offsetY: { value: 0 }
    },
    vertexShader: 
        // 历史帧点云 - 蓝橙
        `
            uniform float size;
            uniform mat4 inverseMatOfPose;
            uniform vec3 center;
            uniform float scale;

            varying vec3 vnormal;

            attribute vec4 ipos;

            attribute vec3 icolor;
            varying vec3 ocolor;

            void main() {
                ocolor = vec3(icolor.x / 255.0, icolor.y / 255.0, icolor.z / 255.0);
                // ocolor = vec3(1.0, 0.5, 0.5) * (1.0 - position.w) + vec3(0.5, 1.0, 0.5) * position.w;
                vec4 p = inverseMatOfPose *  vec4( position.x, position.y, position.z, 1.0 );
                // vec4 p = vec4( position.x, position.y, position.z, 1.0 );
                // p = vec4(p.x, -p.y, -p.z , 1.0);
                vec3 n = mat3(inverseMatOfPose )*  vec3( normal.x, normal.y, normal.z);
                //p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale + 0.05, (-p.z - center.z) * scale, 1.0);
                p = vec4(p.x - center.x, -p.y - center.y, -p.z - center.z, 1.0);
                n = vec3(n.x ,  -n.y  ,  -n.z );
                // gl_Position =  projectionMatrix * modelViewMatrix * p;
                gl_Position = projectionMatrix * modelViewMatrix * p;
                gl_PointSize = size;
                vnormal =  mat3(modelViewMatrix) * n;
            }
        `,
    fragmentShader: `
        uniform vec3 frontcolor;
        uniform vec3 backcolor;
        uniform float shininess;
        uniform vec3 specularcolor;
        varying vec3 ocolor;
        varying vec3 vnormal;

        void main() {

            vec3 light_dir = normalize(vec3(0.2, 0.2, 1.0));
            float diffuse = abs(dot(light_dir, vnormal));
            vec3 view_dir = vec3(0.0, 0.0, 1.0);
            vec3 half_dir = normalize(view_dir + light_dir);
            float specular = pow(abs(dot(vnormal, half_dir)), shininess);
            float a = step(0.0, vnormal.z);
            vec3 color = mix(backcolor, frontcolor, a);
            // gl_FragColor = vec4( color * diffuse * 0.1 + specular * specularcolor * 0.1, 1.0 );
            gl_FragColor = vec4( ocolor, 1.0 );

        }
    `
});

const hisFrameMaterial = new Map<number, THREE.ShaderMaterial>();
hisFrameMaterial.set(0, hisFrameMaterial_none);
hisFrameMaterial.set(1, hisFrameMaterial_spec);
hisFrameMaterial.set(2, hisFrameMaterial_real);

export { curFrameMaterial, hisFrameMaterial };