/**
 * Created by siroko on 19/10/16.
 *
 * This class is a stack of several commands that will be executed sequentiaally
 */

'use strict'

export default class CommandStack {

    constructor(){

        this._children = [];
    }

    /**
     * Add aa command to this Staack
     * @param cmd
     */
    add( cmd ){

        this._children.push( cmd );
    }

    /**
     * Remove a command from the Stack
     * @param cmd
     */
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