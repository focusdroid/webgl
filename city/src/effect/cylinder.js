import * as THREE from 'three'
import { color } from '../config'

export class Cylinder {
  constructor(scene, time) {
    this.scene = scene
    this.time = time
  }
  createCylinder (options) {
    const geometry = new THREE.CylinderGeometry(
      options.radius,
      options.radius,
      options.height,
      32,1,
      options.open
    )
    geometry.translate(0, options.height/ 2, 0)
    // 创建材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color)
        },
        u_height: {
          value: options.height
        },
        u_opacity: {
          value: options.opacity
        },
        u_speed: { // 扩散源扩散速度
          value: options.speed,
        },
        u_time: this.time,
      },
      vertexShader: `
      uniform float u_time;
      uniform float u_height;
      uniform float u_speed;
      varying float u_opacity;
        void main(){
          vec3 v_position = position * mod(u_time / u_speed, 1.0); // 取模
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
    // mesh.position.set(80000,500,0)
    mesh.position.copy(options.position)
    this.scene.add(mesh)

  }
}
