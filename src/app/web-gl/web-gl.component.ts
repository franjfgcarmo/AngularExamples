import {AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  BoxGeometry, Color, DirectionalLight, Geometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera,
  Scene, Vector3,
  WebGLRenderer
} from 'three';


@Component({
  selector: 'app-web-gl',
  templateUrl: './web-gl.component.html',
  styleUrls: ['./web-gl.component.css']
})
export class WebGlComponent implements AfterContentInit {

  @ViewChild('webGlCanvas') webGlCanvas: ElementRef;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private cube: Mesh;
  private lastFrameTime: number;

  constructor() {
  }


  ngAfterContentInit(): void {
    this.scene = new Scene();
    const canvas = this.webGlCanvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new WebGLRenderer({canvas});
    this.renderer.setSize(width, height);

    const light = new AmbientLight( 0x404040 );
    this.scene.add(light);
    const directionalLight = new DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(directionalLight);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({color: 0x00ff00});
    this.cube = new Mesh(geometry, material);
    this.cube.castShadow = true;
    this.scene.add(this.cube);
    const lineMaterial = new LineBasicMaterial({color: 0x0000ff});
    const lineGeometry = new Geometry();
    lineGeometry.vertices.push(new Vector3(-1, 0, 0));
    lineGeometry.vertices.push(new Vector3(0, 1, 0));
    lineGeometry.vertices.push(new Vector3(1, 0, 0));

    this.scene.add(new Line(lineGeometry, lineMaterial));
    this.camera.position.z = 5;
    this.lastFrameTime = 0;
    this.animate(0);
  }

  animate(time?: number) {
    requestAnimationFrame((frameTime) => this.animate(frameTime));
    const frameTime = (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;
    // this.cube.material.color = this.material.color.set(new Color(time / 5000 % 1, time / 3000 % 1, time / 6000 % 1));
    this.cube.rotation.x += 0.5 * frameTime;
    this.cube.rotation.y += 0.5 * frameTime;
    this.renderer.render(this.scene, this.camera);
  }
}
