precision highp float;

uniform sampler2D uDiffuse;
uniform sampler2D uDepth;
uniform sampler2D uNormal;
uniform sampler2D uPosition;

varying vec2 vUv;

const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
float unpackRGBAToDepth( const in vec4 v ) {
    return dot( v, UnpackFactors );
}

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

vec4 calculateDOF( vec3 depth ){
    float d = distance( depth.r, 0.6);

    vec4 _output = vec4( 0.0 );
    vec2 delta = vec2( d * 0.003 );
    vec4 sum = vec4( 0. );

    vec2 inc = delta / vec2(1.2, 0.7);

    sum += texture2D( uNormal, ( vUv - inc * 4. ) ) * 0.051;
    sum += texture2D( uNormal, ( vUv - inc * 3. ) ) * 0.0918;
    sum += texture2D( uNormal, ( vUv - inc * 2. ) ) * 0.12245;
    sum += texture2D( uNormal, ( vUv - inc * 1. ) ) * 0.1531;
    sum += texture2D( uNormal, ( vUv + inc * 0. ) ) * 0.1633;
    sum += texture2D( uNormal, ( vUv + inc * 1. ) ) * 0.1531;
    sum += texture2D( uNormal, ( vUv + inc * 2. ) ) * 0.12245;
    sum += texture2D( uNormal, ( vUv + inc * 3. ) ) * 0.0918;
    sum += texture2D( uNormal, ( vUv + inc * 4. ) ) * 0.051;

    _output = sum;

    return _output;
}

void main() {

    vec4 diffuse = texture2D( uDiffuse, vUv );
    vec4 normal = texture2D( uNormal, vUv );
    vec4 depth = texture2D( uDepth, vUv );
    vec4 pos = texture2D( uPosition, vUv );

    vec3 l1 = vec3( 0.5, 1.0, 1.0 );
    vec3 l1Color = vec3( 0.0, 1.0, 0.0 );
    vec3 l2 = vec3( 1.0, 1.0, 1.0 );
    vec3 l2Color = vec3( .0, .0, 1.0 );

    vec4 base = vec4( 1., 1., 1.0, 1.0 );
    // Pretty basic lambertian lighting...
    vec4 addedLights = vec4( vec3(0.0), 1.0 );
    vec3 lightDirection = normalize( pos.rgb - l1 );
    addedLights.rgb += ( clamp( dot( - lightDirection, normal.rgb ), 0.0, 1.0 ) * l1Color ) * vec3( 1.0 );
    lightDirection = normalize( pos.rgb - l2 );
    addedLights.rgb += ( clamp( dot( - lightDirection, normal.rgb ), 0.0, 1.0 ) * l2Color ) * vec3( 1.0 );
    float decay = 1.;

    vec4 unpacked = vec4( vec3( unpackRGBAToDepth( depth ) ), 1.0 );

    vec3 c = addedLights.rgb  * base.rgb;
    vec4 dofValue = calculateDOF( unpacked.rgb );

    gl_FragColor = dofValue;

}
