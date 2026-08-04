"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Leaf-shaped particle geometry — a simple curved plane, cheap enough
// to instance thousands of times.
function useLeafGeometry() {
    return useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.4, 0.3, 0, 0.9);
        shape.quadraticCurveTo(-0.4, 0.3, 0, 0);
        return new THREE.ShapeGeometry(shape);
    }, []);
}

const PARTICLE_COUNT = 260;
const COLORS = ["#4A7C1F", "#8FBF52", "#1B5E8C", "#E8951F"];

function RisingParticles({ reducedMotion }: { reducedMotion: boolean }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const geometry = useLeafGeometry();

    // Per-particle state: position, speed, rotation, sway phase
    const particles = useMemo(() => {
        return new Array(PARTICLE_COUNT).fill(0).map(() => ({
            x: (Math.random() - 0.5) * 26,
            y: Math.random() * 20 - 10,
            z: (Math.random() - 0.5) * 14 - 4,
            speed: 0.35 + Math.random() * 0.55,
            swaySpeed: 0.4 + Math.random() * 0.8,
            swayAmount: 0.6 + Math.random() * 1.2,
            rotSpeed: (Math.random() - 0.5) * 0.6,
            scale: 0.12 + Math.random() * 0.22,
            phase: Math.random() * Math.PI * 2,
        }));
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Assign a color per instance once
    useEffect(() => {
        if (!meshRef.current) return;
        const color = new THREE.Color();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            color.set(COLORS[i % COLORS.length]);
            meshRef.current.setColorAt(i, color);
        }
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current || reducedMotion) return;
        const t = state.clock.elapsedTime;

        particles.forEach((p, i) => {
            p.y += p.speed * delta;
            if (p.y > 10) p.y = -10; // loop back to the bottom

            const sway = Math.sin(t * p.swaySpeed + p.phase) * p.swayAmount;

            dummy.position.set(p.x + sway, p.y, p.z);
            dummy.rotation.set(0, 0, t * p.rotSpeed);
            dummy.scale.setScalar(p.scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, PARTICLE_COUNT]}>
            <meshStandardMaterial
                vertexColors={false}
                transparent
                opacity={0.55}
                side={THREE.DoubleSide}
                roughness={0.6}
            />
        </instancedMesh>
    );
}

function DriftingCamera({ reducedMotion }: { reducedMotion: boolean }) {
    useFrame(({ camera, clock }) => {
        if (reducedMotion) return;
        const t = clock.elapsedTime;
        camera.position.x = Math.sin(t * 0.06) * 1.4;
        camera.position.y = Math.cos(t * 0.05) * 0.6;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function GardenScene() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const handler = () => setReducedMotion(mq.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 0, 12], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
        >
            <color attach="background" args={["#EAF3DE"]} />
            <fog attach="fog" args={["#EAF3DE", 8, 22]} />

            <ambientLight intensity={0.7} color="#F7F9F2" />
            <pointLight position={[6, 6, 6]} intensity={1.1} color="#8FBF52" />
            <pointLight position={[-6, -4, 4]} intensity={0.8} color="#E8951F" />

            <RisingParticles reducedMotion={reducedMotion} />
            <DriftingCamera reducedMotion={reducedMotion} />
        </Canvas>
    );
}