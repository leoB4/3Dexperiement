import { AxesHelper, Object3D, Vector3 } from 'three'

import AmbientLightSource from './AmbientLight'
import SphereBackground from './SphereBack/SphereBackground'
import SphereCenter from './SphereCenter/SphereCenter'
import Particles from './Particles/Particles'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.click = options.click

    // Set up
    this.container = new Object3D()
    this.container.name = 'World'

    if (this.debug) {
      this.container.add(new AxesHelper(5))
      this.debugFolder = this.debug.addFolder({
        title: 'World',
        expanded: true
      })
    }
    this.setLoader()
    this.setAmbientLight()
    this.setSphereBack()
    this.setSphereCenter()
    this.setParticles()
    this.setParticles2()
    this.setParticles3()
  }
  init() {

  }
  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = this.loadModels.innerHTML = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
        }%`
      })

      this.assets.on('ressourcesReady', () => {
        setTimeout(() => {
          this.init()
          this.loadDiv.style.opacity = 0
          setTimeout(() => {
            this.loadDiv.remove()
          }, 550)
        }, 1000)
      })
    }
  }

  setAmbientLight() {
    this.ambientlight = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.ambientlight.container)
  }

  setSphereBack() {
    this.sphereBack = new SphereBackground({
      debug: this.debugFolder,
      time: this.time,
    })
    this.container.add(this.sphereBack.container)
  }
  
  setSphereCenter() {
    this.sphereCenter = new SphereCenter({
      debug: this.debugFolder,
      time: this.time,
      click: this.click
    })
    this.container.add(this.sphereCenter.container)
  }

  setParticles() {
    this.particles = new Particles({
      debug: this.debug,
      time: this.time,
      sampler: this.sampler,
      dirRotaX: 1,
      dirRotaY: 1,
      dirRotaZ: 1,
      radius: 6.5,
      colA: new Vector3(0.30, 0.51, 1.0),
      colB: new Vector3(0.28, 0.29, 0.39),
      colC: new Vector3(1.0, 1.0, 1.0),
      colD: new Vector3(1.0, 0.96, 0.37)
    })
    this.container.add(this.particles.container)
  }
  
  setParticles2() {
    this.particles2 = new Particles({
      debug: this.debug,
      time: this.time,
      sampler: this.sampler,
      dirRotaX: 1,
      dirRotaY: -1,
      dirRotaZ: 1,
      radius: 6.5,
      colA: new Vector3(0.42, 0.87, .50),
      colB: new Vector3(0.28, 0.29, 0.39),
      colC: new Vector3(1.0, 1.0, 1.0),
      colD: new Vector3(1.0, 0.96, 0.37)
    })
    this.container.add(this.particles2.container)
  }
  setParticles3() {
    this.particles3 = new Particles({
      debug: this.debug,
      time: this.time,
      sampler: this.sampler,
      dirRotaX: -1,
      dirRotaY: -2,
      dirRotaZ: -1,
      radius: 6.5,
      colA: new Vector3(0.99, 0.22, 0.39),
      colB: new Vector3(0.28, 0.29, 0.39),
      colC: new Vector3(1.0, 1.0, 1.0),
      colD: new Vector3(1.0, 0.96, 0.37)
    })
    this.container.add(this.particles3.container)
  }
}
