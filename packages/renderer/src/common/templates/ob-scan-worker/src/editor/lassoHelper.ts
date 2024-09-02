// @ts-nocheck
import * as THREE from "three";

enum ToolMode{
    LASSO = 0,
    BOX,
    POINT
};

interface UpdateSelectionCallback{
    (points: any, event: any): void
}

class LassoHelper{

    canvas: any

    shape: THREE.Line                     // 鼠标绘制的形状
    points: []                            // 鼠标轨迹点

    update: boolean                       // 是否更新
    dragging: boolean                     // 是否拖动

    startX: number;                       // 鼠标起始 x 坐标
    startY: number;                       // 鼠标起始 y 坐标

    prevX: number;                        // 上一个 x 坐标
 	prevY: number;                        // 上一个 y 坐标

    toolMode: ToolMode                // 鼠标圈选选择模式

    tempVec0: THREE.Vector2
    tempVec1: THREE.Vector2
    tempVec2: THREE.Vector2

    callback: UpdateSelectionCallback

    constructor(canvas: any){
        
        this.canvas = canvas;

        this.points = [];

        this.toolMode = ToolMode.LASSO;

        this.tempVec0 = new THREE.Vector2();
        this.tempVec1 = new THREE.Vector2();
        this.tempVec2 = new THREE.Vector2();

        this.shape = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(this.points), 
            new THREE.LineBasicMaterial({ color: 0xFF0000 })
        );
        this.shape.material.color.set( 0xFF00FF ).convertSRGBToLinear();
        this.shape.renderOrder = 1;
        this.shape.position.z = -.2;
        this.shape.material.depthTest = false;
        this.shape.material.depthWrite = false;
        this.shape.scale.setScalar(1);

    }

    /**
     * 屏幕坐标转换成设备归一化坐标
     * @param x : 鼠标 x 坐标
     * @param y : 鼠标 y 坐标
     * @returns ndc 坐标，范围 [-1, 1]
     */
    screenToNDC(x: number, y: number) : THREE.Vector2{

        const ndcX = (x / this.canvas.clientWidth) * 2 - 1;
        const ndcY = -((y / this.canvas.clientHeight) * 2 - 1);
        
        return new THREE.Vector2(ndcX, ndcY);

    }

    setUpdateSelectionCallback(cb: UpdateSelectionCallback){

        this.callback = cb;

    }

    onPointerDown(e: any){

        this.prevX = e.offsetX;
        this.prevY = e.offsetY;

        const ndc = this.screenToNDC(e.offsetX, e.offsetY);
        this.startX = ndc.x;
        this.startY = ndc.y;

        this.points.length = 0;
        this.dragging = true;

    }

    onPointerUp(e: any){

        this.shape.visible = false;
        this.dragging = false;
        if(this.toolMode == ToolMode.POINT){
            if(e.offsetX && e.offsetY){
                this.points.length = 3;
                this.points[0] = this.screenToNDC(e.offsetX, e.offsetY).x;
                this.points[1] = this.screenToNDC(e.offsetX, e.offsetY).y;
                this.points[2] = 0;
            }
            
        }
        if(this.points.length > 0 && this.callback){
            this.callback(this.points, e);
        }
        this.points.length = 0;

    }

    onPointerMove(e: any){

        // If the left mouse button is not pressed
        if ( ( 1 & e.buttons ) === 0 ) {
            return;
        }

        const ex = e.offsetX;
        const ey = e.offsetY;

        const ndc = this.screenToNDC(ex, ey);
        const nx = ndc.x;
        const ny = ndc.y;

        if ( this.toolMode === ToolMode.BOX ) {
            // set points for the corner of the box
            this.points.length = 3 * 5;

            this.points[ 0 ] = this.startX;
            this.points[ 1 ] = this.startY;
            this.points[ 2 ] = 0;

            this.points[ 3 ] = nx;
            this.points[ 4 ] = this.startY;
            this.points[ 5 ] = 0;

            this.points[ 6 ] = nx;
            this.points[ 7 ] = ny;
            this.points[ 8 ] = 0;

            this.points[ 9 ] = this.startX;
            this.points[ 10 ] = ny;
            this.points[ 11 ] = 0;

            this.points[ 12 ] = this.startX;
            this.points[ 13 ] = this.startY;
            this.points[ 14 ] = 0;

            if ( ex !== this.prevX || ey !== this.prevY ) {
                this.update = true;
            }

            this.prevX = ex;
            this.prevY = ey;
            this.shape.visible = true;
        } else if(this.toolMode == ToolMode.LASSO) {

            // If the mouse hasn't moved a lot since the last point
            if (
                Math.abs( ex - this.prevX ) >= 3 ||
                Math.abs( ey - this.prevY ) >= 3
            ) {

                // Check if the mouse moved in roughly the same direction as the previous point
                // and replace it if so.
                const i = ( this.points.length / 3 ) - 1;
                const i3 = i * 3;
                let doReplace = false;
                if ( this.points.length > 3 ) {
                    // prev segment direction
                    this.tempVec0.set( this.points[ i3 - 3 ], this.points[ i3 - 3 + 1 ] );
                    this.tempVec1.set( this.points[ i3 ], this.points[ i3 + 1 ] );
                    this.tempVec1.sub( this.tempVec0 ).normalize();

                    // this segment direction
                    this.tempVec0.set( this.points[ i3 ], this.points[ i3 + 1 ] );
                    this.tempVec2.set( nx, ny );
                    this.tempVec2.sub( this.tempVec0 ).normalize();

                    const dot = this.tempVec1.dot( this.tempVec2 );
                    doReplace = dot > 0.99;
                }

                if ( doReplace ) {
                    this.points[ i3 ]     = nx;
                    this.points[ i3 + 1 ] = ny;
                } else {
                    this.points.push( nx, ny, 0 );
                }

                this.update = true;
                this.shape.visible = true;

                this.prevX = ex;
                this.prevY = ey;
            }
        }

    }

    toggleToolMode(mode: ToolMode){

        this.toolMode = mode;

    }

    render(fov: number, aspect: number){
        if(this.update){
            switch(this.toolMode){
                case ToolMode.LASSO:
                    {
                        const ogLength = this.points.length;
                        this.points.push(
                            this.points[ 0 ],
                            this.points[ 1 ],
                            this.points[ 2 ]
                        );

                        this.shape.geometry.setAttribute(
                            'position',
                            new THREE.Float32BufferAttribute( this.points, 3, false )
                        );
                        this.points.length = ogLength;
                    }
                    break;
                case ToolMode.BOX:
                    {
                        this.shape.geometry.setAttribute(
                            'position',
                            new THREE.Float32BufferAttribute( this.points, 3, false )
                        );
                    }
                    break;
                default:
                    break;
            }
            const yScale = Math.tan( THREE.MathUtils.DEG2RAD * fov / 2 ) * this.shape.position.z;
	        this.shape.scale.set( - yScale * aspect, - yScale, 1 );
            this.shape.geometry.attributes.position.array.needsUpdate = true;
        }
    }

    dispose(){


    }

}

export { LassoHelper, ToolMode }