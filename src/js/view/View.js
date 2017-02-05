/**
 * Created by siroko on 17/10/16.
 */
'use strict'

import {GL_LINES_PRIMITIVE}         from '../gl/core/Constants';
import {GL_LINE_STRIP_PRIMITIVE}    from '../gl/core/Constants';
import {GL_TRIANGLES_PRIMITIVE}     from '../gl/core/Constants';
import {GL_FLOAT_TYPE}              from '../gl/core/Constants';

import Renderer                     from '../gl/rendering/Renderer';
import Camera                       from '../gl/object/Camera';
import CameraControl                from '../gl/utils/CameraControl';
import CommandStack                 from '../gl/core/CommandStack';
import GLCommand                    from '../gl/core/GLCommand';
import PlaneGeometry                from '../gl/object/primitives/PlaneGeometry';

import vs                           from '../gl/rendering/shaders/basic/vs.glsl';
import fs                           from '../gl/rendering/shaders/basic/fs.glsl';

export default class View {

    constructor( model ) {

        this.model = model;

        this.renderHandler = this.render.bind( this );
        this.setup();
        this.render();

    }

    setup(){

        this.renderer = new Renderer({ width: window.innerWidth, height: window.innerHeight });
        document.getElementById('container').appendChild( this.renderer.domElement );
        this.camera = new Camera( 80, window.innerWidth / window.innerHeight, 0.1, 800 );
        this.cameraControl = new CameraControl( this.camera, [ 0, 0, 0 ] );

        this.stack = new CommandStack();
        this.plane = new PlaneGeometry( 2, 2, 30, 30 );
        this.command = new GLCommand({
            primitive: GL_LINE_STRIP_PRIMITIVE,
            vs: vs,
            fs: fs,
            attributes: {
                'position' : { size: 3, value: this.plane.positions, type: GL_FLOAT_TYPE }
            },
            uniforms: {
                'modelMatrix' : { type: 'm4', value: this.plane.matrix },
                'viewMatrix' : { type: 'm4', value: this.camera.matrix },
                'projectionMatrix' : { type: 'm4', value: this.camera.projectionMatrix },
            },
            count: this.plane.positions.length / 3
        });

        this.stack.add( this.command );

    }

    render(){

        window.requestAnimationFrame( this.renderHandler );

        this.cameraControl.update();
        this.renderer.render( this.stack );

    }

    resize( w, h ){

        // mat4.perspective( this.perspectiveMatrix, this.fov, w / h, this.near, this.far );
    }

}