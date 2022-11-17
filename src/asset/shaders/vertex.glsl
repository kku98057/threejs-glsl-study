varying vec2 vUv;
varying vec3 vPosition;
uniform float u_time;
uniform float progress;
attribute vec3 aRandom;
uniform float u_slide;
uniform float u_morphTargetInfluences[ 3 ];
attribute vec3 morphTarget;
attribute vec3 morphTarget1;
attribute vec3 morphTarget2;
attribute vec3 morphTarget3;

varying float time;


attribute vec3 position1;
attribute vec3 position2;
attribute vec3 position3;
uniform float u_amplitude;
uniform float u_size;


mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}
void main() {

    vUv = uv;
    
    vPosition = position;
    vec3 pos = position;
    float speed = 0.8;
    float time = u_time * (speed * aRandom.x);
    vec3 transformed = vec3(position);
    //          vec3 norm = normal; 

    // float u_size = 5.;
    // u_size += sin(time) *3.;

    

    // if(u_slide == 0.0){
    //         //   transformed += ( u_morphTarget1 - transformed ) * u_amplitude;  
    //         //       norm += ( u_morphTarget1 - norm ) * u_amplitude;
    // }else if(u_slide == 1.0){
    //        transformed.x += sin(aRandom.x * time) * 4.;
    // transformed.y += cos(aRandom.y * time) * 4.;
    // transformed.z += cos(aRandom.z * time) * 4.;

    // }else if(u_slide ==2.0){
    //     // transformed += u_morphTarget3;
    // }
    
    transformed.x += sin(aRandom.x * time) * 0.04;
    transformed.y += cos(aRandom.y * time) * 0.04;
    transformed.z += cos(aRandom.z * time) * 0.04;
    
    //   vec3 first = mix(position2, position3, (sin(time) * 0.001) * u_morphTarget1 + u_morphTarget1);

    // transformed += first;
//     vec3 morphed = vec3( 0.0 );
    
//     morphed += ( morphTarget - position ) * u_morphTargetInfluences[ 0 ];
// 			morphed += ( morphTarget1 - position ) * u_morphTargetInfluences[ 1 ];
// 			morphed += ( morphTarget2 - position ) * u_morphTargetInfluences[ 2 ];
// 			morphed += ( morphTarget3 - position ) * u_morphTargetInfluences[ 3 ];

    
// morphed += position;
    vec4 mvPosition = modelViewMatrix * vec4( transformed , 1.);
    
    gl_PointSize = u_size * (1. / - mvPosition.z);
gl_Position = projectionMatrix *mvPosition;
    
}
