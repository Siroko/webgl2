/**
 * Created by siroko on 19/10/16.
 */
'use strict'

import { mat4, vec3 } from 'gl-matrix';


import Object3D from './Object3D';

export default class Camera extends Object3D {

    constructor( fov, aspect, near, far ){

        super();

        this._fov = fov * Math.PI / 180;
        this._aspect = aspect;
        this._near = near;
        this._far = far;

        this._target = vec3.create();
        this._perspectiveMatrix = mat4.create();
        mat4.perspective( this._perspectiveMatrix, this._fov, this._aspect, this._near, this._far );
        this._viewMatrix = mat4.create();
        this._viewProjectionMatrix = mat4.create();

    }

    updateMatrix(){

        mat4.identity( this._matrix );
        mat4.multiply( this._matrix, this._translationMatrix, this._rotationMatrix );

        mat4.identity( this._viewMatrix );
        mat4.invert( this._viewMatrix, this._matrix );
        mat4.identity( this._viewProjectionMatrix );
        mat4.multiply( this._viewProjectionMatrix, this._perspectiveMatrix, this._viewMatrix );

    }

    /**
     * Getter for the projectionMatrix
     * @returns {mat4}
     */
    get projectionMatrix(){

        return this._perspectiveMatrix;
    }
    set aspect( v ){
        this._aspect = v;
        mat4.perspective( this._perspectiveMatrix, this._fov, this._aspect, this._near, this._far );
    }

    get viewMatrix(){

        return this._viewMatrix;
    }

    get viewProjectionMatrix(){

        return this._viewProjectionMatrix;
    }

    /**
     * MEthod to calculate the lookAt rotation matrix
     * @param target
     */
    lookAt( target ){

        if( target ) this._target = vec3.fromValues( target[0], target[1], target[2] );
        let eye = vec3.create();
        vec3.subtract( eye, this._position, this._target );

        mat4.identity( this._matrix );
        mat4.lookAt( this._matrix, this._position, this._target, this._upVector );

        mat4.identity( this._viewMatrix );
        mat4.copy( this._viewMatrix, this._matrix );
        mat4.identity( this._viewProjectionMatrix );
        mat4.multiply( this._viewProjectionMatrix, this._perspectiveMatrix, this._viewMatrix );

    }

}