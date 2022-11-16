precision lowp float;


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
varying float time;


void main(){
    vec4 t1 = texture2D(t,gl_PointCoord);
   vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 col  = vec3(0.);
    vec3 transformed = vec3(vPosition);

   

   vec3 mixA = mix(u_color1,u_color2,coord.x);
   vec3 mixB = mix(u_color2,u_color3,coord.x);

   col += mix(mixA,mixB,smoothstep(transformed.x * 0.1, transformed.x,transformed));
   

    //   vec2 point = gl_PointCoord * 2. - 1.;
    //   float alpha = max(1. - length(point), .75);
    
    //   vec4 texture = texture2D(t, gl_PointCoord);
    //   vec4 color = vec4(u_color1, 1.);
    //   vec4 dist = mix(color, texture, alpha);

//    if(dist.a < 0.01){
//         discard;
//     }else{
//         gl_FragColor = dist;
//         gl_FragColor.r = gl_FragColor.r - cos(u_time * .1) * .5 + (aRandom * .25);
//         gl_FragColor.g = gl_FragColor.g - sin(u_time * .1) * .25 + (aRandom * .25);
//         gl_FragColor.b = gl_FragColor.b + cos(u_time * .1) * .25 + (aRandom * .25);
//         gl_FragColor.a = gl_FragColor.a - .5 - (sin(u_time) * .25);
//     };
    gl_FragColor = vec4(abs(sin(vPosition * 1.2)),1.) * t1;
    

    

     
}