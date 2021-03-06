import {AfterContentInit, Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {
  AmbientLight,
  BoxGeometry,
  Clock,
  Color,
  FogExp2,
  Geometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SpotLight,
  UniformsLib,
  UniformsUtils,
  WebGLRenderer
} from 'three';
import {MandelbrotFragment, MandelbrotVertex} from './mandelbrot-shader';


const PIHALF = Math.PI / 2;

// a little hack to make our manually loaded three plugins available.
declare const THREE: any;

@Component({
  selector: 'app-web-gl',
  templateUrl: './web-gl.component.html',
  styleUrls: ['./web-gl.component.css']
})
export class WebGlComponent implements OnInit, AfterContentInit {


  @ViewChild('webGlCanvas') webGlCanvas: ElementRef;

  mouseup$ = new EventEmitter<MouseEvent>();
  mousedown$ = new EventEmitter<MouseEvent>();


  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private cube: Mesh;
  private lastFrameTime: number;
  private checkerBoard: Mesh;
  private width: number;
  private height: number;
  private pointLight: PointLight;
  private clock: Clock;
  private controls: any;

  private activateLook$: Observable<boolean>;

  constructor() {
  }

  ngOnInit(): void {
    this.activateLook$ =
      Observable.merge(this.mousedown$
        .map((event) => {
          event.stopPropagation();
          event.preventDefault();
          return true;
        }), this.mouseup$.map((event) => {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }));
  }

  ngAfterContentInit(): void {
    this.clock = new Clock();
    this.scene = new Scene();
    this.scene.fog = new FogExp2(0xcccccc, 0.002);
    const canvas = this.webGlCanvas.nativeElement;
    this.width = canvas.innerWidth;
    this.height = canvas.innerHeight;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.rotation.x = -Math.PI / 5;
    this.camera.position.z = -0.6;
    this.camera.position.y = 1.86;
    this.camera.position.x = 10;
    this.renderer = new WebGLRenderer({canvas, antialias: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setSize(this.width, this.height);

    this.controls = new THREE.OrbitControls(this.camera, canvas);

    const light = new AmbientLight(0xffffff);
    this.scene.add(light);

    const spotLight = new SpotLight(0xaaaaaa, 0.75, 200, 0.79, 2);
    spotLight.position.x = 3;
    spotLight.position.y = 2;
    this.scene.add(spotLight);

    const pointLight = this.createLight(0xff1111);
    pointLight.position.y = 3;
    pointLight.add(new Mesh(new SphereGeometry(0.2, 8, 8), new MeshBasicMaterial({color: 0xff0000})));
    this.pointLight = pointLight;
    this.scene.add(pointLight);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({color: 0x6611dd, specular: 0x009900, shininess: 30, flatShading: true});
    this.cube = new Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.cube.position.y = 0.75;
    this.scene.add(this.cube);

    this.checkerBoard = this.createMandlebrotPlane();
    this.checkerBoard.rotation.x = -PIHALF;
    this.checkerBoard.receiveShadow = true;
    this.scene.add(this.checkerBoard);

    this.lastFrameTime = 0;

    this.camera.lookAt(this.cube.position);

    this.animate(0);
  }

  private createLight(color) {
    const pointLight = new PointLight(color);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 60;
    pointLight.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects
    const geometry = new SphereGeometry(12);
    const material = new MeshBasicMaterial({
      color: color
    });
    const sphere = new Mesh(geometry, material);
    sphere.name = 'sphere';
    pointLight.add(sphere);
    return pointLight;
  }


  private animate(time?: number) {

    this.resize();

    const frameTime = this.clock.getDelta();
    (this.checkerBoard.material as ShaderMaterial)
      .uniforms.zoom.value = Math.cos(time * 0.0001) * 0.1;

    this.cube.rotation.x += 0.5 * frameTime;
    this.cube.rotation.y += 0.5 * frameTime;

    this.pointLight.position.x = Math.sin(time * 0.0007) * 3;
    this.pointLight.position.y = 3 + Math.cos(time * 0.0005) * 2;
    this.pointLight.position.z = Math.cos(time * 0.0003) * 3;
    const pointLightColor = new Color(
      (Math.cos(time * 0.0003) + 1) * 0.5,
      (Math.sin(time * 0.0005) + 1) * 0.5,
      (Math.cos(time * 0.0007) + 1) * 0.5
    );

    const pointLightSphere = (this.pointLight.getObjectByName('sphere') as Mesh);

    const material = new MeshBasicMaterial({
      color: pointLightColor.getHex()
    });

    pointLightSphere.material = material;

    const sphere = new Mesh(pointLightSphere.geometry as Geometry, material);
    sphere.name = 'sphere';

    this.pointLight.color.set(pointLightColor);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((nextTime) => this.animate(nextTime));
  }

  private createCheckerBoard(segments: number = 20): Mesh {
    const geometry = new PlaneGeometry(100, 100, segments, segments);

    const materialEven = new MeshPhongMaterial({color: 0xccccfc, specular: 0x009900, shininess: 15, flatShading: true});
    const materialOdd = new MeshPhongMaterial({color: 0x444464, specular: 0x009900, shininess: 10, flatShading: true});
    const materials = [materialEven, materialOdd];

    for (let x = 0; x < segments; x++) {
      for (let y = 0; y < segments; y++) {
        const i = x * segments + y;
        const j = 2 * i;
        geometry.faces[j].materialIndex = geometry.faces[j + 1].materialIndex = (x + y) % 2;
      }
    }

    const checkerBoard = new Mesh(geometry, materials);
    return checkerBoard;
  }

  private createMandlebrotPlane(): Mesh {
    return new Mesh(new PlaneGeometry(100, 100, 1, 1), this.createMandelbrotMaterial());
  }

  private createMandelbrotMaterial(): Material {
    const uniforms = UniformsUtils
      .merge([
        UniformsLib['lights'],
        {zoom: {type: 'f', value: 0.05}}
      ]);

    return new ShaderMaterial({
      uniforms,
      vertexShader: MandelbrotVertex,
      fragmentShader: MandelbrotFragment,
      lights: true,
    });
  }

  // Resize by clientWidth and clientHeight
  private resize() {
    const canvas = this.webGlCanvas.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width !== this.width ||
      height !== this.height) {
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.width = width;
      this.height = height;
    }
  }
}
