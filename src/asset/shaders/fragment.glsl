precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;
varying vec3 vPosition;
// uniform float progress;

uniform sampler2D t;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;



varying float time;
uniform float u_morphTargetInfluences[ 5 ];
uniform float alphaTest;
varying vec3 v_morphTarget1;



void main(){
    vec4 t1 = texture2D(t,gl_PointCoord);
    vec2 coord = gl_FragCoord.xy/u_resolution;
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    vec3 col  = vec3(0.);
    vec3 transformed = vec3(vPosition);
         float ll = length(xy);

    

   vec3 mixA = mix(u_color1,u_color2,smoothstep(0.1,1., vPosition.y) * alphaTest);
   vec3 mixB = mix(u_color2,u_color3,smoothstep(0.1,1.,vPosition.x) * alphaTest);

   col += mix(mixA,mixB,smoothstep(0.1,1.,vPosition.x) * alphaTest) ;
   col += mix(mixA,mixB,smoothstep(0.1,1.,vPosition.x*vPosition.y) * alphaTest) * u_morphTargetInfluences[ 1 ];
   col += mix(mixA,mixB,smoothstep(0.1,1.,vPosition.x) * alphaTest) * u_morphTargetInfluences[ 2];
   col += mix(mixA,mixB,smoothstep(0.1,1.,vPosition.z) * alphaTest) * u_morphTargetInfluences[ 3 ];
   col += mix(mixA,mixB,smoothstep(0.1,1.,vPosition.x) * alphaTest) * u_morphTargetInfluences[ 4 ];
   
   
  vec4 color = vec4(col,0.5 *alphaTest) * t1;
  // if(color.r == 0. || color.g == 0. || color.b == 0.) discard;
  // if(color.a < 0.1) discard;
    gl_FragColor = color;
   
}