## 2022-11-08

# GTLF Particle

## 1.GLTF Model 로드

1.  GLTF Texture Model(이하 모델)을 그냥 쓰기에는 용량이 크기때문에 DracoLoader로 인코딩 해준다.
2.  DracoLoader로 인코딩 후 다시 GLTFLoader로 로드시켜준다.

## 2.모델의 Geometry 좌표값 구하기

1. 모델을 구성하는 자식요소중 Mesh만 따로 빼내어 Geometry를 이루고 있는 각각의 Vetex점들의 좌표값을 구해낸다.
2. 좌표들을 구해서 새롭게 생성한 배열에 넣어준다.

```javascript
//좌표는 x,y,z의 세개의 값이 있으므로 3의 배수로 증가시켜준다.
for(let i < 0; i < 좌표의배열.length; i+=3){
 좌표의배열[i] += 좌표의배열[i+1];
 좌표의배열[i] += 좌표의배열[i+2];
 좌표의배열[i] += 좌표의배열[i+3];
}
```

3. 구해온 좌표값들을 Geometry의 attribute로 재정의해준다.

```javascript
this.geo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(좌표배열, 3)
);
```

### 2-1.Shader Material

- 기본적으로 Shader Material이아닌 PointsMaterial을 사용해도 파티클형태의 모델을 생성 할 수 있다. -하지만 파티클 하나하나의 세부적인 조절은 불가능해보이므로 Shader Material을 이용한다.
  -Shader Material이용하기 위해 glsl이라는 고급 그래픽셰이딩 언어를 사용한다.

### 2-2 Point Mesh

1. 만들어놓은 Geometry와 material을 이용하여 mesh를 생성해준다.

```javascript
this.point = new THREE.Points(this.geo, this.material);
this.scene.add(this.point);
```

## 2022-11-09

# 모델의 색상 입히기

## 2022-11-10

# Morph Target

#### 드디어 모델간의 전환효과의 힌트를 얻었으나, 시간이 없는 관계로 제대로 해보지못함

# 2022-11-11

# Morph Target Change

1. 저장해놓은 모델의 좌표값을 geometry의 morphAttribute에 저장한다.

```javascript
this.geo.morphAttribute.position = [];
this.geo.morphAttribute.position[0] = new THREE.Float32BufferAttribute(
  저장한좌표배열,
  3
);
this.geo.morphAttribute.position[1] = new THREE.Float32BufferAttribute(
  저장한좌표배열,
  3
);
```

2. morphTargetInfluences메서드를 이용해서 0~1사이의 값을 변경 시켜주면 우리가 저장해놓은 좌표값으로 움직인다.

```javascript
//아래의 gif코드중 일부
const tl = gsap
  .timeline({
    scrollTrigger: ".section1",
    pin: true,
    scrub: 3,
    end: "+=3000",
  })
  .to(this.mesh.morphTargetInfluences, [0, 1]);

const tl2 = gsap
  .timeline({
    scrollTrigger: ".section2",
    pin: true,
    scrub: 3,
    end: "+=3000",
  })
  .to(this.mesh.morphTargetInfluences, [0, 0]);

// 여기서 카메라 시점까지 변경해준다면 ?
const tl = gsap
  .timeline({
    scrollTrigger: ".section1",
    pin: true,
    scrub: 3,
    end: "+=3000",
  })
  .to(this.camera.position, { x: 5 })
  .to(this.mesh.morphTargetInfluences, [0, 1]);

const tl2 = gsap
  .timeline({
    scrollTrigger: ".section2",
    pin: true,
    scrub: 3,
    end: "+=3000",
  })
  .to(this.camera.position, { x: 0 })
  .to(this.mesh.morphTargetInfluences, [0, 0]);
```

<img width="80%" src="https://user-images.githubusercontent.com/52364652/201297706-5dd08f8c-e71c-4cbf-8888-ab05be5821e8.gif"/>

- gltf로 모델을 로드했을때는 왜 적용이 안되는지 파악중이다.....
