/**
 * Created by siroko on 19/10/16.
 */

'use strict'

import BaseCommand from '../BaseCommand';

import vs from './../../../../glsl/vs-g-buffer.glsl';
import fs from './fs-normal-command.glsl';

export default class DepthCommand extends BaseCommand {

    constructor( regl ){
        super( regl, vs, fs );
    }
}