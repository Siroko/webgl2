precision highp float;

varying vec3 vWorldPos;

void main() {

    gl_FragColor = vec4( vWorldPos, 1.0 );

}