// @ts-nocheck
import * as THREE from 'three';

class SpriteManage{

    constructor() {
    
    }

    generateUniqueColor(index: number): string {
        const forbiddenColors = ["#0000FF", "#FFA500"]; // Blue and Orange in hex
        const colorPalette = [
            "#FF0000", "#00FF00", "#0000FF", // 红、绿、蓝
            "#FF00FF", "#FFFF00", "#00FFFF", // 品红、黄、青
            "#FF4500", "#32CD32", "#FF69B4", // 橙、酸橙绿、粉红
            "#FF6347", "#4169E1", "#F08080", // 鲜红、皇家蓝、淡红
            "#D8BFD8", "#FF8C00", "#48D1CC", // 薰衣草、深橙、中绿
            "#8B008B", "#2E8B57", "#800000", // 深洋红、海绿、深红
            "#808000", "#FF1493", "#00CED1", // 橄榄、深粉、暗青
            "#800080", "#ADFF2F", "#B22222"  // 紫、鲜绿、砖红
        ];

        const validColors = colorPalette.filter(color => !forbiddenColors.includes(color));

        const colorIndex = index % validColors.length;
        return validColors[colorIndex];
    }

    createTextSprite(index: number): THREE.Sprite {
        
        const canvas = document.createElement('canvas');
        
        const context = canvas.getContext('2d');
        console.log("###########", canvas, context);
        // 设置背景颜色
        context.fillStyle = this.generateUniqueColor(index);
        

        context.translate(80, 30);

        // 绘制背景矩形
        const w = index < 9 ? 40 : 50;
        const h = 40;
        context.fillRect(0, 0, w, h); // 背景矩形的大小
        
        context.font = 'Bold 40px Arial';
        context.fillStyle = 'black';
        // 计算文本宽度
        const text = `${index}`;
        const textWidth = context.measureText(text).width;

        // 计算文本居中的位置
        const textX = (w - textWidth) / 2;
        const textY = 35; // 文本垂直居中的位置

        context.fillText(text, textX, textY);
    
        const texture = new THREE.Texture(canvas);
        
        texture.needsUpdate = true;
    
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.05, 0.05, 0.05);
        
        // this.changeCanvasBackgroundColor(canvas, 'red', w, h); // 修改为红色背景
        
        return sprite;
    
    }

    changeCanvasBackgroundColor(canvas, newBackgroundColor, w, h) {
        const context = canvas.getContext('2d');
        context.fillStyle = newBackgroundColor;
        context.fillRect(0, 0, w, h);
    }

}

export { SpriteManage }