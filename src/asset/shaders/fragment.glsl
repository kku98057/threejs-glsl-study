
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform float progress;
uniform float random;
uniform sampler2D t;
uniform vec3 diffuse;
varying vec3 vColor;
uniform float alphaTest;
uniform vec3 color;



void main(){

    

    vec4 t1 = texture2D(t,gl_PointCoord);


      


    
    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( t, gl_PointCoord );

    if ( gl_FragColor.a < alphaTest ) discard;

}