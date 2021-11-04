import { Object3D, Color, ShaderMaterial, SphereBufferGeometry, Mesh, MeshPhongMaterial, BackSide, Clock, DoubleSide } from 'three'

import backVert from '@shaders/Background/vertex.vert'
import backFrag from '@shaders/Background/fragment.frag'


export default class SphereBackground {
	constructor(options) {
		// Set options
		this.debug = options.debug
		this.time = options.time
		// Set up
		this.container = new Object3D()
		this.container.name = 'SphereBack'
		this.params = { 
			color: 0xffffff,
			uPositionMultiplier: 0.68,
			uDirMultiplier: 2.4
		}

		this.clock = new Clock()

		this.createSphere()
		this.update()

		if (this.debug) {
			this.setDebug()
		}
	}
	createSphere() {
		this.material = new ShaderMaterial({
			fragmentShader: backFrag,
			vertexShader: backVert,
			side: DoubleSide,
			// wireframe: true,
			transparent: true,
			opacity: 0.1,
			uniforms: {
				uTime: { value: 0 },
				uPositionMultiplier: {value: this.params.uPositionMultiplier},
				uDirMultiplier: {value: this.params.uDirMultiplier}
			}
		})

		this.geom = new SphereBufferGeometry(6.5, 120, 60)

		this.bigSphere = new Mesh(this.geom, this.material)

		this.container.add(this.bigSphere)
	}
	setDebug() {
		this.debugFolder = this.debug.addFolder({
			title: 'Sphere Background',
			expanded: true
		})
		this.debugFolder
			.addInput(this.params, 'color')
			.on('change', () => {
				this.material.color = new Color(this.params.color)
			})
		this.debugFolder
			.addInput(
				this.params, 
				'uPositionMultiplier',
				{min: 0, max: 3, step: 0.01}
			)
			.on('change', () => {
				this.bigSphere.material.uniforms.uPositionMultiplier.value = this.params.uPositionMultiplier
			  })
		this.debugFolder
			.addInput(
				this.params, 
				'uDirMultiplier',
				{min: 0, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.bigSphere.material.uniforms.uDirMultiplier.value = this.params.uDirMultiplier
			  })
	}

	update() {

		this.time.on('tick', () => {

			this.bigSphere.rotation.x += 0.00025
			this.bigSphere.rotation.y += 0.00025
			this.bigSphere.rotation.z += 0.00025
			this.bigSphere.material.uniforms.uTime.value += 0.01 
		})

	}
}
