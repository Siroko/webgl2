/**
 * Created by siroko on 20/10/16.
 */

'use strict'

import vs from './vs-composite.glsl';
import fs from './fs-composite.glsl';

export default class CompositeCommand {

    constructor( regl, gBuffer  ) {

        this.regl = regl;

        this.uniforms = gBuffer.uniforms;

        this.drawQuad = this.regl( {
            frag: fs,
            vert: vs,

            // Here we define the vertex attributes for the above shader
            attributes: {
                position: {
                    buffer: new Float32Array( [
                        -1,  1, 0,
                         1,  1, 0,
                        -1, -1, 0,
                         1,  1, 0,
                         1, -1, 0,
                        -1, -1, 0
                    ] ),
                    size: 3
                },
                uv: {
                    buffer: new Float32Array( [
                        0, 0,
                        1, 0,
                        0, 1,
                        1, 0,
                        1, 1,
                        0, 1
                    ] ),
                    size: 2
                }
            },

            uniforms: this.uniforms,

            primitive: 'triangles',
            count: 6
        } );
    }

    render( camera, stack ){
        this.drawQuad();
    }
}