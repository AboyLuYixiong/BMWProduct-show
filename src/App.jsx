import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import './App.css'

const App = () => {
  let controls;
  const canvasDom = useRef(null)
  // 创建场景
  const scene = new THREE.Scene()

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  )
  camera.position.set(0, 2, 6)

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  const render = () => {
    renderer.render(scene, camera)
    controls && controls.update()
    requestAnimationFrame(render)
  }

  // 轮胎
  let wheels = []
  let carBody, frontCar, hoodCar, glassCar;
  // 创建材质
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0
  })
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0
  })
  const hoodMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0
  })
  const wheelsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.1,
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    transparent: true
  })
  let colors = ["red", "blue", "green", "gray", "orange", "purple"];
  function selectColor(index) {
    bodyMaterial.color.set(colors[index]);
    frontMaterial.color.set(colors[index]);
    hoodMaterial.color.set(colors[index]);
    wheelsMaterial.color.set(colors[index]);
    // glassMaterial.color.set(colors[index]);
  };

  let materials = [
    { name: "磨砂", value: 1 },
    { name: "冰晶", value: 0 },
  ];
  let selectMaterial = (index) => {
    bodyMaterial.clearcoatRoughness = materials[index].value;
    frontMaterial.clearcoatRoughness = materials[index].value;
    hoodMaterial.clearcoatRoughness = materials[index].value;
  };

  useEffect(() => {
    // 把渲染器插入到dom中
    canvasDom.current.appendChild(renderer.domElement)
    // 初始化渲染器，渲染背景
    renderer.setClearColor('#000')
    scene.background = new THREE.Color('#ccc')
    scene.environment = new THREE.Color('#ccc')
    render()

    // 添加网格地面
    const gridHelper = new THREE.PolarGridHelper(10, 10)
    gridHelper.material.opacity = 0.2
    gridHelper.material.transparent = true
    scene.add(gridHelper)

    // 添加控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // 添加汽车模型
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("./draco/")
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load("./model/bmw01.glb", (gltf) => {
      const bmw = gltf.scene
      bmw.traverse((child) => {
        // 判断是否是轮胎
        if (child.isMesh && child.name.includes("轮胎")) {
          child.material = wheelsMaterial
          wheels.push(child)
        }
        // 判断是否是车身
        if (child.isMesh && child.name.includes("Mesh002")) {
          carBody = child
          carBody.material = bodyMaterial
        }
        // 判断是否是前脸
        if (child.isMesh && child.name.includes("前脸")) {
          child.material = frontMaterial
          frontCar = child
        }
        // 判断是否是引擎盖
        if (child.isMesh && child.name.includes("引擎盖_1")) {
          child.material = hoodMaterial
          hoodCar = child
        }
        // 判断是否是挡风玻璃
        if (child.isMesh && child.name.includes("挡风玻璃")) {
          child.material = glassMaterial
          glassCar = child
        }
      })
      scene.add(bmw)
    })

    // 添加灯光
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(0, 0, 10)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0xffffff, 1)
    light2.position.set(0, 0, -10)
    scene.add(light2)
    const light3 = new THREE.DirectionalLight(0xffffff, 1)
    light3.position.set(10, 0, 0)
    scene.add(light3)
    const light4 = new THREE.DirectionalLight(0xffffff, 1)
    light4.position.set(-10, 0, 0)
    scene.add(light4)
    const light5 = new THREE.DirectionalLight(0xffffff, 1)
    light5.position.set(0, 10, 0)
    scene.add(light5)
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
    light6.position.set(5, 10, 0)
    scene.add(light6)
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
    light7.position.set(0, 10, 5)
    scene.add(light7)
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
    light8.position.set(0, 10, -5)
    scene.add(light8)
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
    light9.position.set(-5, 10, 0)
    scene.add(light9)
  }, []);

  return (
    <div className='home'>
      <div className="canvas-container" ref={canvasDom}></div>

      <div className="home-content">
        <div className="home-content-title">
          <h1>汽车展示与选配</h1>
        </div>
        <h2>选择车身颜色</h2>
        <div className="select">
          {
            colors.map((item, index) => {
              return (
                <div className='select-item' key={index} onClick={selectColor.bind(this, index)}>
                  <div className='select-item-color' style={{ backgroundColor: item }}></div>
                </div>
              )
            })
          }
        </div>

        <h2>选择贴膜材质</h2>
        <div className="select">
          {
            materials.map((item, index) => {
              return (
                <div className='select-item' key={index} onClick={selectMaterial.bind(this, index)}>
                  <div className="select-item-text">{item.name}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App
