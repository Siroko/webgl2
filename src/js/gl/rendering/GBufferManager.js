/**
 * Created by siroko on 19/10/16.
 */
'use strict'

import DepthCommand         from './passes/depth/DepthCommand';
import NormalCommand        from './passes/normal/NormalCommand';
import PositionCommand      from './passes/position/PositionCommand';
import CompositeCommand     from './passes/composite/CompositeCommand';

export default class GBufferManager {

    constructor( regl ){

        this.regl = regl;

        this.depthCommand = new DepthCommand( this.regl );
        this.normalCommand = new NormalCommand( this.regl );
        this.positionCommand = new PositionCommand( this.regl );
        this.compositeCommand = new CompositeCommand( this.regl, {
            uniforms : {
                uDiffuse: this.normalCommand.output,
                uNormal: this.normalCommand.output,
                uDepth: this.depthCommand.output,
                uPosition: this.positionCommand.output,
            }
        } );

    }

    render( camera, stack ){

        this.depthCommand.render( camera, stack );
        this.normalCommand.render( camera, stack );
        this.positionCommand.render( camera, stack );

        this.compositeCommand.render( camera, stack );
    }

}