/**
 * Created by siroko on 1/22/16.
 */

var gl;
var canvas;

var scale = 1;
var programDrawPositions;

var diffuseTexture;
var normalTexture;
var depthTexture;
var shadowTexture;

var tx = [];
var frameD;
var bufferQuad;
var vao;
var positionAttributeLocation;

function setup(){

    canvas = document.createElement('canvas');
    document.body.appendChild( canvas );

    addEvents();
    setGLContext();
    createPrograms();
    // setTexturesMRT();
   // frameD = webGL_createMRTFramebuffer(tx);
    setQuad();

    render();
}

function setGLContext(){
    console.log('creating context');
    gl = canvas.getContext( 'webgl2', { antialias: true } );
    if ( !gl ) gl = canvas.getContext( 'experimental-webgl2', { antialias: true } );
}

function createShader (gl, sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var shader = gl.createShader( type );
    gl.shaderSource( shader, sourceCode );
    gl.compileShader( shader );

    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        var info = gl.getShaderInfoLog( shader );
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shader;
}

function createPrograms(){

    programDrawPositions = gl.createProgram();

    var vs = createShader( gl, document.getElementById( 'vsSimpleQuad' ).textContent, gl.VERTEX_SHADER );
    gl.attachShader( programDrawPositions, vs  );

    var fs = createShader( gl, document.getElementById( 'fsDrawMRT' ).textContent, gl.FRAGMENT_SHADER );
    gl.attachShader( programDrawPositions, fs );

    gl.linkProgram( programDrawPositions );

    if ( !gl.getProgramParameter( programDrawPositions, gl.LINK_STATUS ) ) {
        var info = gl.getProgramInfoLog( programDrawPositions );
        throw 'Could not compile WebGL program. \n\n' + info;
    }

}

function setQuad(){

    positionAttributeLocation = gl.getAttribLocation(programDrawPositions, "position");

    var vertices = new Float32Array([
        -1, -1, 0,
         1, -1, 0,
        -1,  1, 0,
        -1,  1, 0,
         1, -1, 0,
         1,  1, 0
    ] );

    bufferQuad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferQuad);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(positionAttributeLocation);

    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

}

function setPrimitives( position, color ){

}

function render(){

    requestAnimationFrame( render );

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(programDrawPositions);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function addEvents(){

    window.addEventListener( 'resize', resize );
    resize( null );
}

function resize( e ){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setTexturesMRT(){

    diffuseTexture = createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );
    normalTexture = createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );
    depthTexture = createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );
    shadowTexture = createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );

    tx[0] = diffuseTexture;
    tx[1] = normalTexture;
    tx[2] = depthTexture;
    tx[3] = shadowTexture;

}

function createTexture(textureSize, format, maxFilter, minFilter, type, unBind, data) {

    var texture = gl.createTexture();
    texture.size = textureSize;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, textureSize, textureSize, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, maxFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (unBind) gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

//Function used to create a MRT buffer
function webGL_createMRTFramebuffer( textures ) {

    var frameData = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameData);
    frameData.size = textures[0].size;

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textures[0].size, textures[0].size);

    var attach = [
        gl.COLOR_ATTACHMENT0,
        gl.COLOR_ATTACHMENT1,
        gl.COLOR_ATTACHMENT2,
        gl.COLOR_ATTACHMENT3
    ];

    for(var i = 0; i < textures.length; i++)  gl.framebufferTexture2D(gl.FRAMEBUFFER, attach[i], gl.TEXTURE_2D, textures[i], 0);

    gl.drawBuffers([
        gl.COLOR_ATTACHMENT0, // gl_FragData[0]
        gl.COLOR_ATTACHMENT1, // gl_FragData[1]
        gl.COLOR_ATTACHMENT2, // gl_FragData[2]
        gl.COLOR_ATTACHMENT3  // gl_FragData[3]
    ]);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    return frameData;
}

setup();