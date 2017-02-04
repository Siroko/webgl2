/**
 * Created by sirok on 03/02/2017.
 */
'use strict'

export const GL_TRIANGLES   = 'triangles';
export const GL_LINES       = 'lines';
export const GL_POINTS      = 'points';

export default class GLCommand {

    constructor(opts) {

        this.vs = opts.vs;
        this.fs = opts.fs;
        this.uniforms = opts.uniforms;

        this.target = opts.target;
        this.attributes = opts.attributes;
        this.count = opts.count;

        this.primitive = opts.primitive || GL_TRIANGLES;

        this.initialized = false;
        this.program = null;
        this.vbos = [];

    }
}
