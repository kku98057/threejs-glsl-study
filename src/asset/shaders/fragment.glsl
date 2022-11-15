


uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform float progress;
uniform float random;
uniform sampler2D t;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_opacity;
uniform float aRandom;


void main(){
    vec4 t1 = texture2D(t,gl_PointCoord);
   vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 col  = vec3(0.);
    vec3 transformed = vec3(vPosition);

   

   vec3 mixA = mix(u_color1,u_color2,coord.x);
   vec3 mixB = mix(u_color2,u_color3,coord.x);

   col += mix(mixA,mixB,smoothstep(transformed.x * 0.1, transformed.x,transformed));
   

 
    gl_FragColor = vec4(abs(sin(vPosition * 1.2)),1.) * t1;
     
}