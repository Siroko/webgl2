/**
 * Created by siroko on 19/10/16.
 */
'use strict'

import { mat4, vec3 } from 'gl-matrix';

import Object3D from './Object3D';

export default class Camera extends Object3D {

    constructor( fov, aspect, near, far ){

        super();

        this._fov = fov;
        this._aspect = aspect;
        this._near = near;
        this._far = far;

        this._target = vec3.create();
        this._perspectiveMatrix = mat4.create();
        mat4.perspective( this._perspectiveMatrix, this._fov, this._aspect, this._near, this._far );


    }

    /**
     * Getter for the viewMatrix
     * @returns {mat4}
     */
    get projectionMatrix(){

        return this._perspectiveMatrix;
    }

    /**
     * Getter for the inverse viewMatrix
     * @returns {mat4}
     */
    get inverseProjectionMatrix(){

        return mat4.invert([], this._perspectiveMatrix);
    }

}