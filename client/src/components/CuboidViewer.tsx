// src/components/CuboidViewer.tsx

import React, { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture } from '@babylonjs/core';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const CuboidViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const capturedImage = useSelector((state: RootState) => state.map.capturedImage);

  useEffect(() => {
    if (!canvasRef.current) return;

    engineRef.current = new Engine(canvasRef.current, true);
    const scene = new Scene(engineRef.current);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvasRef.current, true);

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
    const material = new StandardMaterial("groundMaterial", scene);
    ground.material = material;

    if (capturedImage) {
      material.diffuseTexture = new Texture(capturedImage, scene);
    }

    engineRef.current.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current || !capturedImage) return;

    const scene = engineRef.current.scenes[0];
    const ground = scene.getMeshByName('ground');
    if (ground) {
      const material = ground.material as StandardMaterial;
      material.diffuseTexture = new Texture(capturedImage, scene);
    }
  }, [capturedImage]);

  return <canvas ref={canvasRef} className="w-full h-[400px] rounded-lg shadow-lg" />;
};

export default CuboidViewer;