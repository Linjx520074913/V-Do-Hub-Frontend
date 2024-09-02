// @ts-nocheck
import * as THREE from 'three';

const frontColor = new THREE.Vector3(0.0, 133.0/255, 196.0/255);
const backColor = new THREE.Vector3(209.0/255, 94.0/255, 0.0);
const specularColor = new THREE.Vector3(174.0/255, 66.0/255, 66.0/255); 
const shininess = 30.0;

const lightDir: THREE.Vector3 = (new THREE.Vector3(0.0, 0.0, 1.0)).normalize();
const viewDir: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 1.0);
const halfDir: THREE.Vector3 = lightDir.add(viewDir).normalize();

const markerMaterial = new THREE.ShaderMaterial({
    uniforms: 
    {
        color: { value: new THREE.Vector3(1.0, 0.0, 0.0)},
        size: { value: 1.0 },
        inverseMatOfPose: { value: new THREE.Matrix4() },
        center: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        scale: { value: 1.0 },
        offsetY: { value: 0 },
        factor: { value: 1.0 },
        
    },
    vertexShader: `
        uniform float size;
        uniform vec3 color;
        uniform mat4 inverseMatOfPose;
        uniform vec3 center;
        uniform float scale;
        uniform float factor;
        varying vec3 c;

        attribute vec3 icolor;
        varying vec3 ocolor;

        void main() {
            ocolor = vec3(icolor.x, icolor.y, icolor.z);;
            vec4 p =  inverseMatOfPose *  vec4( position.x, position.y, position.z, 1.0 );
            p = vec4((p.x - center.x) * factor, (-p.y - center.y) * factor, (-p.z - center.z) * factor, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * p;
            gl_PointSize = 2.0;
        }
    `,
    fragmentShader: `
        varying vec3 c;
        varying vec3 ocolor;

        void main() {
            gl_FragColor = vec4( ocolor, 1.0 );
            gl_FragDepth = 0.00001;
        }
    `
});

const curFrameMaterial = new THREE.ShaderMaterial({
    uniforms: 
    {
        color: { value: new THREE.Vector3(0.36, 0.82, 0.65)},
        size: { value: 1.0 },
        inverseMatOfPose: { value: new THREE.Matrix4() },
        center: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        scale: { value: 1.0 },
        offsetY: { value: 0 }
    },
    vertexShader: `
        uniform float size;
        uniform vec3 color;
        uniform mat4 inverseMatOfPose;
        uniform vec3 center;
        uniform float scale;
        varying vec3 c;
        flat varying int isDiscard;

        void main() {
            c = color;
            vec4 p =  vec4( position.x, position.y, position.z, 1.0 );
            isDiscard = 0;
            if(p.x == 0.0 && p.y == 0.0 && p.z == 0.0){
                isDiscard = 1;   
            }
            p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale, (-p.z - center.z) * scale, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * p;
            gl_PointSize = size;
        }
    `,
    fragmentShader: `
        varying vec3 c;
        flat varying int isDiscard;
        void main() {
            if(isDiscard == 1){
                discard;
            }else{
                gl_FragColor = vec4( c, 1.0 );
                gl_FragDepth = 0.001;
            }
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

            flat varying int isDiscard;

            void main() {
                vec4 p = inverseMatOfPose *  vec4( position.x, position.y, position.z, 1.0 );
                isDiscard = 0;
                if(p.x == 0.0 && p.y == 0.0 && p.z == 0.0){
                    isDiscard = 1;   
                }
                vec3 n = mat3(inverseMatOfPose )*  vec3( normal.x, normal.y, normal.z);
                p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale, (-p.z - center.z) * scale, 1.0);
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
        varying vec3 c;
        varying vec3 vnormal;
        flat varying int isDiscard;

        void main() {

            vec3 light_dir = normalize(vec3(0.2, 0.2, 1.0));
            float diffuse = abs(dot(light_dir, vnormal));
            vec3 view_dir = vec3(0.0, 0.0, 1.0);
            vec3 half_dir = normalize(view_dir + light_dir);
            float specular = pow(abs(dot(vnormal, half_dir)), shininess);
            float a = step(0.0, vnormal.z);
            vec3 color = mix(backcolor, frontcolor, a);
            //if(isDiscard == 1){
            //    discard;
            //}else{
                gl_FragColor = vec4(color * diffuse + specular * color *  0.9, 1.0);
            //}
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
                p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale, (-p.z - center.z) * scale, 1.0);
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
                vec4 p = inverseMatOfPose *  vec4( position.x, position.y, position.z, 1.0 );
                vec3 n = mat3(inverseMatOfPose )*  vec3( normal.x, normal.y, normal.z);
                p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale, (-p.z - center.z) * scale, 1.0);
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
            gl_FragColor = vec4( ocolor, 1.0 );

        }
    `
});

