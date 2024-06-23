import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, Color4, Mesh } from "@babylonjs/core";

export class CuboidScene {
  private engine: Engine;
  private scene: Scene;
  private cuboid: Mesh;

  constructor(private canvas: HTMLCanvasElement, private setProgress: (progress: number) => void) {
    this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new Scene(this.engine);
    this.initScene();
  }

  private initScene(): void {
    this.setProgress(10); // Initial progress after setting up the engine

    const camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 10, Vector3.Zero(), this.scene);
    camera.attachControl(this.canvas, true);
    this.setProgress(30); // Progress after setting up the camera

    new HemisphericLight("light", new Vector3(1, 1, 0), this.scene);
    this.setProgress(50); // Progress after setting up the light

    this.cuboid = MeshBuilder.CreateBox("cuboid", { size: 2 }, this.scene);
    const material = new StandardMaterial("material", this.scene);
    this.cuboid.material = material;
    this.setProgress(70); // Progress after creating the cuboid

    this.scene.clearColor = new Color4(0, 0, 0, 1);
    this.setProgress(100); // Final progress after setting up the scene
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
      setProgress(100); // Set progress to 100% once the texture is loaded
    });
    material.diffuseTexture = texture;
  }

  public dispose(): void {
    this.engine.dispose();
  }
}