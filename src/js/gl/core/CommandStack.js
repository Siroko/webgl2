/**
 * Created by siroko on 19/10/16.
 */

'use strict'

export default class Stack {

    constructor(){

        this._children = [];
    }

    add( cmd ){

        this._children.push( cmd );
    }

    remove( cmd ){

        this._children.splice( this._children.findIndex( ({el}) => {
            return el === cmd;
        } ), 1 );
    }

    /**
     * Get the array of children
     * @returns {Array}
     */
    get children(){
        return this._children;
    }

}