import Texture from "./Texture";

import {
    GL_FLOAT_TYPE,
    GL_RGBA_FORMAT,
    GL_LINEAR_FILTER, GL_CLAMP_TO_EDGE_WRAP
} from "../core/Constants";

export default class FrameBufferObject {

    constructor( width, height, texture ){

        this.id = null;

        this.width = width;
        this.height = height;

        this.texture = texture || new Texture( width,  height, GL_RGBA_FORMAT, GL_FLOAT_TYPE, GL_LINEAR_FILTER, GL_LINEAR_FILTER, GL_CLAMP_TO_EDGE_WRAP, GL_CLAMP_TO_EDGE_WRAP, false );

        this.initialized = false;
        this.webglFBO = null;

    };

}