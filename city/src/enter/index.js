import * as THREE from 'three'
import { City } from './city'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

// import {loadFBX} from "../utils";
export const initCity = () => {
  const canvas = document.getElementById('canvas')
  // 创建场景
  const scene = new THREE.Scene()
  // 创建相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000000)
  camera.position.set(100000,50000,1000)
  scene.add(camera)

  // 添加相机控件
  const controls = new OrbitControls(camera, canvas)
  // 是否有惯性
  controls.enableDamping = true
  // 是否可以缩放
  controls.enableZoom = true
  controls.zoomSpeed += 0.5
  // 最近最远距离
  controls.minDistance = 100
  controls.maxDistance = 200000 // 限制最大视角
       
  // 添加灯光
  scene.add(new THREE.AmbientLight(0xadadad))
  // 添加平行光
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(1000,100000,0)
  scene.add(directionLight)

/*  const box = new THREE.BoxGeometry(2,2,2) // 创建图形
  const material = new THREE.MeshLambertMaterial({color: 0xff0000}) // 创建材质 朗伯材质
  scene.add(new THREE.Mesh(box, material)) // 添加到场景*/

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 设置像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 设置场景颜色
  renderer.setClearColor(new THREE.Color(0x000000), 1)

console.log('scene', scene)
  const city = new City(scene, camera)

/*  const fbxLoader = new FBXLoader()
  loadCity()
  function loadCity () {
    fbxLoader.load('/src/model/shanghai.fbx', (obj) => {
      scene.add(obj)
    })
  }*/


  const start = () => {
    city.start()
    controls.update()
    // 渲染操作
    renderer.render(scene,camera)
    requestAnimationFrame(start)
  }
  start()


  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix()
    // 设置像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 渲染操作
    renderer.render(scene,camera)
  })
}
