/**
 * Created by sirok on 20/02/2017.
 */
export default class Texture {
    constructor( w, h, format, type, minFilter, magFilter, wrapS, wrapT, mipmaps ){

        this.width = w;
        this.height = h;
        this.format = format;
        this.type = type;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.mipmaps = mipmaps;

        this.initialized = false;
        this.webglTexture = null;

    };
}