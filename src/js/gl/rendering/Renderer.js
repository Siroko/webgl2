/**
 * Created by sirok on 04/02/2017.
 */
'use strict'

export default class Renderer{

    constructor( opts ){

        this.domElement = document.createElement('canvas');
        this.gl = this.domElement.getContext( 'webgl2', { antialias: true } );
        if ( !this.gl ) this.gl = this.domElement.getContext( 'experimental-webgl2', { antialias: true } );

        this.setSize( opts.width, opts.height );

    }

    setSize( w, h ){

        this.domElement.width = w;
        this.domElement.height = h;
        this.gl.viewport(0, 0, w, h);

    }

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
                    let vbo = this.createAttributeArray( prop, cmd.attributes[ prop ].value, cmd.program, cmd.attributes[ prop ].size );
                    cmd.vbos.push( vbo );
                }

                for( let uniformID in cmd.uniforms ){
                    let uniformAllocation = this.allocateUniform( uniformID, program );
                    cmd.uniforms[uniformID].allocation = uniformAllocation;
                }

                cmd.initialized = true;

            }

            // Tell it to use our program (pair of shaders)
            gl.useProgram(cmd.program);

            for (let j = 0; j < cmd.vbos.length; j++) {
                let vbo = cmd.vbos[j];
                // Bind the attribute/buffer set we want.
                gl.bindVertexArray( vbo );
            }

            for( let uID in cmd.uniforms ){
                let uniform = cmd.uniforms[ uID ];
                gl.uniformMatrix4fv( uniform.allocation, false, uniform.value )  // for mat4 or mat4 array
            }

            let primitiveType = gl.LINE_STRIP;
            let offset = 0;
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

    createAttributeArray( idAttribute, data, program, size, type, normalize, stride,  offset ){

        let gl = this.gl;
        let positionAttributeLocation = gl.getAttribLocation( program, idAttribute );

        let buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );

        let vao = gl.createVertexArray();
        gl.bindVertexArray( vao );

        gl.enableVertexAttribArray( positionAttributeLocation );

        let _size = size || 3;                  // components per iteration
        let _type = type || gl.FLOAT;           // the data type
        let _normalize = normalize || false;    // normalize the data
        let _stride = stride || 0;              // 0 = move forward size * sizeof(type) each iteration to get the next position
        let _offset = offset || 0;              // start at the beginning of the buffer

        gl.vertexAttribPointer( positionAttributeLocation, _size, _type, _normalize, _stride, _offset );

        return vao;

    }

    allocateUniform( uniformId, program ){

        let gl = this.gl;
        let location = gl.getUniformLocation(program, uniformId);
        return location;
    }
}