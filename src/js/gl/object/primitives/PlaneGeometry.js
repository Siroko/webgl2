/**
 * Created by siroko on 19/10/16.
 */

import Object3D from '../Object3D';

export default class PlaneGeometry extends Object3D {

    constructor( width, height, tWidth, tHeight ){

        super();

        let halfWidth = width * 0.5;
        let halfHeight = height * 0.5;

        let _positions = [];

        for (let yy = 0; yy < tHeight; yy++) {
            for (let xx = 0; xx < tWidth; xx++) {

                let normX = xx / tWidth * 2 - 1;
                let normY = yy / tHeight * 2 - 1;

                let normXplusOne = (xx + 1) / tWidth * 2 -1;
                let normYplusOne = (yy + 1) / tHeight * 2 - 1;

                let a = [
                    normX * halfWidth,
                    normY * halfHeight,
                    0
                ];

                let b = [
                    normXplusOne * halfWidth,
                    normY * halfHeight,
                    0
                ];

                let c = [
                    normX * halfWidth,
                    normYplusOne * halfHeight,
                    0
                ];

                let d = [
                    normXplusOne * halfWidth,
                    normYplusOne * halfHeight,
                    0
                ];

                _positions = _positions.concat( a, b, c, a, c, b, d, c );

            }

        }
        this.count =  _positions.length / 3;
        this.positions = new Float32Array(_positions);

        // this.normals = this.regl.buffer( bg.attributes.normal.array );
        // this.uvs = this.regl.buffer( bg.attributes.uv.array );

    }

}