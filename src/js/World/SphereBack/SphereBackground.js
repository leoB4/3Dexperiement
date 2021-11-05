import { Object3D, Color, ShaderMaterial, SphereBufferGeometry, Mesh, MeshPhongMaterial, BackSide, Clock, DoubleSide, Vector3 } from 'three'

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
			uPositionMultiplier: 0.10,
			uDirMultiplier: 2,
			colorMultiplier: 2.50,
			uBrightness: new Vector3(0.5176, 0.3686, 0.8667),
			uContrast: new Vector3(0.3686, 0.6431, 0.8667),
			uOscilation: new Vector3(1.0, 1.0, 1.0),
			uPhase: new Vector3(0.00, 0.10, 0.20),
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
				uDirMultiplier: {value: this.params.uDirMultiplier},
				colorMultiplier: {value: this.params.colorMultiplier},
				uBrightness: {value: this.params.uBrightness},
				uContrast: {value: this.params.uContrast},
				uOscilation: {value: this.params.uOscilation},
				uPhase: {value: this.params.uPhase},
			}
		})

		this.geom = new SphereBufferGeometry(12, 360, 360)

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
			  this.debugBrightness = this.debugFolder.addFolder({
				title: 'Brightness',
				expanded: true
			})
			this.debugBrightness
				.addInput(
					this.params.uBrightness, 
					'x',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uBrightness.value.x = this.params.uBrightness.x
				  })
			this.debugBrightness
				.addInput(
					this.params.uBrightness, 
					'y',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uBrightness.value.y = this.params.uBrightness.y
				  })
			this.debugBrightness
				.addInput(
					this.params.uBrightness, 
					'z',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uBrightness.value.z = this.params.uBrightness.z
				  })
			
			this.debugContrast = this.debugFolder.addFolder({
				title: 'Contrast',
				expanded: true
			})
			this.debugContrast
				.addInput(
					this.params.uContrast, 
					'x',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uContrast.value.x = this.params.uContrast.x
				  })
			this.debugContrast
				.addInput(
					this.params.uContrast, 
					'y',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uContrast.value.y = this.params.uContrast.y
				  })
			this.debugContrast
				.addInput(
					this.params.uContrast, 
					'z',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uContrast.value.z = this.params.uContrast.z
				  })
		   
			this.debugOscilation = this.debugFolder.addFolder({
				title: 'Oscilation',
				expanded: true
			})
			this.debugOscilation
				.addInput(
					this.params.uOscilation, 
					'x',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uOscilation.value.x = this.params.uOscilation.x
				  })
			this.debugOscilation
				.addInput(
					this.params.uOscilation, 
					'y',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uOscilation.value.y = this.params.uOscilation.y
				  })
			this.debugOscilation
				.addInput(
					this.params.uOscilation, 
					'z',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uOscilation.value.z = this.params.uOscilation.z
				  })
			
				this.debugPhase = this.debugFolder.addFolder({
				title: 'Phase',
				expanded: true
			})
			this.debugPhase
				.addInput(
					this.params.uPhase, 
					'x',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uPhase.value.x = this.params.uPhase.x
				  })
			this.debugPhase
				.addInput(
					this.params.uPhase, 
					'y',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uPhase.value.y = this.params.uPhase.y
				  })
			this.debugPhase
				.addInput(
					this.params.uPhase, 
					'z',
					{min: 0, max: 1, step: 0.01}
				)
				.on('change', () => {
					this.bigSphere.material.uniforms.uPhase.value.z = this.params.uPhase.z
				  })
	}

	update() {

		this.time.on('tick', () => {

			this.bigSphere.rotation.x += 0.00025
			this.bigSphere.rotation.y += 0.00025
			this.bigSphere.rotation.z += 0.00025
			this.bigSphere.material.uniforms.uTime.value += 0.01 
			this.bigSphere.material.uniforms.uPositionMultiplier.value = this.params.uPositionMultiplier
			this.bigSphere.material.uniforms.uDirMultiplier.value = this.params.uDirMultiplier
			this.bigSphere.material.uniforms.colorMultiplier.value = this.params.colorMultiplier
			this.bigSphere.material.uniforms.uBrightness.value = this.params.uBrightness
		})

	}
}
