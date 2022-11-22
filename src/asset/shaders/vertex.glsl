
varying vec2 vUv;
varying vec3 vPosition;
uniform float u_time;
// uniform float progress;
attribute vec3 aRandom;


attribute vec3 morphTarget0;
attribute vec3 morphTarget1;
attribute vec3 morphTarget2;
attribute vec3 morphTarget3;
attribute vec3 morphTarget4;
attribute vec3 normal0;
attribute vec3 normal1;
attribute vec3 normal2;
attribute vec3 normal3;
uniform float u_morphTargetInfluences[ 5 ];
uniform float u_size;

varying vec3 v_morphTarget1;



varying float time;


void main() {

    vUv = uv;
    
    vPosition = position;
    vec3 pos = position;
    float speed = 0.4;
    float time = u_time *speed;
    vec3 transformed = vec3(position);

    float size = u_size;

  vec3 v_morphTarget1 = morphTarget1;


    vec3 morphed = vec3( 0.0 , 0.0 , 0.0 ); 
    morphed.x += sin(aRandom.x * time) * 0.02;
    morphed.y += cos(aRandom.y * time) * 0.02;
    morphed.z += cos(aRandom.z * time) * 0.02;
    

    morphed += ( morphTarget0 - vPosition ) * u_morphTargetInfluences[ 0 ];
      
    morphed += ( morphTarget1 - vPosition ) * u_morphTargetInfluences[ 1 ];
    
    morphed += ( morphTarget2 - vPosition ) * u_morphTargetInfluences[ 2 ];
    
    morphed += ( morphTarget3 - vPosition ) * u_morphTargetInfluences[ 3 ];

    morphed += ( morphTarget4 - vPosition ) * u_morphTargetInfluences[ 4 ];

    
    
    
    morphed += vPosition ;
  






    vec4 mvPosition = modelViewMatrix * vec4( morphed , 1.);
    
    gl_PointSize = size * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
     
}
