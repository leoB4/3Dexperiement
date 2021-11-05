import { Object3D, AmbientLight, Color, SphereBufferGeometry, ShaderMaterial, Vector3, AdditiveBlending, Float32BufferAttribute, SphereGeometry, MeshBasicMaterial, Mesh, TorusBufferGeometry, DoubleSide, Clock } from 'three'

import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import Fragment from '@shaders/Particles/fragment.frag'
import Vertex from '@shaders/Particles/vertex.vert'

export default class Particles {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time
    this.dirRotaX = options.dirRotaX
    this.dirRotaY = options.dirRotaY
    this.dirRotaZ = options.dirRotaZ
    this.radius = options.radius
    this.colA = options.colA
    this.colB = options.colB
    this.colC = options.colC
    this.colD = options.colD

    this.clock = new Clock

    // Set up
    this.container = new Object3D()
    this.container.name = 'Particles'
    this.config = { 
        particlesSpeed: 1,
        particlesCount: 3000,
        speedPos: 0.05,
        uColorA: this.colA,
        uColorB: this.colB,
        uColorC: this.colC,
        uColorD: this.colD,
     }

    this.createSphere()
    this.createParticles()
    this.update()

    // if (this.debug) {
    //   this.setDebug()
    // }
  }

  createSphere() {
    this.geom = new TorusBufferGeometry(this.radius,4, 64, 64)

    this.mat = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      side: DoubleSide,
      opacity: 0,
      transparent: true
    })

    this.sphere = new Mesh(this.geom, this.mat)
    this.container.add(this.sphere)
  }

  createParticles() {
      console.log(this.sphere);
    this.sampler = new MeshSurfaceSampler(this.sphere).build()
    
    this.geom = new SphereGeometry(0.005, 16, 16)

    this.material = new ShaderMaterial({
      vertexShader: Vertex,
      fragmentShader: Fragment,
      transparent: true,
    //   blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 1 },
        uDirection: { value: new Vector3() },
        uRandom: { value: 0 },
        uInfluence: { value: 0 },
        uColorA: {value: this.colA},
        uColorB: {value: this.colB},
        uColorC: {value: this.colC},
        uColorD: {value: this.colD},
      }
    })

    this.particles = new InstancedUniformsMesh(this.geom, this.material, this.config.particlesCount)

    this.tempPosition = new Vector3()
    this.tempObject = new Object3D()
    this.center = new Vector3()

    this.directions = []

    for (let i = 0; i < this.config.particlesCount; i++) {
      this.sampler.sample(this.tempPosition)
      this.tempObject.position.copy(this.tempPosition)
      this.tempObject.scale.setScalar(0.5 + Math.random()*0.5)
      this.tempObject.updateMatrix()
      this.particles.setMatrixAt(i, this.tempObject.matrix)

      // Set direction of the particle
      const dir = new Vector3()
      dir.subVectors(this.tempPosition, this.center).normalize()
      this.particles.setUniformAt('uDirection', i, dir)
      this.particles.setUniformAt('uRandom', i, Math.random())
    }

    this.geom.setAttribute('aDirection', new Float32BufferAttribute(this.directions, 3))
    this.geom.attributes.aDirection.needsUpdate = true

    this.container.add(this.particles)
  }

  update() {

    this.time.on('tick', () => {

        this.particles.material.uniforms.uTime.value += 0.05*this.config.particlesSpeed

        this.particles.rotation.x = this.dirRotaX + Math.sin(this.clock.getElapsedTime() * this.config.speedPos) * 5
        this.particles.rotation.x = this.dirRotaX + Math.sin(this.clock.getElapsedTime() * this.config.speedPos) * 5
        this.particles.rotation.y = this.dirRotaY + Math.sin(this.clock.getElapsedTime() * this.config.speedPos) * 5

    })

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
