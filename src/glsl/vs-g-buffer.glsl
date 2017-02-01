precision highp float;

attribute vec3 position;
attribute vec3 normal;
                
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;
                   
varying vec3 vNormal;
varying vec3 vWorldPos;
                
void main() {
                
    vec4 p = vec4( position, 1.0 );
    vNormal = vec4( normalMatrix * vec4( normal, 1.0 ) ).rgb;
    vWorldPos = ( modelMatrix * vec4( normalize(position), 0.0 ) ).xyz;
                  
    gl_Position = projectionMatrix * modelViewMatrix * p;
                  
}