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
uniform float alphaTest;




void main(){
    vec4 t1 = texture2D(t,gl_PointCoord);
//    vec2 coord = gl_FragCoord.xy/u_resolution;
     vec2 xy = gl_PointCoord.xy - vec2(0.5);
    vec3 col  = vec3(0.);
    vec3 transformed = vec3(vPosition);

   

   vec3 mixA = mix(u_color1,u_color2,xy.x);
   vec3 mixB = mix(u_color2,u_color3,xy.x);

   col = mix(mixA,mixB,xy.x);
   

      float ll = length(xy);
      gl_FragColor = vec4(  col  * 10.0 , step(ll, 0.5 ) * alphaTest) * t1;

    vec4 colors =  vec4(abs(sin(vPosition * 1.5)),1.) * t1;
    
    gl_FragColor =colors;
    //  gl_FragColor = vec4(vPosition,1.);
    

    

     
}