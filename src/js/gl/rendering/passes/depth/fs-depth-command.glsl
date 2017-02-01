precision highp float;
                
uniform vec4 color;
                
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vDepth;

               
const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)
                
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
                
const float ShiftRight8 = 1. / 256.;
                
vec4 packDepthToRGBA( const in float v ) {
                
    vec4 r = vec4( fract( v * PackFactors ), v );
    r.yzw -= r.xyz * ShiftRight8; // tidy overflow
    return r * PackUpscale;
                
}

void main() {
                
    float z = gl_FragCoord.z;
    vec4 depth = packDepthToRGBA( z );
    gl_FragColor = depth;
                  
}