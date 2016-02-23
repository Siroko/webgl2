/**
 * Created by siroko on 1/22/16.
 */

var gl;
var canvas;
var renderer;
var camera;
var cameraOrto;
var scene;
var sceneDeferred;
var cameraControl;

var scale = 1;

var diffuseRT;
var normalRT;
var depthRT;
var shadowRT;

var diffuseTexture;
var normalTexture;
var depthTexture;
var shadowTexture;

var gBufferMRT;
var gBufferRenderTarget;

var tx = [];

var cubeGeom;

var quadGeom;
var quadMesh;

function setup(){

    canvas = document.createElement('canvas');
    document.body.appendChild( canvas );

    addEvents();
    setGLContext();

    renderer = new THREE.WebGLRenderer( {
        canvas: canvas,
        context: gl
    } );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 30 );
    cameraControl = new CameraControl( camera, new THREE.Vector3(0, 0, 0) );

    cameraOrto = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );

    scene = new THREE.Scene();
    sceneDeferred = new THREE.Scene();

    var size = 15;
    var halfSize = size * 0.5;

    for (var i = 0; i < 10; i++) {
        setPrimitives( new THREE.Vector3( Math.random() * size - halfSize , Math.random() * size - halfSize, Math.random() *  size - halfSize ), new THREE.Vector4( Math.random(), Math.random(), Math.random(), 1 ) );
    }

    setQuad();
    setTexturesMRT();
    gBufferMRT = webGL_createMRTFramebuffer( tx );

    gBufferRenderTarget = new THREE.WebGLRenderTarget( 2048, 2048 );
    gBufferRenderTarget.__webglFramebuffer = gBufferMRT;
    gBufferRenderTarget.__webglInit = true;
    gBufferRenderTarget._needsUpdate = false;

    render();
}

function setGLContext(){
    console.log('creating context');
    gl = canvas.getContext( 'webgl2', { antialias: false } );
    if ( !gl ) gl = canvas.getContext( 'experimental-webgl2', { antialias: false } );
}

function setQuad(){

    var material = new THREE.ShaderMaterial( {

        uniforms: {

            uDiffuse    : { type: "t", value: diffuseRT },
            uNormal     : { type: "t", value: normalRT },
            uDepth      : { type: "t", value: depthRT },
            uShadow     : { type: "t", value: shadowRT }

        },

        vertexShader    : document.getElementById( 'vsDeferredShader' ).textContent,
        fragmentShader  : document.getElementById( 'fsDeferredShader' ).textContent,
        side            : THREE.DoubleSide

    } );

    quadGeom = new THREE.PlaneBufferGeometry( 2, 2, 1, 1 );
    quadMesh = new THREE.Mesh( quadGeom, material );

    sceneDeferred.add( quadMesh );
}

function setPrimitives( position, color ){

    var mat = new THREE.ShaderMaterial( {

        uniforms: {

            uColor      : { type: "v4", value: color },
            uNear       : { type: "f", value: camera.near },
            uFar        : { type: "f", value: camera.far }

        },

        vertexShader    : document.getElementById( 'vsGBuffer' ).textContent,
        fragmentShader  : document.getElementById( 'fsGBuffer' ).textContent,
        side            : THREE.DoubleSide

    } );

    cubeGeom = new THREE.BoxGeometry( 5, 5, 5, 1, 1, 1 );

    for ( var i = 0; i < 100; i++ ) {

        var cubeMesh = new THREE.Mesh( cubeGeom, mat );
        cubeMesh.scale.set( Math.random(), Math.random(), Math.random() );
        cubeMesh.position.set( ( position.x + Math.random() * 2 - 1 ), position.y + ( Math.random() * 2 - 1 ), position.z + ( Math.random() * 2 - 1 ) );
        scene.add( cubeMesh );
    }

}

function render(){

    cameraControl.update();
    requestAnimationFrame( render );
    passMRT();
    renderer.render( sceneDeferred, camera );
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

    diffuseTexture = webGL_createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );
    normalTexture = webGL_createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );
    depthTexture = webGL_createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );
    shadowTexture = webGL_createTexture( 2048, gl.RGBA, gl.NEAREST, gl.NEAREST, gl.FLOAT, true );

    tx[0] = diffuseTexture;
    tx[1] = normalTexture;
    tx[2] = depthTexture;
    tx[3] = shadowTexture;

    diffuseRT = new THREE.Texture();
    diffuseRT.__webglTexture = diffuseTexture;
    diffuseRT.__webglInit = true;
    diffuseRT._needsUpdate = false;

    normalRT = new THREE.Texture();
    normalRT.__webglTexture = normalTexture;
    normalRT.__webglInit = true;
    normalRT._needsUpdate = false;

    depthRT = new THREE.Texture();
    depthRT.__webglTexture = depthTexture;
    depthRT.__webglInit = true;
    depthRT._needsUpdate = false;

    shadowRT = new THREE.Texture();
    shadowRT.__webglTexture = shadowTexture;
    shadowRT.__webglInit = true;
    shadowRT._needsUpdate = false;

}

function passMRT(){

    renderer.render( scene, camera, gBufferRenderTarget );
}

function webGL_createTexture(textureSize, format, maxFilter, minFilter, type, unBind, data) {

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