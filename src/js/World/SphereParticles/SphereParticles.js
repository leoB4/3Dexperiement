import { Object3D, AmbientLight, Color, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class SphereParticles {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Sphere Particle'
    this.params = { color: 0x232323 }

    this.createSphere()

    if (this.debug) {
      this.setDebug()
    }
  }
  createSphere() {
    const geom = new SphereGeometry(2, 32, 16)

    const mat = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      opacity: 0.1,
      transparent: true
    })

    this.sphere = new Mesh(geom, mat)
    this.container.add(this.sphere)
  }
//   setDebug() {
//     this.debugFolder = this.debug.addFolder({
//       title: 'Ambient Light',
//       expanded: true
//     })
//     this.debugFolder
//       .addInput(this.params, 'color')
//       .on('change', () => {
//         this.light.color = new Color(this.params.color)
//       })
//   }
}
