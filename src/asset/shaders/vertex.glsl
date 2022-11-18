
varying vec2 vUv;
varying vec3 vPosition;
uniform float u_time;
// uniform float progress;
attribute vec3 aRandom;
uniform float u_slide;

attribute vec3 morphTarget0;
attribute vec3 morphTarget1;
attribute vec3 morphTarget2;
attribute vec3 morphTarget3;
attribute vec3 position0;
attribute vec3 position1;
attribute vec3 position2;
attribute vec3 position3;
uniform float morphTargetInfluences[ 5 ];

varying float time;


// attribute vec3 position1;
// attribute vec3 position2;
// attribute vec3 position3;
// uniform float u_amplitude;
// uniform float u_size;


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
    float speed = 0.4;
    float time = u_time *speed;
    // vec3 transformed = vec3(position);

    
    
    // transformed.x += sin(aRandom.x * time) * 0.02;
    // transformed.y += cos(aRandom.y * time) * 0.02;
    // transformed.z += cos(aRandom.z * time) * 0.02;

    vec3 morphed = vec3( 0.0 , 0.0 , 0.0 ); 
    if(u_slide==0.){
    morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
    }else if(u_slide==1.){
    morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
    }
    else if(u_slide==2.){
    morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
    }
    else if(u_slide==3.){
    morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
    }

    morphed += position;






    vec4 mvPosition = modelViewMatrix * vec4( morphed , 1.);
    
    gl_PointSize = 5. * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
     
}
