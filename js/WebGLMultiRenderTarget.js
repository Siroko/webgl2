/**
 * Created by siroko on 2/18/16.
 */
THREE.WebGLMultiRenderTarget = function( parameters ){

    this.textures = [];

    for (var prop in parameters) {
        var param = parameters[ prop ];
        this.textures.push( {
            "foo" : "value"
        } );
    }
};

