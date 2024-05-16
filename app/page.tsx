"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Card from "../components/Card";
import { OrbitControls, TransformControls, useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import { getFileNames } from "./utils";
import { useSpring, animated } from "@react-spring/three";
export default function Home() {
  const { x }  = useSpring({from: {x: 0}, to: {x: 1}, loop: true, config: {mass: 1, tension: 100, friction: 10}});
  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/get_textures').then((res) => res.json()).then((data) => {
      setFiles(data.files);
  });
  }, []);    
  return (
    <main className="w-full h-screen">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <animated.group  rotation={[0,0,- Math.PI *0.5]} >
        {files.map((file,i) => (
          <animated.group key={i} >
          <Card  url={file} position={[0, i* 0.02, 0]} rotation={[0,0,- Math.PI * 0.25]} >
          </Card>
          </animated.group>
        )
        )}
        </animated.group>
      </Canvas>
      <button onClick={() => setFiles(files.slice(0, -1))}>Stop</button>
    </main>
  );
}
