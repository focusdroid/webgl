/**
 * @author: focusdroid
 * @description: 雪花效果
 * @version:
 * @time：2023-07-14 19:19:24
**/
import * as THREE from 'three'
export class Snow{
  constructor(scene) {
    this.scene = scene
    // 范围
    this.range = 1000000;
    // 雪花的个数
    this.count = 600000;
    this.pointList = []
    this.point = {}
    this.init()
  }
  init () {
    // 粒子系统
    // PointCloud Points
    // 材质
    this.material = new THREE.PointsMaterial({
      size: 3000,
      color: '#ffffff',
      map: new THREE.TextureLoader().load('../../src/assets/snow.png'),
      transparent: true,
      opacity: 0.9,
      depthTest: false, // 消除粒子背景
    })
    // 几何对象
    this.geometry = new THREE.BufferGeometry();

    // 添加顶点信息
    const points = []
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range + 100,
        Math.random() * this.range - this.range / 2,
      )
      position.speedX = Math.random() - 0.5
      position.speedY = Math.random() + 0.4
      position.speedZ = Math.random() - 0.5

      this.pointList.push(position)
    }
    this.geometry.setFromPoints(this.pointList)

    this.point = new THREE.Points(this.geometry, this.material)
    // mesh.position.copy(points)
    this.scene.add(this.point)
  }
  animation () {
    // this.scene.remove(this.point)
    this.pointList.forEach(position => {
      position.x -= position.speedX
      position.y -= position.speedY
      position.z -= position.speedZ

      /*if (position.y <= 0) {
        position.y = this.range / 2;
      }*/
      // this.point.geometry.setFromPoints(this.pointList)
      /*this.geometry.setFromPoints(this.pointList)
      this.point = new THREE.Points(this.geometry, this.material)
      this.scene.add(this.point)*/
    })

  }
}
