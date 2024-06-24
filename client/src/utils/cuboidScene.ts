import { Engine, Scene, ArcRotateCamera, Vector3, MeshBuilder, StandardMaterial, Texture, Color4, Mesh, Color3 } from "@babylonjs/core";
import { CUBOID_CONFIG, CAMERA_CONFIG, MATERIAL_CONFIG, BABYLON_CONFIG, COLOR_CONFIG } from "../constants/babylon.config";

export class CuboidScene {
  private engine: Engine;
  private scene: Scene;
  private cuboid!: Mesh;

  constructor(private canvas: HTMLCanvasElement, private setProgress: (progress: number) => void) {
    this.engine = new Engine(this.canvas, BABYLON_CONFIG.ANTIALIAS, { preserveDrawingBuffer: true, stencil: true }, BABYLON_CONFIG.ADAPTIVE_PIXEL_RATIO);
    this.scene = new Scene(this.engine);
    this.initScene();
  }

  private initScene(): void {
    this.setProgress(10);

    const camera = new ArcRotateCamera("camera", CAMERA_CONFIG.ALPHA, CAMERA_CONFIG.BETA, CAMERA_CONFIG.RADIUS, Vector3.FromArray(CAMERA_CONFIG.TARGET), this.scene);
    camera.attachControl(this.canvas, true);
    this.setProgress(30);

    this.cuboid = MeshBuilder.CreateBox(
      "cuboid",
      {
        height: CUBOID_CONFIG.HEIGHT,
        width: CUBOID_CONFIG.WIDTH,
        depth: CUBOID_CONFIG.DEPTH,
      },
      this.scene
    );

    const material = new StandardMaterial(MATERIAL_CONFIG.NAME, this.scene);
    material.disableLighting = true;
    material.emissiveColor = new Color3(...COLOR_CONFIG.EMISSIVE_COLOR);

    this.cuboid.material = material;
    this.setProgress(70);

    this.scene.clearColor = new Color4(...COLOR_CONFIG.CLEAR_COLOR);
    this.setProgress(100);
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  public resize(): void {
    this.engine.resize();
  }

  public updateTexture(imageUrl: string, setProgress: (progress: number) => void): void {
    setProgress(0);
    const material = this.cuboid.material as StandardMaterial;
    const texture = new Texture(imageUrl, this.scene, undefined, undefined, undefined, () => {
      setProgress(100);
    });
    material.diffuseTexture = texture;
  }

  public dispose(): void {
    this.engine.dispose();
  }
}
