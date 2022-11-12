
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
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTime;
uniform float uOpacity;
uniform float uScale;



void main(){
    float speed = 2.8;
              float time = uTime * speed;

              float depth = vPosition.z * 0.1 + 0.8;

              vec3 transformed = vec3(vPosition);
              float gradientDirection = (transformed.x ) * 0.05 + 0.3 ;

              vec3 mixA = mix(uColor1, uColor2, gradientDirection );
              vec3 mixB = mix(uColor2, uColor3, gradientDirection );
              vec3 color = mix(mixA, mixB, step(0.2, gradientDirection));

              float opacity = uOpacity;

              opacity += sin(time) * 0.1;
              opacity *= uScale + (sin(opacity * speed + time) * (1.0 - uScale));
          
              vec4 txt = texture2D( t, gl_PointCoord );
              gl_FragColor = txt * vec4(color, opacity );

    // vec4 t1 = texture2D(t,gl_PointCoord);


      


    
    // gl_FragColor = vec4( color * vColor, 1.0 );
    // gl_FragColor = gl_FragColor * texture2D( t, gl_PointCoord );

    // if ( gl_FragColor.a < alphaTest ) discard;

    // gl_FragColor = vec4(vUv,1.,1.);

}