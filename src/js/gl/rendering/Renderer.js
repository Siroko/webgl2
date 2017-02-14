/**
 * Created by siroko on 04/02/2017.
 *
 * This class will create and manage all the gl states for drawing GLCommands stacks.
 *
 */

'use strict'

import {GL_POINTS_PRIMITIVE}        from '../core/Constants';
import {GL_LINES_PRIMITIVE}         from '../core/Constants';
import {GL_LINE_STRIP_PRIMITIVE}    from '../core/Constants';
import {GL_TRIANGLES_PRIMITIVE}     from '../core/Constants';
import {GL_FLOAT_TYPE}              from '../core/Constants';
import {GL_HALF_FLOAT_TYPE}         from '../core/Constants';

export default class Renderer{

    constructor( opts ){

        this.domElement = document.createElement('canvas');
        this.isWebGL2 = true;
        this.gl = this.domElement.getContext( 'webgl2', { antialias: true } );
        if ( !this.gl ) this.gl = this.domElement.getContext( 'experimental-webgl2', { antialias: true } );
        if ( !this.gl ){
            this.gl = this.domElement.getContext( 'webgl', { antialias: true } );
            console.log('using webgl1 backend');
            this.isWebGL2 = false;
        } else {
            console.log('using webgl2 backend');
        }
        if ( !this.gl ) this.gl = this.domElement.getContext( 'experimental-webgl', { antialias: true } );
        if ( !this.gl ) alert("you don't have webGL available");
        this.setSize( opts.width, opts.height );

    }

    /**
     * Sets the size of the context viewport and the canvas object
     * @param w
     * @param h
     */
    setSize( w, h ){

        this.domElement.width = w;
        this.domElement.height = h;
        this.gl.viewport(0, 0, w, h);

    }

    /**
     * Method that will walk all the stack and will draw each command to the screen or to the provided target.
     * First time each command will be executed, the method will allocate the needed uniforms, VBOs, FBOs etc..
     * @param stack
     * @param target
     */
    render( stack, target = null ){

        let gl = this.gl;

        // Cleaning canvas on black (so fsr)
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        for ( let i = 0; i < stack.children.length; i++ ){

            let cmd = stack.children[i];

            if( !cmd.initialized ){

                let program = this.createProgram( cmd.vs, cmd.fs );
                cmd.program = program;

                for( let prop in cmd.attributes ){
                    let vbo = this.createAttributeArray( prop, cmd.attributes[ prop ].value, cmd.program, cmd.attributes[ prop ].size, cmd.attributes[ prop ].type );
                    cmd.vbos.push( vbo );
                }

                for( let uniformID in cmd.uniforms ){
                    cmd.uniforms[ uniformID ].allocation = gl.getUniformLocation( program, uniformID );
                }

                cmd.initialized = true;
                cmd.GLPrimitive = this.getGLPrimitive( cmd.primitive );

            }

            // Tell it to use our program (pair of shaders)
            gl.useProgram(cmd.program);

            for (let j = 0; j < cmd.vbos.length; j++) {
                // Bind the attribute/buffer set we want.
                gl.bindVertexArray( cmd.vbos[j] );
            }

            for( let uID in cmd.uniforms ){
                gl.uniformMatrix4fv( cmd.uniforms[ uID ].allocation, false, cmd.uniforms[ uID ].value );  // for mat4 or mat4 array
            }

            let primitiveType = cmd.GLPrimitive;
            let offset = cmd.offset || 0;
            let count = cmd.count;
            gl.drawArrays( primitiveType, offset, count );

        }

    }

    /**
     * Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @param gl
     * @param sourceCode
     * @param type
     * @returns {*}
     */
    createShader ( sourceCode, type ){

        let gl = this.gl;
        let shader = gl.createShader( type );

        gl.shaderSource( shader, sourceCode );
        gl.compileShader( shader );

        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            let info = gl.getShaderInfoLog( shader );
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        return shader;

    }

    /**
     * Creates a prograam with given sorce code for frgment and vertex shaders
     * @param vsSource
     * @param fsSource
     */
    createProgram( vsSource, fsSource ){

        let gl = this.gl;
        let program = gl.createProgram();

        let vs = this.createShader( vsSource, gl.VERTEX_SHADER );
        this.gl.attachShader( program, vs  );

        let fs = this.createShader( fsSource, gl.FRAGMENT_SHADER );
        this.gl.attachShader( program, fs );

        gl.linkProgram( program );

        if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
            let info = gl.getProgramInfoLog( program );
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        return program;

    }

    /**
     * This method provides the position attribute location on the GPU
     * to be bound later on before draw the elements
     *
     * @param idAttribute
     * @param data
     * @param program
     * @param size
     * @param type
     * @param normalize
     * @param stride
     * @param offset
     * @returns {*}
     */

    createAttributeArray( idAttribute, data, program, size, type, normalize, stride,  offset ){

        let gl = this.gl;
        let positionAttributeLocation = gl.getAttribLocation( program, idAttribute );

        let buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );

        let vao = gl.createVertexArray();
        gl.bindVertexArray( vao );

        gl.enableVertexAttribArray( positionAttributeLocation );

        let _size = size || 3;                          // components per iteration
        let _type = this.getGLType( type ) || gl.FLOAT; // the data type
        let _normalize = normalize || false;            // normalize the data
        let _stride = stride || 0;                      // 0 = move forward size * sizeof(type) each iteration to get the next position
        let _offset = offset || 0;                      // start at the beginning of the buffer

        gl.vertexAttribPointer( positionAttributeLocation, _size, _type, _normalize, _stride, _offset );

        return vao;

    }

    /**
     * returns a GL type identifier from our internal IDs
     * @param type
     * @returns {*}
     */
    getGLType( type ){

        let gl = this.gl;
        let glType = null;

        switch( type ){
            case GL_FLOAT_TYPE:
                glType = gl.FLOAT;
                break;
            case GL_HALF_FLOAT_TYPE:
                glType = gl.HALF_FLOAT;
                break
        }

        return glType;

    }

    /**
     * returns a GL primitive identifier from our internal IDs
     * @param primitive
     * @returns {*}
     */
    getGLPrimitive( primitive ){

        let gl = this.gl;
        let glPrimitive = null;

        switch( primitive ){
            case GL_POINTS_PRIMITIVE:
                glPrimitive = gl.POINTS;
                break;
            case GL_LINES_PRIMITIVE:
                glPrimitive = gl.LINES;
                break;
            case GL_LINE_STRIP_PRIMITIVE:
                glPrimitive = gl.LINE_STRIP;
                break;
            case GL_TRIANGLES_PRIMITIVE:
                glPrimitive = gl.TRIANGLES;
                break
        }

        return glPrimitive;

    }

}