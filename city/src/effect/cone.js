/**
 * @author: focusdroid
 * @description:
 * @version:
 * @time：2023-07-13 14:40:47
**/

import * as THREE from 'three'
import { color } from '../config'

export class Cone {
  constructor(scene, top, height) {
    console.log(top, height)
    this.scene = scene
    this.top = top
    this.height = height
    this.createCone({
      color: color.cone,
      radius: 5000,
      height: 1000,
      opacity: 0.6,
      speed: 3.6,
      position: {
        x: 100000,
        y: 1000,
        z:0,
      }
    })
  }
  createCone (options) {
    const geometry = new THREE.ConeGeometry(
      options.radius,10000,4
    )
    // 创建材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color)
        },
        u_height: this.height,
        u_opacity: {
          value: options.opacity
        },
        u_top: this.top,
      },
      vertexShader: `
      uniform float u_top;
      uniform float u_height;
        void main(){
        float f_angle = u_height / 10.0;
        float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
        float new_y = position.y;
        float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);
        
        vec4 v_position = vec4(new_x, new_y, new_z + u_top, 1.0);
        
          gl_Position = projectionMatrix * modelViewMatrix * v_position;
        }
      `,
      fragmentShader: `
      uniform vec3 u_color;
        void main(){
          gl_FragColor = vec4(u_color, 0.6);
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
    mesh.rotateZ(Math.PI)
    this.scene.add(mesh)

  }
}
