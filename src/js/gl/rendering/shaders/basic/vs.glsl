#version 300 es

uniform mat4 viewMatrix;

in vec4 position;

void main() {

    vec4 p = position * viewMatrix;

    gl_Position =  p;
}
