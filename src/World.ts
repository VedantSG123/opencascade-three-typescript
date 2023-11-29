import * as THREE from "three"
import Setup from "./Setup"
import InitOpencascade from "./OpenCascade/InitOpenCascade"
import { OpenCascadeInstance } from "opencascade.js"
import LoadSTEP from "./OpenCascade/LoadSTEP"

export default class World {
  setup: Setup
  scene: THREE.Scene
  InitOC: InitOpencascade
  OCInstance: OpenCascadeInstance | null = null

  constructor() {
    this.setup = Setup.getInstance()
    this.scene = this.setup.scene
    this.addLights()
    this.InitOC = new InitOpencascade()
    this.InitOC.on("oc-ready", () => {
      this.OCInit()

      const input = document.getElementById("step-file")

      //code for swithcing from loading
      const label = document.getElementById("step-file-label")
      const loader = document.getElementById("load-text")
      label?.classList.toggle("hide")
      loader?.classList.toggle("hide")

      if (input && this.OCInstance) {
        new LoadSTEP(input, this.OCInstance)
      }
    })
  }

  createCube() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(50, 50, 50),
      new THREE.MeshBasicMaterial({
        color: "#ffff00",
      })
    )
    cube.name = "three-mesh"
    this.scene.add(cube)
  }

  addLights() {
    const light = new THREE.AmbientLight(0x404040)
    this.scene.add(light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0.5, 0.5, 0.5)
    this.scene.add(directionalLight)
  }

  OCInit() {
    this.OCInstance = this.InitOC.getOpenCascadeInstance()
    console.log("open cascade ready!!!")
  }
}
