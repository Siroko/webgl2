/**
 * Created by sirok on 20/02/2017.
 */
export default class VertexBufferObject {
    constructor( id, size, data, type ){

        this.id = id;
        this.size = size;
        this.data = data;
        this.type = type;

        this.initialized = false;
        this.webglVBO = null;
    };
}