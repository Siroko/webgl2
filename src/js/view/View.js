/**
 * Created by siroko on 17/10/16.
 */
'use strict'

import Camera           from '../gl/object/Camera';
import CameraControl    from '../gl/utils/CameraControl';
import Stack            from '../gl/core/Stack';
import PlaneGeometry    from '../gl/object/primitives/PlaneGeometry';

export default class View {

    constructor( model ) {

        this.model = model;
        this.setup();
    }

    setup(){

        this.camera = new Camera( 30, window.innerWidth / window.innerHeight, 1, 800 );
        this.cameraControl = new CameraControl( this.camera, [ 0, 1, 0 ] );

        this.stack = new Stack();

        this.createGeometries();

    }

    createGeometries(){

        this.floor = new PlaneGeometry( 30, 100, 2, 2 );
        this.floor.position = [0, -1, 0];
        this.floor.rotation = [Math.PI * 1.5, 0, 0];
        this.stack.add( this.floor );

    }

    resize( w, h ){

        // mat4.perspective( this.perspectiveMatrix, this.fov, w / h, this.near, this.far );
    }

}