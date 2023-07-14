import { loadFBX } from '../utils/index'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { SurroundLine } from '../effect/surroundLine'
import { Backgound } from '../effect/backgound'
import {Radar} from '../effect/radar'
import { Wall } from '../effect/wall'
import { Circle } from '../effect/circle'
import { Ball } from '../effect/ball'
import { Cone } from '../effect/cone'
import { Fly } from '../effect/fly'
import {Road} from "../effect/road";
import {Font} from "../effect/font";
export class City{
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.tweenPosition = null
    this.tweenRotation = null
    this.top = {
      value: 0
    }
    this.flag = false
    this.height = {
      value: 5
    }
    this.time = {
      value: 0,
    }
    this.loadCity()
  }
  loadCity () {
    // 加载模型，并且渲染在画布上
    loadFBX('/src/model/shanghai.fbx').then(object => {
      console.log(object)
      object.traverse((child) => {
        if (child.isMesh) {
          new SurroundLine(this.scene, child, this.height, this.time)
        }
      })
      this.initEffect()
    })
  }
  initEffect () { // 初始化天空
    new Backgound(this.scene)
    new Radar(this.scene, this.time)
    new Wall(this.scene, this.time)
    new Circle(this.scene,this.time)
    new Ball(this.scene,this.time)
    new Cone(this.scene,this.top, this.height)
    new Fly(this.scene,this.time)
    new Road(this.scene,this.time)
    new Font(this.scene)
    this.addClick()
  }
  addClick () {
    let flag = true
    document.onmousedown = () => {
      flag = true
      document.onmousemove = () => {
        flag = false
      }
    }
    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event)
      }
      document.onmousemove = null
    }
  }
  clickEvent (event) { // 点击选择物体
/*    document.onclick = (event) => {

    }*/
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    // console.log(x, y)
    // 创建设备坐标(三维)
    const standarVector = new THREE.Vector3(x, y, 0.5)
    // 装化成世界坐标
    const worldVector = standarVector.unproject(this.camera)
    // 序列化
    const ray = worldVector.sub(this.camera.position).normalize()
    // 如何使用点击选中
    // 创建一个射线发射器,用来发射一条射线
    const raycaster = new THREE.Raycaster(this.camera.position, ray)
    // 检测射线碰撞到的物体
    const intersects = raycaster.intersectObjects(this.scene.children, true)
// console.log(intersects)
    let point3D = null
    if (intersects.length) {
      point3D = intersects[0]
      if (point3D) {
        // 开始动画修改观察点
        const proportion = 3
        const time = 1500
        console.log(point3D, point3D.object.name)
        this.tweenPosition = new TWEEN.Tween(this.camera.position).to({
          x: point3D.point.x * proportion,
          y: point3D.point.y * proportion * proportion,
          z: point3D.point.z * proportion,
        }, time).start()
        this.tweenRotation = new TWEEN.Tween(this.camera.rotation).to({
          x: this.camera.rotation.x,
          y: this.camera.rotation.y,
          z: this.camera.rotation.z,
        }, time).start()
      }
    }
  }
  start (delta) {
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update()
      this.tweenRotation.update()
    }
    this.time.value += delta
    this.height.value += 0.4
    if (this.height.value > 160) {
      this.height.value = 5
    }
    if (this.top.value > 15 || this.top.value < 0) {
      this.flag = !this.flag
    }
    this.top.value += this.flag ? -0.8 : 0.8;
  }
}
