import { Cylinder } from './cylinder'
import {color} from "../config";

export class Circle {
  constructor(scene, time) {
    this.config = {
      radius: 14000,
      height: 10,
      opacity: 0.6,
      color: color.circle,
      open: false,
      position: {
        x: 50000,
        y: 0,
        z:-60000,
      },
      speed: 1.0,
    }
    new Cylinder(scene, time).createCylinder(this.config)
  }
}
