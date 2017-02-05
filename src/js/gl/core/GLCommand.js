/**
 * Created by sirok on 03/02/2017.
 */
'use strict'

import {GL_TRIANGLES_PRIMITIVE} from './Constants';

export default class GLCommand {

    constructor(opts) {

        this.vs = opts.vs;
        this.fs = opts.fs;
        this.uniforms = opts.uniforms;

        this.target = opts.target;
        this.attributes = opts.attributes;
        this.count = opts.count;

        this.primitive = opts.primitive || GL_TRIANGLES_PRIMITIVE;

        this.initialized = false;
        this.program = null;
        this.vbos = [];

    }
}
