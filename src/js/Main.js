/**
 * Created by siroko on 22/09/16.
 */

import View from "./view/View";
import Model from "./model/Model";

export default class Main {

    constructor() {

        this.model = new Model();
        this.view = new View( this.model );
        this.init();
    }

    init() {

        this.addEvents();
        this.view.resize( window.innerWidth, window.innerHeight );

    }

    addEvents() {

        window.addEventListener( 'resize', ( e ) => {
            this.view.resize( window.innerWidth, window.innerHeight );
        } );

    }

}