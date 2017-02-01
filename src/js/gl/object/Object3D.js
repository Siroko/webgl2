/**
 * Created by siroko on 19/10/16.
 */
'use strict'

import { mat4, vec3 } from 'gl-matrix';

export default class Object3D {

    constructor() {

        this._lookAtMatrix = mat4.create();
        this._translationMatrix = mat4.create();
        this._rotationMatrix = mat4.create();
        this._scaleMatrix = mat4.create();
        this._matrix = mat4.create();

        this._position = vec3.fromValues( 0, 0, 0 );
        this._rotation = vec3.fromValues( 0, 0, 0 );
        this._scale    = vec3.fromValues( 1, 1, 1 );
        this._upVector = vec3.fromValues( 0, 1, 0 );

    }

    /**
     * Set the position vec3
     * @param pos
     */
    set position( pos ) {

        this._position = vec3.fromValues( pos[0], pos[1], pos[2] );
        mat4.identity( this._translationMatrix );
        mat4.fromTranslation( this._translationMatrix, this._position );

        this.updateMatrix();
    }

    /**
     * Set the scale vec3
     * @param scale
     */
    set scale( scale ) {

        this._scale = vec3.fromValues( scale[0], scale[1], scale[2] );
        mat4.identity( this._scaleMatrix );
        mat4.fromScaling( this._scaleMatrix, this._scale );

        this.updateMatrix();
    }

    /**
     * Set rotation vec3
     * @param rot
     */
    set rotation( rot ){

        this._rotation = vec3.fromValues( rot[0], rot[1], rot[2] );

        mat4.identity( this._rotationMatrix );
        mat4.rotate( this._rotationMatrix, this._rotationMatrix, this._rotation[2], [ 0, 0, 1 ] );
        mat4.rotate( this._rotationMatrix, this._rotationMatrix, this._rotation[1], [ 0, 1, 0 ] );
        mat4.rotate( this._rotationMatrix, this._rotationMatrix, this._rotation[0], [ 1, 0, 0 ] );

        this.updateMatrix();
    }

    /**
     * Set Cameratarget vec3
     * @param vec
     */
    set target( vec ){

        this._target = vec3.fromValues( vec[0], vec[1], vec[2] );
        this.updateMatrix();
    }

    /**
     * Getter for the matrix
     * @returns {mat4}
     */
    get matrix(){

        return this._matrix;
    }

    /**
     * Method to update view matrix
     */
    updateMatrix(){

        mat4.identity( this._matrix );
        mat4.multiply( this._matrix, this._translationMatrix, this._rotationMatrix );
    }

    /**
     * MEthod to calculate the lookAt rotation matrix
     * @param target
     */
    lookAt( target ){

        if( target ) this._target = vec3.fromValues( target[0], target[1], target[2] );

        mat4.identity( this._lookAtMatrix );
        // mat4.identity( this._matrix );
        mat4.lookAt( this._lookAtMatrix, this._position, this._target, this._upVector );
        mat4.copy( this._rotationMatrix, this._lookAtMatrix );

        this.updateMatrix();
    }
}