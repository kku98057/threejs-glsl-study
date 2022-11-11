varying vec2 vUv;
varying vec3 vPosition;
uniform float time;
attribute float aRandom;
uniform float progress;
attribute vec3 aDiffuse;
varying vec3 vColor;
// attribute vec3 aCenter; 
uniform float particleScale;
uniform float dotScale;

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
    vColor = aDiffuse;
    vec3 pos = position;
    
   float prog = (position.y + 1.)/2.;
        float locprog = clamp((progress-0.8*prog)/0.2,0.,1.);

        
        // locprog = progress;
        // pos = pos - aCenter;

        // pos += 3.*normal * aRandom * locprog;

        // pos *= (1.-locprog);

        // pos += aCenter;

        // pos += rotate(pos,vec3(0.,1.,1.),aRandom * locprog * 3.14 * 1.);
    pos += sin(progress) * normal * sin(aRandom) * 30.;
    

    vec4 mvPosition = modelViewMatrix * vec4( pos , 1.);
    
    gl_PointSize = 30. * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}