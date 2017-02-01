/**
 * Created by siroko on 19/10/16.
 */

'use strict'

import {mat4} from 'gl-matrix';

export default class BaseCommand {

    constructor( regl, vs, fs ){

        const BUFFER_SIZE = 2048;

        this.regl = regl;

        this.texture = this.regl.texture( {
            width: BUFFER_SIZE,
            height: BUFFER_SIZE,
            mag: 'linear',
            min: 'linear'
        } );

        this.output = this.regl.framebuffer( {
            width: BUFFER_SIZE,
            height: BUFFER_SIZE,
            color: this.texture
        } );

        this.cmd = this.regl( {

            vert: vs,
            frag: fs,

            attributes: {

                position: {
                    buffer: this.regl.prop('positions'),
                    size: 3
                },

                normal: {
                    buffer: this.regl.prop('normals'),
                    size: 3
                },

                uvs: {
                    buffer: this.regl.prop('uvs'),
                    size: 2
                }

            },

            uniforms: {

                // This defines the color of the triangle to be a dynamic variable
                color: this.regl.prop('color'),
                projectionMatrix: this.regl.prop('perspective'),
                viewMatrix: this.regl.prop('viewMatrix'),
                modelMatrix: this.regl.prop('modelMatrix'),
                normalMatrix: this.regl.prop('normalMatrix'),
                modelViewMatrix: this.regl.prop('modelViewMatrix')

            },

            primitive: 'triangles',

            // This tells regl the number of vertices to draw in this command
            count: this.regl.prop('count'),
            framebuffer: this.output

        } );

    }

    render( camera, stack ){

        this.regl.clear({
            color: [0,0,0,1],
            depth: 1,
            framebuffer : this.output
        });

        let modelViewMatrix = mat4.create();
        let normalMatrix = mat4.create();
        let mvInverse = mat4.create();

        for (var i = 0; i < stack.children.length; i++) {

            var obj = stack.children[ i ];
            mat4.identity(modelViewMatrix);
            mat4.multiply( modelViewMatrix, camera.matrix, obj.matrix );
            mat4.identity(normalMatrix);
            mat4.transpose( normalMatrix, mat4.invert( [], obj.matrix ) );

            this.cmd( {

                positions : obj.positions,
                normals: obj.normals,
                uvs: obj.uvs,
                count: obj.count,
                perspective : camera.projectionMatrix,
                viewMatrix: camera.matrix,
                modelMatrix: obj.matrix,
                modelViewMatrix: modelViewMatrix,
                normalMatrix: normalMatrix

            } );
        }
    }
}