import {
  fileType,
  loadFileAsync,
  getBufferGeometryFromShape,
} from "./OpenCascadeHelpers"
import {
  STEPControl_Reader_1,
  IGESControl_Reader_1,
  OpenCascadeInstance,
} from "opencascade.js"
import Setup from "../Setup"
import * as THREE from "three"

export default class LoadSTEP {
  button: HTMLElement
  STEPFile: File | null = null
  buffer: string = ""
  reader: STEPControl_Reader_1 | IGESControl_Reader_1 | null = null
  instance: OpenCascadeInstance
  setup: Setup
  scene: THREE.Scene

  constructor(fileInputButton: HTMLElement, OCInstance: OpenCascadeInstance) {
    this.setup = Setup.getInstance()
    this.scene = this.setup.scene
    this.button = fileInputButton
    this.instance = OCInstance
    this.button.addEventListener("input", async (event: Event) => {
      if (event.target instanceof HTMLInputElement && event.target.files) {
        this.STEPFile = event.target.files[0]
        await this.loadFile()
      }
    })
  }

  async loadFile() {
    if (!this.STEPFile) return
    this.buffer = await loadFileAsync(this.STEPFile)

    const fileExt = fileType(this.STEPFile.name)
    if (fileExt === "step") {
      this.reader = new this.instance.STEPControl_Reader_1()
    } else if (fileExt === "iges") {
      this.reader = new this.instance.IGESControl_Reader_1()
    } else {
      console.error("Failed to parse this extention")
    }

    this.instance.FS.createDataFile(
      "/",
      `file.${fileExt}`,
      this.buffer,
      true,
      true,
      true
    )

    if (this.reader) {
      const readResult = this.reader.ReadFile(`file.${fileExt}`)
      if (readResult === this.instance.IFSelect_ReturnStatus.IFSelect_RetDone) {
        console.log("file loaded successfully!     Converting to OCC now...")
        const numRootsTransferred = this.reader.TransferRoots(
          new this.instance.Message_ProgressRange_1()
        )
        const stepShape = this.reader.OneShape()
        console.log(
          this.STEPFile.name + " converted successfully!  Triangulating now..."
        )

        //remove existing shape in the scene
        const objNode = this.scene.getObjectByName("three-mesh")
        if (objNode) {
          this.scene.remove(objNode)
        }

        const geometries = getBufferGeometryFromShape(stepShape, this.instance)

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.9, 0.9, 0.9),
        })

        const group = new THREE.Group()
        geometries.forEach((geometry) => {
          group.add(new THREE.Mesh(geometry, material))
        })

        group.name = "three-mesh"
        this.scene.add(group)
        console.log("added step geometry")
        this.instance.FS.unlink(`file.${fileExt}`)
      } else {
        console.error(
          "Something in OCCT went wrong trying to read " + this.STEPFile.name
        )
      }
    }
  }
}
