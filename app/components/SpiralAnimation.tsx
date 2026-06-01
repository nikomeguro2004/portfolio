'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

class Vector2D {
  constructor(public x: number, public y: number) {}
}
class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}
}

class Star {
  private dx: number;
  private dy: number;
  private spiralLocation: number;
  private strokeWeightFactor: number;
  private z: number;
  private angle: number;
  private distance: number;
  private rotationDirection: number;
  private expansionRate: number;
  private finalScale: number;

  constructor(cameraZ: number, cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 30 * Math.random() + 15;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + Math.random() * 0.8;
    this.finalScale = 0.7 + Math.random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    this.z = cameraZ * 0.5 * Math.random() + cameraTravelDistance * Math.random() + cameraZ;
    const lerp = (s: number, e: number, t: number) => s * (1 - t) + e * t;
    this.z = lerp(this.z, cameraTravelDistance / 2, 0.3 * this.spiralLocation);
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p: number, ctrl: AnimationController) {
    const spiralPos = ctrl.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;
    if (q <= 0) return;
    const dp = ctrl.constrain(4 * q, 0, 1);
    const linear = dp;
    const elastic = ctrl.easeOutElastic(dp);
    const power = Math.pow(dp, 2);
    let easing: number;
    if (dp < 0.3) easing = ctrl.lerp(linear, power, dp / 0.3);
    else if (dp < 0.7) easing = ctrl.lerp(power, elastic, (dp - 0.3) / 0.4);
    else easing = elastic;
    let screenX: number, screenY: number;
    if (dp < 0.3) {
      screenX = ctrl.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3);
      screenY = ctrl.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3);
    } else if (dp < 0.7) {
      const mp = (dp - 0.3) / 0.4;
      const curve = Math.sin(mp * Math.PI) * this.rotationDirection * 1.5;
      const bx = spiralPos.x + this.dx * 0.3, by = spiralPos.y + this.dy * 0.3;
      const tx = spiralPos.x + this.dx * 0.7, ty = spiralPos.y + this.dy * 0.7;
      screenX = ctrl.lerp(bx, tx, mp) + (-this.dy * 0.4 * curve) * mp;
      screenY = ctrl.lerp(by, ty, mp) + (this.dx * 0.4 * curve) * mp;
    } else {
      const fp = (dp - 0.7) / 0.3;
      const bx = spiralPos.x + this.dx * 0.7, by = spiralPos.y + this.dy * 0.7;
      const td = this.distance * this.expansionRate * 1.5;
      const sa = this.angle + 1.2 * this.rotationDirection * fp * Math.PI;
      screenX = ctrl.lerp(bx, spiralPos.x + td * Math.cos(sa), fp);
      screenY = ctrl.lerp(by, spiralPos.y + td * Math.sin(sa), fp);
    }
    const camZ = ctrl.getCamZ();
    const vx = (this.z - camZ) * screenX / ctrl.viewZoom;
    const vy = (this.z - camZ) * screenY / ctrl.viewZoom;
    const sz = dp < 0.6 ? 1.0 + dp * 0.2 : ctrl.lerp(1.2, this.finalScale, (dp - 0.6) / 0.4);
    ctrl.showProjectedDot(new Vector3D(vx, vy, this.z), 8.5 * this.strokeWeightFactor * sz);
  }
}

class AnimationController {
  private timeline: gsap.core.Timeline;
  time = 0;
  private ctx: CanvasRenderingContext2D;
  private w: number;
  private h: number;
  private stars: Star[] = [];
  private readonly changeEventTime = 0.32;
  private readonly _cameraZ = -400;
  private readonly cameraTravelDistance = 3400;
  private readonly trailLength = 80;
  readonly viewZoom = 100;

  constructor(ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.timeline = gsap.timeline({ repeat: -1 });
    this.initStars();
    this.setupTimeline();
  }

  private initStars() {
    const orig = Math.random;
    let seed = 1234;
    Math.random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 5000; i++) this.stars.push(new Star(this._cameraZ, this.cameraTravelDistance));
    Math.random = orig;
  }

  private setupTimeline() {
    this.timeline.to(this, { time: 1, duration: 15, ease: 'none', onUpdate: () => this.render() });
  }

  getCamZ() {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    return this._cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;
  }

  ease(p: number, g: number) { return p < 0.5 ? 0.5 * Math.pow(2*p,g) : 1 - 0.5*Math.pow(2*(1-p),g); }
  easeOutElastic(x: number) {
    if (x<=0) return 0; if (x>=1) return 1;
    return Math.pow(2,-8*x)*Math.sin((x*8-0.75)*(2*Math.PI/4.5))+1;
  }
  map(v:number,s1:number,e1:number,s2:number,e2:number){ return s2+(e2-s2)*((v-s1)/(e1-s1)); }
  constrain(v:number,lo:number,hi:number){ return Math.min(Math.max(v,lo),hi); }
  lerp(a:number,b:number,t:number){ return a*(1-t)+b*t; }

  spiralPath(p: number): Vector2D {
    p = this.constrain(1.2*p,0,1);
    p = this.ease(p,1.8);
    const theta = 2*Math.PI*6*Math.sqrt(p);
    const r = 170*Math.sqrt(p);
    return new Vector2D(r*Math.cos(theta), r*Math.sin(theta));
  }

  showProjectedDot(pos: Vector3D, sizeFactor: number) {
    const camZ = this.getCamZ();
    if (pos.z > camZ) {
      const d = pos.z - camZ;
      const x = this.viewZoom * pos.x / d;
      const y = this.viewZoom * pos.y / d;
      const sw = 400 * sizeFactor / d;
      this.ctx.lineWidth = sw;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 0.5, 0, Math.PI*2);
      this.ctx.fill();
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime+0.25, 0, 1), 0, 1);
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    ctx.save();
    ctx.rotate(-Math.PI * this.ease(t2, 2.7));
    this.drawTrail(t1);
    ctx.fillStyle = 'white';
    for (const star of this.stars) star.render(t1, this);
    ctx.restore();
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3*(1-t1) + 3.0*Math.sin(Math.PI*t1)) * f;
      this.ctx.fillStyle = 'white';
      const pt = this.spiralPath(t1 - 0.00015*i);
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, sw/2, 0, Math.PI*2);
      this.ctx.fill();
    }
  }

  destroy() { this.timeline.kill(); }
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<AnimationController | null>(null);
  const [dims, setDims] = useState<{w:number;h:number}|null>(null);

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!dims) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    // Use exact viewport size — no square distortion
    canvas.width = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width = `${dims.w}px`;
    canvas.style.height = `${dims.h}px`;
    ctx.scale(dpr, dpr);
    // Translate origin to exact viewport center
    ctx.translate(dims.w / 2, dims.h / 2);
    ctrlRef.current?.destroy();
    ctrlRef.current = new AnimationController(ctx, dims.w, dims.h);
    return () => { ctrlRef.current?.destroy(); ctrlRef.current = null; };
  }, [dims]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
