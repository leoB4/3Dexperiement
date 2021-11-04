import { AxesHelper, Object3D } from 'three'

import AmbientLightSource from './AmbientLight'
import SphereBackground from './SphereBack/SphereBackground'
import SphereCenter from './SphereCenter/SphereCenter'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets

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
    })
    this.container.add(this.sphereCenter.container)
  }
}
