import THREE from "three";
import { SpriteManage } from "./sprite"

class Tag{

    spriteManage: SpriteManage
    group: THREE.Group

    constructor(scene: THREE.Scene){
        this.spriteManage = new SpriteManage();
        this.group = new THREE.Group();
    }

    add(index: number, position: THREE.Vector3){
        
        const color = this.spriteManage.generateUniqueColor(index);

        const s = 0.003;
        const geometry = new THREE.BoxGeometry(s, s, s);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const box = new THREE.Mesh(geometry, material);
        box.name = '' + index;
        box.position.set(position.x, position.y, position.z - s / 2);

        const sprite = this.spriteManage.createTextSprite(index);
        box.add(sprite);
        
        this.group.add(box);

    }

    delete(index: number){

    }

    update(index: number){

    }

}

export default { Tag }