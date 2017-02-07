/**
 * Created by felixmorenomartinez on 16/02/14.
 * Ported to ES6 on 16/10/2016
 */

export default class CameraControl {

    constructor( camera, target ){

        this.camera = camera;
        this.target = target;
        this.displacement = { x : 0, y : 0 };
        this.prevAngles = { x : 0.5, y : 0.01 };
        this.currentAngles = { x : 0.5, y : 0.01 };
        this.finalRadians = { x : 0.5, y : 0.01 };
        this.downPoint = { x : 0, y : 0 };
        this.down = false;
        this.PI = 3.14159265359;
        this.radius = 1;
        this.wheelDelta = 1;
        this.limits = { up : 0.2, down : 0.008 };
        this.mouseX = -1;
        this.mouseY= -1;
        this._mouseX = -1;
        this._mouseY= -1;
        this.onMove = null;

        this.events();

    }

    events(){

        let mouseWheelEvent = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

        document.addEventListener( mouseWheelEvent, this.onMouseWheel.bind( this ) );
        window.addEventListener( 'mousedown', this.onMouseDown.bind( this ) );
        window.addEventListener( 'mouseup', this.onMouseUp.bind( this ) );
        window.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );

        window.addEventListener('touchstart', this.onTouchStart.bind( this ) );
        window.addEventListener('touchend', this.onTouchEnd.bind( this ) );
        window.addEventListener('touchmove', this.onTouchMove.bind( this ) );

    }

    onTouchStart( e ){

        e.preventDefault();
        let ev = { pageX : e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY };
        ev.preventDefault = function(){};
        this.onMouseDown( ev );
        this.touch = true;

    }

    onTouchEnd( e ){

        e.preventDefault();
        let ev = { pageX : e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY };
        ev.preventDefault = function(){};
        this.onMouseUp( ev );
        this.touch = false;

    }

    onTouchMove( e ){

        e.preventDefault();
        let ev = { pageX : e.changedTouches[ 0 ].pageX, pageY: e.changedTouches[0].pageY };
        ev.preventDefault = function(){};
        this.onMouseMove( ev );

    }

    onMouseWheel(e) {

        let delta = e.detail ? e.detail * -120 : e.wheelDelta;
        this.wheelDelta -= delta * 0.001;

        this._mouseX = e.pageX;
        this._mouseY = e.pageY;
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
    }

    onMouseDown(e) {

        e.preventDefault();
        this.down = true;

        this.downPoint.x = e.pageX;
        this.downPoint.y = e.pageY;
    }

    onMouseUp(e) {

        e.preventDefault();
        this.down = false;

        this.prevAngles.x = this.currentAngles.x;
        this.prevAngles.y = this.currentAngles.y;

        this._mouseX = e.pageX;
        this._mouseY = e.pageY;
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
    }

    onMouseMove(e) {

        e.preventDefault();

        if( this.down ) {

            this.displacement.x = ( this.downPoint.x - e.pageX ) / window.innerWidth;
            this.displacement.y = ( this.downPoint.y - e.pageY ) / window.innerHeight;

            this.currentAngles.x = ( this.prevAngles.x + this.displacement.x );
            this.currentAngles.y = ( this.prevAngles.y - this.displacement.y );

            if( Math.abs(this.displacement.x) > 0.001 || Math.abs(this.displacement.x) > 0.001) this.moving = true;

            //Check if outside limits
            if( this.currentAngles.y > this.limits.up ) {
                this.currentAngles.y = this.prevAngles.y = this.limits.up;
                this.downPoint.y = e.pageY;
            }

            if( this.currentAngles.y < this.limits.down ) {
                this.currentAngles.y = this.prevAngles.y = this.limits.down;
                this.downPoint.y = e.pageY;
            }

        } else {
            this._mouseX = e.pageX;
            this._mouseY = e.pageY;
        }

        if( this.onMove) this.onMove();

    }

    update() {

        // Interpolamos los radianes en x y en y
        this.finalRadians.x += ( this.currentAngles.x * this.PI * 2 - this.finalRadians.x ) / 5;
        this.finalRadians.y += ( this.currentAngles.y * this.PI * 2 - this.finalRadians.y ) / 5;

        this.radius += ( this.wheelDelta - this.radius ) / 5;

        this.camera.position = [    this.target[0] + ( Math.sin( this.finalRadians.x ) * Math.cos( this.finalRadians.y ) * this.radius ),
                                    this.target[1] + ( Math.sin( this.finalRadians.y ) * this.radius ),
                                    this.target[2] + ( Math.cos( this.finalRadians.x ) * Math.cos( this.finalRadians.y ) * this.radius ),];

        this.camera.lookAt( this.target );

        this.mouseX += (this._mouseX - this.mouseX) / 10;
        this.mouseY += (this._mouseY - this.mouseY) / 10;


    }

}
