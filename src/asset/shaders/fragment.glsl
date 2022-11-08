
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform float progress;
uniform sampler2D t;

void main(){

    vec4 t1 = vec4(1.,0.2,0.2,1.);
    vec4 t2 = vec4(0.2,0.2,0.6,1.);

    //   vec4 finalTexture = mix(t1,t2,progress);

    
    gl_FragColor = vec4(vUv,1.,1.);
}