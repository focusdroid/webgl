/**
 * @author: focusdroid
 * @description:
 * @version:
 * @time：2023-07-13 18:07:52
**/
import * as THREE from 'three'
import { color } from '../config/index'
export class Fly {
  constructor(scene, time) {
    this.scene = scene
    this.time = time
    this.createFly({
    //  起始点
      source: {
        x: 3000,
        y: 0,
        z: 0,
      },
      // 终止点
      target: {
        x: 100000,
        y: 1000,
        z: -240,
      },
      range: 20000,
      height: 60000,
      color: color.fly,
      size: 10,
    })
  }
  createFly (options) {
    // 起始点
    const source = new THREE.Vector3(
      options.source.x,
      options.source.y,
      options.source.z,
    )
    // 终止点
    const target = new THREE.Vector3(
      options.target.x,
      options.target.y,
      options.target.z,
    )
    // 通过起始点和终止点来计算中心位置
    const center = target.clone().lerp(source, 0.5)
    // 设置中心位置的高度
    center.y += options.height
    // 起始点终点距离
    const len = parseInt(source.distanceTo(target))
    // console.log('source', len)
    // 添加贝塞尔曲线运动
    const curce = new THREE.QuadraticBezierCurve3(source, center, target)
    // 获取粒子
    const points = curce.getPoints(len)
    console.log('curce', curce, len)

    const positions = []
    const aPositions = []
    points.forEach((item, index) => {
      positions.push(item.x, item.y, item.z)
      aPositions.push(index)
    })
    // console.log('points', points)
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('a_position', new THREE.Float32BufferAttribute(aPositions, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color)
        },
        u_range: {
          value: options.range
        },
        u_size: {
          value: options.size
        },
        u_total: {
          value: len
        },
        u_time: this.time
      },
      vertexShader: `
      attribute float a_position;
      // attribute float position;
      uniform float u_time;
      uniform float u_size;
      uniform float u_range;
      uniform float u_total;
      
      varying float v_opacity;
        void main(){
          float size = u_size;
          float total_number = u_total * mod(u_time, 1.0);
          if (total_number > a_position && total_number < a_position + u_range) {
          // 实现拖尾效果
          float index = (a_position + u_range - total_number) / u_range;
          size *= index;
           v_opacity = 1.0;
          } else {
            v_opacity = 0.0;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size / 10.0;
        }
      `,
      fragmentShader: `
      uniform vec3 u_color;
      varying float v_opacity;
        void main(){
          gl_FragColor = vec4(u_color, v_opacity);
        }
      `,
      transparent: true
    })

    const point = new THREE.Points(geometry, material)

    this.scene.add(point)
  }
}
