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
var diffuseRT   = getRenderTarget( window.innerWidth * scale, window.innerHeight * scale );
var normalRT    = getRenderTarget( window.innerWidth * scale, window.innerHeight * scale );
var depthRT     = getRenderTarget( window.innerWidth * scale, window.innerHeight * scale );
var shadowRT    = getRenderTarget( window.innerWidth * scale, window.innerHeight * scale );

var cubeGeom;

var quadGeom;
var quadMesh;
var mrt;

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
    render();

    mrt = new THREE.WebGLMultiRenderTarget( {
        "diffuse" : {
            "bla" : "blahblah"
        },
        "normal" : {
            "bla" : "blahblah"
        }
    } );

}

function setGLContext(){
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

            uColor     : { type: "v4", value: color },
            uNear     : { type: "f", value: camera.near },
            uFar     : { type: "f", value: camera.far }

        },

        vertexShader    : document.getElementById( 'vsGBuffer' ).textContent,
        fragmentShader  : document.getElementById( 'fsGBuffer' ).textContent,
        side            : THREE.DoubleSide

    } );

    cubeGeom = new THREE.BoxGeometry( 5, 5, 5, 2, 2, 2 );

    for ( var i = 0; i < 100; i++ ) {

        var cubeMesh = new THREE.Mesh( cubeGeom, mat );
        cubeMesh.scale.set( Math.random(), Math.random(), Math.random() );
        cubeMesh.position.set( ( position.x + Math.random() * 2 - 1 ), position.y + ( Math.random() * 2 - 1 ), position.z + ( Math.random() * 2 - 1 ) );
        scene.add( cubeMesh );
    }

}

function setShaders(){

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

function passMRT(){
    renderer.render( scene, camera, diffuseRT );
}

function getRenderTarget( w, h, linear, depth ){

    var renderTarget = new THREE.WebGLRenderTarget( w, h, {
        wrapS           : THREE.RepeatWrapping,
        wrapT           : THREE.RepeatWrapping,
        minFilter       : linear ? THREE.LinearFilter : THREE.NearestFilter,
        magFilter       : linear ? THREE.LinearFilter : THREE.NearestFilter,
        format          : THREE.RGBAFormat,
        type            : THREE.FloatType,
        stencilBuffer   : false
    } );

    return renderTarget;
}

setup();