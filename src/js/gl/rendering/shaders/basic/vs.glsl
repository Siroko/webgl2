#version 300 es

uniform mat4 modelMatrix;
uniform mat4 viewProjectionMatrix;

in vec3 position;

void main() {

    vec4 p = modelMatrix * viewProjectionMatrix * vec4( position, 1.0 );

    gl_Position =  p;
}
