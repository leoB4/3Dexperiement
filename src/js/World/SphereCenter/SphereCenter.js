import { Object3D, Color, ShaderMaterial, SphereBufferGeometry, Mesh, MeshPhongMaterial, BackSide, Clock, DoubleSide, MeshNormalMaterial, Vector3, BoxBufferGeometry, CylinderBufferGeometry } from 'three'

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
            uBrightness: new Vector3(0.8863, 0.4784, 0.4784),
			uContrast: new Vector3(0.5686, 0.8314, 0.5451),
			uOscilation: new Vector3(1.0, 1.0, 1.0),
			uPhase: new Vector3(0.7647, 0.8078, 0.8549),
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
                uBrightness: {value: this.params.uBrightness},
				uContrast: {value: this.params.uContrast},
				uOscilation: {value: this.params.uOscilation},
				uPhase: {value: this.params.uPhase},
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
			expanded: false
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
				this.sphere.material.uniforms.uBrightness.value.x = this.params.uBrightness.x
			  })
		this.debugBrightness
			.addInput(
				this.params.uBrightness, 
				'y',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uBrightness.value.y = this.params.uBrightness.y
			  })
		this.debugBrightness
			.addInput(
				this.params.uBrightness, 
				'z',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uBrightness.value.z = this.params.uBrightness.z
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
				this.sphere.material.uniforms.uContrast.value.x = this.params.uContrast.x
			  })
		this.debugContrast
			.addInput(
				this.params.uContrast, 
				'y',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uContrast.value.y = this.params.uContrast.y
			  })
		this.debugContrast
			.addInput(
				this.params.uContrast, 
				'z',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uContrast.value.z = this.params.uContrast.z
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
				this.sphere.material.uniforms.uOscilation.value.x = this.params.uOscilation.x
			  })
		this.debugOscilation
			.addInput(
				this.params.uOscilation, 
				'y',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uOscilation.value.y = this.params.uOscilation.y
			  })
		this.debugOscilation
			.addInput(
				this.params.uOscilation, 
				'z',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uOscilation.value.z = this.params.uOscilation.z
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
				this.sphere.material.uniforms.uPhase.value.x = this.params.uPhase.x
			  })
		this.debugPhase
			.addInput(
				this.params.uPhase, 
				'y',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uPhase.value.y = this.params.uPhase.y
			  })
		this.debugPhase
			.addInput(
				this.params.uPhase, 
				'z',
				{min: 0, max: 1, step: 0.01}
			)
			.on('change', () => {
				this.sphere.material.uniforms.uPhase.value.z = this.params.uPhase.z
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
            this.sphere.material.uniforms.uBrightness.value = this.params.uBrightness;

            this.sphere.position.x = Math.cos(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.position.y = -Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.position.z = Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5
            
            this.sphere.rotation.x = Math.cos(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.rotation.y = -Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5
            this.sphere.rotation.z = Math.sin(this.clock.getElapsedTime() * this.params.speedPos) * 5

		})

	}
}
