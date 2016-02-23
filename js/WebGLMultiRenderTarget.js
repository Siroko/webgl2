/**
 * Created by siroko on 2/18/16.
 */
THREE.WebGLMultiRenderTarget = function( width, height, options ){

    this.uuid = THREE.Math.generateUUID();

    this.width = width;
    this.height = height;

    this.scissor = new THREE.Vector4( 0, 0, width, height );
    this.scissorTest = false;

    this.viewport = new THREE.Vector4( 0, 0, width, height );

    options = options || {};

    if ( options.minFilter === undefined ) options.minFilter = THREE.LinearFilter;

    this.texture = new THREE.Texture( undefined, undefined, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy );

    this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
    this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;
};

THREE.WebGLMultiRenderTarget.prototype.init = function(){
    console.log( 'init multirender target');
};