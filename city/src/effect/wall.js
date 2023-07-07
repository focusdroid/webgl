import * as THREE from 'three'
import { color } from '../config/index'
export class Wall{
  constructor(scene, time) {
    this.scene = scene
    this.time = time

    this.config = {
      radius: 10000,
      height: 10000,
      open: true,
      color: color.wall,
      opacity: 0.6,
    }
    this.createWall()
  }
  createWall(){
    const geometry = new THREE.CylinderGeometry(
      this.config.radius,
      this.config.radius,
      this.config.height,
      32,1,
      this.config.open
    )
    geometry.translate(0, this.config.height/ 2, 0)
    // 创建材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(this.config.color)
        },
        u_height: {
          value: this.config.height
        },
        u_opacity: {
          value: this.config.opacity
        },
        u_time: this.time,
      },
      vertexShader: `
      uniform float u_time;
      uniform float u_height;
      varying float u_opacity;
        void main(){
          vec3 v_position = position * mod(u_time, 1.0); // 取模
          u_opacity = mix(1.0,0.0,position.y / u_height);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader: `
      uniform vec3 u_color;
      uniform float u_opacity;
        void main(){
          gl_FragColor = vec4(u_color, u_opacity);
        }
      `,
      transparent: true, // 开启透明度
      side: THREE.DoubleSide, // 解决显示一半的问题
      depthTest: false, // 解决被建筑物遮挡
    })
    // 创建几何体
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(80000,500,0)
    this.scene.add(mesh)
  }

}