const hisFrameMaterial_edit = new THREE.ShaderMaterial({
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

            attribute int status;
            flat varying int vStatus;

            void main() {
                vec4 p = vec4( position.x, position.y, position.z, 1.0 );
                vec3 n = mat3(inverseMatOfPose )*  vec3( normal.x, normal.y, normal.z);
                p = vec4((p.x - center.x) * scale, (-p.y - center.y) * scale, (-p.z - center.z) * scale, 1.0);
                n = vec3(n.x ,  -n.y  ,  -n.z );
                gl_Position = projectionMatrix * modelViewMatrix * p;
                gl_PointSize = size;
                vnormal =  mat3(modelViewMatrix) * n;
                vStatus = status;
            }
        `,
    fragmentShader: `
        uniform vec3 frontcolor;
        uniform vec3 backcolor;
        uniform float shininess;
        uniform vec3 specularcolor;
        varying vec3 c;
        varying vec3 vnormal;

        flat varying int vStatus;
    
        const vec4 redColor = vec4(1.0, 0.0, 0.0, 0.5);
        void main() {

            vec3 light_dir = normalize(vec3(0.0, 0.0, 1.0));
            float diffuse = abs(dot(light_dir, vnormal));
            vec3 view_dir = vec3(0.0, 0.0, 1.0);
            vec3 half_dir = normalize(view_dir + light_dir);
            float specular = pow(abs(dot(vnormal, half_dir)), shininess);
            float a = step(0.0, vnormal.z);
            vec3 color = mix(backcolor, frontcolor, a);
            bool isNegative = vStatus < 0;
            bool isZero = vStatus == 0;

            // 条件判断合并
            if (isNegative) {
                gl_FragColor = redColor;
            } else if (isZero) {
                discard;
            } else {
                gl_FragColor = vec4(color * diffuse + specular * color *  0.9, 1.0);
            }
        }
    `
});
const hisFrameMaterial = new Map<number, THREE.ShaderMaterial>();
hisFrameMaterial.set(0, hisFrameMaterial_none);
hisFrameMaterial.set(1, hisFrameMaterial_spec);
hisFrameMaterial.set(2, hisFrameMaterial_real);
hisFrameMaterial.set(3, hisFrameMaterial_edit);

const modelMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
        color: { value: new THREE.Vector3(0.5, 0.5, 0.8) },
        size: { value: 5.0 },
        frontcolor: { value: frontColor },
        backcolor: { value: backColor },
        shininess: { value: shininess },
        specularcolor: { value: specularColor },
        uTexture: { value: null },
        useTexture: { value: false },
        lightDir: { value: lightDir },
        halfDir: { value: halfDir }
    },
    vertexShader: 
        // 历史帧点云 - 蓝橙
        `
            uniform float size;

            varying vec3 vnormal1;
            attribute vec4 ipos;
            varying vec2 vUv;
            attribute int status;
            flat varying int vStatus;

            void main() {
                vec4 p = vec4( position.x, position.y, position.z, 1.0 );
                vec3 n = vec3( normal.x, normal.y, normal.z);
                gl_Position = projectionMatrix * modelViewMatrix * p;
                gl_PointSize = size;
                vnormal1 =  mat3(modelViewMatrix) * n;
                vUv = uv;
                vStatus = status;
            }
        `,
    fragmentShader: `
        uniform vec3 frontcolor;
        uniform vec3 backcolor;
        uniform float shininess;
        uniform vec3 specularcolor;
        varying vec3 vnormal1;

        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform bool useTexture;

        flat varying int vStatus;

        const vec4 redColor = vec4(1.0, 0.0, 0.0, 0.5);
        
        uniform vec3 lightDir;
        uniform vec3 halfDir;
        void main() {

            vec3 vnormal  = normalize(vnormal1);
            float diffuse = abs(dot(lightDir, vnormal));
            float specular = pow(abs(dot(vnormal, halfDir)), shininess);
            float a = step(0.0, vnormal.z);
            vec3 color = mix(backcolor, frontcolor, a);
         
            vec4 finalColor;
            if (useTexture) {
                finalColor = texture2D(uTexture, vUv);
            } else {
                // 条件判断合并
                if (vStatus < 0) {
                    finalColor = redColor;
                } else if (vStatus == 0) {
                    discard;
                } else {
                    finalColor = vec4(color * diffuse + specular * color *  0.9, 1.0);
                }
                // if(vStatus == 0){
                //     discard;
                // }
                // finalColor = mix(mix(redColor, vec4(0.0), step(0.0, float(vStatus))), vec4(color * diffuse + specular * specularcolor, 1.0), float(vStatus > 0));   
            }
            gl_FragColor = finalColor;
            
        }
    `
});

const newModelMaterial = () => {
    return new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            color: { value: new THREE.Vector3(0.5, 0.5, 0.8) },
            size: { value: 5.0 },
            frontcolor: { value: frontColor },
            backcolor: { value: backColor },
            shininess: { value: shininess },
            specularcolor: { value: specularColor },
            uTexture: { value: null },
            useTexture: { value: false },
            lightDir: { value: lightDir },
            halfDir: { value: halfDir }
        },
        vertexShader: 
            // 历史帧点云 - 蓝橙
            `
                uniform float size;
    
                varying vec3 vnormal1;
                attribute vec4 ipos;
                varying vec2 vUv;
                attribute int status;
                flat varying int vStatus;
    
                void main() {
                    vec4 p = vec4( position.x, position.y, position.z, 1.0 );
                    vec3 n = vec3( normal.x, normal.y, normal.z);
                    gl_Position = projectionMatrix * modelViewMatrix * p;
                    gl_PointSize = size;
                    vnormal1 =  mat3(modelViewMatrix) * n;
                    vUv = uv;
                    vStatus = status;
                }
            `,
        fragmentShader: `
            uniform vec3 frontcolor;
            uniform vec3 backcolor;
            uniform float shininess;
            uniform vec3 specularcolor;
            varying vec3 vnormal1;
    
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform bool useTexture;
    
            flat varying int vStatus;
    
            const vec4 redColor = vec4(1.0, 0.0, 0.0, 0.5);
            
            uniform vec3 lightDir;
            uniform vec3 halfDir;
            void main() {
    
                vec3 vnormal  = normalize(vnormal1);
                float diffuse = abs(dot(lightDir, vnormal));
                float specular = pow(abs(dot(vnormal, halfDir)), shininess);
                float a = step(0.0, vnormal.z);
                vec3 color = mix(backcolor, frontcolor, a);
             
                vec4 finalColor;
                
                // 条件判断合并
                if (vStatus < 0) {
                    finalColor = redColor;
                } else if (vStatus == 0) {
                    discard;
                } else {
                    finalColor = useTexture ? texture2D(uTexture, vUv) : vec4(color * diffuse + specular * color *  0.9, 1.0);
                }
                gl_FragColor = finalColor;
                
            }
        `
    });
}

export { curFrameMaterial, hisFrameMaterial, markerMaterial };
export { modelMaterial, newModelMaterial }