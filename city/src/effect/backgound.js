import * as THREE from 'three'
export class Backgound {
  constructor(scene) {
    this.scene = scene
    this.url = '../../src/assets/white-bg.jpg'
    this.init()
  }
  // 创建天空盒子
  init () {
    // 创建纹理加载器
    const loader = new THREE.TextureLoader()
    const geometry = new THREE.SphereGeometry(5000000, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load(this.url)
    })

    const shpere = new THREE.Mesh(geometry, material)
    shpere.position.copy({
      x: 0,
      y: 0,
      z: 0,
    })
    this.scene.add(shpere)
  }

}
