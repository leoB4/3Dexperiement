import { Scene, 
	sRGBEncoding, 
	WebGLRenderer, 
	AudioListener,
	Color,
	Audio,
	AudioLoader,
	AudioAnalyser,
	Fog, 
	Clock,
	Vector3,
	Vector2} from 'three'

import { Pane } from 'tweakpane'
import { gsap } from 'gsap'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import Camera from './Camera'
import World from '@world/index'

import RedRacer from '@sounds/redRacer.mp3'
import Crude from '@sounds/crude.mp3'

export default class App {
	constructor(options) {
		// Set options
		this.canvas = options.canvas
		this.play = options.button

		// Set up
		this.time = new Time()
		this.sizes = new Sizes()
		this.assets = new Assets()

		this.frequencies = new Float32Array(64)
        this.targetFrequencies = new Float32Array(64)

		this.frequenciesSum = 0
		this.tgtFrequenciesSum = 0

		this.camLookProgress = 0
		this.vecCam = new Vector3()
		this.hasBeenClicked = false

		this.config = {
			backgroundColor: new Color('#0d021f'),
			cameraSpeed: 0,
			cameraRadius: 8,
			particlesSpeed: 0,
			particlesCount: 3000,
			bloomStrength: 1.45,
			bloomThreshold: 0.34,
			bloomRadius: 0.5,
			fogColor: 0xa2dcfc,
			fogNear: 0,
			fogFar: 1,
			camZ: 3,
			afterImageValue: 0.6
		}

		this.setConfig()
		this.setRenderer()
		this.setCamera()
		// this.createPostprocess()
		// this.loadMusic()
		this.setWorld()
		this.startExperiment()
	}
	setRenderer() {
		// Set scene
		this.scene = new Scene()

		this.scene.fog = new Fog(
			this.config.fogColor,
			this.config.fogNear,
			this.config.fogFar
		  )
		// Set renderer
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance',
		})
		this.renderer.outputEncoding = sRGBEncoding
		this.renderer.gammaFactor = 2.2
		// Set background color
		this.renderer.setClearColor(0x212121, 1)
		// Set renderer pixel ratio & sizes
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
		// Resize renderer on resize event
		this.sizes.on('resize', () => {
			this.renderer.setSize(
				this.sizes.viewport.width,
				this.sizes.viewport.height
			)
		})
		// Set RequestAnimationFrame with 60fps
		this.time.on('tick', () => {
			// When tab is not visible (tab is not active or window is minimized), browser stops requesting animation frames. Thus, this does not work
			// if the window is only in the background without focus (for example, if you select another window without minimizing the browser one), 
			// which might cause some performance or batteries issues when testing on multiple browsers
			if (!(this.renderOnBlur?.activated && !document.hasFocus())) {
				this.renderer.render(this.scene, this.camera.camera)
				// this.composer.render(this.time.delta * 0.0001)
				if (!!this.analyser) {
					const d = this.analyser.getFrequencyData()
			  
					this.tgtFrequenciesSum = d.reduce((prev, curr) => prev + curr, 0)

					this.frequenciesSum += ((this.tgtFrequenciesSum) - this.frequenciesSum) * 0.05
					
					this.world.sphereBack.params.uPositionMultiplier = this.frequenciesSum * 0.0001
					this.world.sphereBack.params.uDirMultiplier = this.frequenciesSum * 0.00065
					this.world.sphereBack.params.colorMultiplier = this.frequenciesSum * 0.0005

					this.world.sphereCenter.params.frequency = this.frequenciesSum * 0.00085
					this.world.sphereCenter.params.intensity = this.frequenciesSum * 0.0009
					this.world.sphereCenter.params.amplitude = this.frequenciesSum * 0.002
					this.world.sphereCenter.params.strength = this.frequenciesSum * 0.0001
					this.world.sphereCenter.sphere.scale.setScalar(this.frequenciesSum * 0.0003)

					// this.camera.camera.position.x = Math.sin(this.clock.getElapsedTime()*0.63)*2.7*(this.frequenciesSum * 0.0001)
					// this.camera.camera.position.y = Math.sin(this.clock.getElapsedTime()*0.84)*2.15*(this.frequenciesSum * 0.0001)
					// this.camera.camera.position.z = Math.cos(this.clock.getElapsedTime()*0.39)*this.config.cameraRadius*(this.frequenciesSum * 0.0001)
				}
				this.vecCam.set(0,0,0).lerp(this.world.sphereCenter.sphere.position, this.camLookProgress)
				this.camera.camera.lookAt(this.vecCam)
			}
		})

		if (this.debug) {
			this.renderOnBlur = { activated: true }
			const folder = this.debug.addFolder({
				title: 'Renderer',
				expanded: true
			})
			folder
				.addInput(this.renderOnBlur, 'activated', {
					label: 'Render on window blur'
				})
			this.debugFolder = this.debug.addFolder({
				title: 'PostPro',
				expanded: true
			})
			// this.debugFolder
			// 	.addInput(
			// 		this.config, 
			// 		'bloomStrength',
			// 		{min: 0, max: 10, step: 0.01}
			// 	)
			// 	.on('change', () => {
			// 		this.bloomPass.strength = this.config.bloomStrength
			// 	})
			// this.debugFolder
			// 	.addInput(
			// 		this.config, 
			// 		'bloomThreshold',
			// 		{min: 0, max: 1, step: 0.01}
			// 	)
			// 	.on('change', () => {
			// 		this.bloomPass.threshold = this.config.bloomThreshold
			// 	})
			// this.debugFolder
			// 	.addInput(
			// 		this.config, 
			// 		'bloomRadius',
			// 		{min: 0, max: 10, step: 0.01}
			// 	)
			// 	.on('change', () => {
			// 		this.bloomPass.radius = this.config.bloomRadius
			// 	})
			// this.debugFolder
			// 	.addInput(
			// 		this.config, 
			// 		'afterImageValue',
			// 		{min: 0, max: 1, step: 0.01}
			// 	)
			// 	.on('change', () => {
			// 		this.afterimagePass.uniforms.damp.value = this.config.afterImageValue
			// 	})
				
		}
	}
	setCamera() {
		// Create camera instance
		this.camera = new Camera({
			sizes: this.sizes,
			renderer: this.renderer,
			debug: this.debug,
		})
		// Add camera to scene
		this.scene.add(this.camera.container)
	}
	setWorld() {
		// Create world instance
		this.world = new World({
			time: this.time,
			debug: this.debug,
			assets: this.assets,
			click: this.hasBeenClicked
		})
		// Add world to scene
		this.scene.add(this.world.container)
	}
	setConfig() {
		if (window.location.hash === '#debug') {
			this.debug = new Pane()
		}
	}

	startExperiment() {
		if(this.hasBeenClicked === false) {

			this.play.addEventListener('click', ()=>{
				this.loadMusic()
				this.hasBeenClicked = true
			})
		}
	}

	loadMusic() {
		return new Promise(resolve => {
			const listener = new AudioListener()
			this.camera.camera.add(listener)

			this.music = new Audio(listener)
			this.scene.add(this.music)

			const loader = new AudioLoader()

			loader.load(Crude, buffer => {
				const tl = new gsap.timeline({
					onComplete: () => {

						this.music.setBuffer(buffer)
						this.music.setLoop(true)
						this.music.setVolume(0.1)

						this.analyser = new AudioAnalyser(this.music, 128)

						gsap.delayedCall(0.05, () => this.music.play())

						

						resolve()
					}
				})
				tl.to(this, {
					camLookProgress: 1,
					duration: 1
				})
				tl.to(this.camera.camera.position, {
					z: this.config.camZ,
					duration: 1
				},'-=1')
			})
		})
	}
	
}
