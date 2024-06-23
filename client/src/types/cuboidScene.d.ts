import { Engine, Scene, Mesh } from "@babylonjs/core";

declare class CuboidScene {
  private engine: Engine;
  private scene: Scene;
  private cuboid: Mesh;

  constructor(canvas: HTMLCanvasElement);

  private initScene(): void;
  public run(): void;
  public resize(): void;
  public updateTexture(imageUrl: string): void;
  public dispose(): void;
}