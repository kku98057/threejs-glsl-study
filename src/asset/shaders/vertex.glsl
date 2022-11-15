varying vec2 vUv;
varying vec3 vPosition;
uniform float u_time;
uniform float progress;
attribute vec3 aRandom;
uniform float u_slide;
uniform float morphTargetInfluences;
attribute vec3 u_morphTarget1;
attribute vec3 u_morphTarget2;
attribute vec3 u_morphTarget3;


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
    vec3 transformed = vec3(position);
    float speed = 0.8;
    float time = u_time * (speed * aRandom.x);

    transformed.x += sin(aRandom.x * time) * 0.04;
    transformed.y += cos(aRandom.y * time) * 0.04;
    transformed.z += cos(aRandom.z * time) * 0.04;
    // if(u_slide == 0.0){
    //     transformed += (u_morphTarget1 - position ) * morphTargetInfluences[0.,0.,0.];
    // }else if(u_slide == 1.0){
    //     transformed += (u_morphTarget2 - position ) * morphTargetInfluences[0.,1.,0.];

    // }else if(u_slide ==2.0){
    //     transformed += u_morphTarget3;
    // }

    
   
 
    

    

    vec4 mvPosition = modelViewMatrix * vec4( transformed , 1.);
    
    gl_PointSize = 15. * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
}
