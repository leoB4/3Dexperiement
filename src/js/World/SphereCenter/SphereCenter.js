import { Object3D, Color, ShaderMaterial, SphereBufferGeometry, Mesh, MeshPhongMaterial, BackSide, Clock, DoubleSide, MeshNormalMaterial } from 'three'

import Vert from '@shaders/CenterSphere/vertex.vert'
import Frag from '@shaders/CenterSphere/fragment.frag'


export default class SphereCenter {
	constructor(options) {
		// Set options
		this.debug = options.debug
		this.time = options.time
        this.click = options.click

		// Set up
		this.container = new Object3D()
		this.container.name = 'SphereCenter'
		this.params = { 
			speed: 0.2,
            density: 1.5,
            strength: 0.1,
            frequency: 0.3,
            amplitude: 6.0,
            intensity: 7.0,
            speedPos: 0.35,
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
			fragmentShader: Frag,
			vertexShader: Vert,
			// wireframe: true,
            side: DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: this.params.speed },
                uNoiseDensity: { value: this.params.density },
                uNoiseStrength: { value: this.params.strength },
                uFrequency: { value: this.params.frequency },
                uAmplitude: { value: this.params.amplitude },
                uIntensity: { value: this.params.intensity },
              },
		})

        // this.material = new MeshNormalMaterial({})

		this.geom = new SphereBufferGeometry(0.5, 120, 120)

		this.sphere = new Mesh(this.geom, this.material)
        this.sphere.scale.set(0,0,0)

        this.proxySphere = new Object3D
        this.proxySphere.position.set(10,10,10)

		this.container.add(this.sphere)
        this.container.add(this.proxySphere)
	}
	setDebug() {
		this.debugFolder = this.debug.addFolder({
			title: 'Sphere Center',
			expanded: true
		})
		this.debugFolder
			.addInput(
				this.params, 
				'speed',
				{min: -10, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uSpeed.value = this.params.speed
			  })
		this.debugFolder
			.addInput(
				this.params, 
				'density',
				{min: 0, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uNoiseDensity.value = this.params.density
			  })
		this.debugFolder
			.addInput(
				this.params, 
				'strength',
				{min: 0, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uNoiseStrength.value = this.params.strength
			  })
		this.debugFolder
			.addInput(
				this.params, 
				'frequency',
				{min: 0, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uFrequency.value = this.params.frequency
			  })
		this.debugFolder
			.addInput(
				this.params, 
				'amplitude',
				{min: 0, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uAmplitude.value = this.params.amplitude
			  })
		this.debugFolder
			.addInput(
				this.params, 
				'intensity',
				{min: 0, max: 10, step: 0.1}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uIntensity.value = this.params.intensity
			  })
		
	}

	update() {

		this.time.on('tick', () => {

			this.sphere.material.uniforms.uTime.value = this.clock.getElapsedTime();
            this.sphere.material.uniforms.uSpeed.value = this.params.speed;    
            this.sphere.material.uniforms.uNoiseDensity.value = this.params.density;
            this.sphere.material.uniforms.uNoiseStrength.value = this.params.strength;
            this.sphere.material.uniforms.uFrequency.value = this.params.frequency;
            this.sphere.material.uniforms.uAmplitude.value = this.params.amplitude;
            this.sphere.material.uniforms.uIntensity.value = this.params.intensity;

            this.sphere.position.x = Math.cos(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.position.y = -Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.position.z = Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5
            
            this.sphere.rotation.x = Math.cos(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.rotation.y = -Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.rotation.z = Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5

		})

	}
}
