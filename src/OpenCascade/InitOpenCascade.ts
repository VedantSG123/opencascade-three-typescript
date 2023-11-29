import initOpenCascade from "opencascade.js"
import { OpenCascadeInstance } from "opencascade.js"
import EventEmitter from "../Utils/EventEmitter"

export default class InitOpencascade extends EventEmitter {
  instance: OpenCascadeInstance | null = null
  constructor() {
    super()
    this.createOpencascadeInstance()
  }

  async createOpencascadeInstance() {
    if (!this.instance) {
      initOpenCascade().then((openCascade) => {
        this.instance = openCascade
        this.trigger("oc-ready")
      })
    }
  }

  getOpenCascadeInstance(): OpenCascadeInstance {
    if (this.instance) {
      return this.instance
    } else {
      throw new Error("Failed to create Open Cascade Instance")
    }
  }
}
