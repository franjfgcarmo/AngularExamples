import {Vector} from './vector';
import {Colors} from 'three';

export class Circle {
  constructor(public pos: Vector, public r: number) {
  }

  getColor(step: number): string {
    const offsetX = 0;
    const offsetY = 0;
    const hue = 360 * Math.abs(Math.sin((step + this.pos.x) * 0.03));
    const sat = Math.abs(Math.cos(this.r));
    const rgb = this.hslToRgb(hue, sat, 0.5);
    const s = this.toRGBtoHex(rgb);
    return s;
  }

  toRGBtoHex({r, g, b}: { r: number, g: number, b: number }) {
    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
  }

  toHex(val: number): string {
    const result = Math.floor(val % 255).toString(16);
    return result.length > 1 ? result : '0' + result;
  }



  private hslToRgb(hue, sat, light) {
    let t1, t2, r, g, b;
    hue = hue / 60;
    if (light <= 0.5) {
      t2 = light * (sat + 1);
    } else {
      t2 = light + sat - (light * sat);
    }
    t1 = light * 2 - t2;
    r = this.hueToRgb(t1, t2, hue + 2) * 255;
    g = this.hueToRgb(t1, t2, hue) * 255;
    b = this.hueToRgb(t1, t2, hue - 2) * 255;
    return {r: r, g: g, b: b};
  }

  private hueToRgb(t1, t2, hue) {
    if (hue < 0) {
      hue += 6;
    }
    if (hue >= 6) {
      hue -= 6;
    }
    if (hue < 1) {
      return (t2 - t1) * hue + t1;
    }
    if (hue < 3) {
      return t2;
    }
    if (hue < 4) {
      return (t2 - t1) * (4 - hue) + t1;
    }
    return t1;
  }
}

