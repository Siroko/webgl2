#version 300 es

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;

void main() {

    vec4 p = vec4( position, 1.0 )  * modelMatrix * viewMatrix * projectionMatrix;

    gl_Position =  p;
}
