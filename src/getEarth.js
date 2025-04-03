import * as THREE from "three";
import { getFresnelMat } from "./getFresnelMat.js";

function getEarth() {
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load("./textures/earth.jpg");

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(geometry, material);
    earth.position.set(4, 0, 0);

    // Atmosphere
    const atmosphereMaterial = getFresnelMat({
        rimHex: 0x99ccff,
        facingHex: 0x000000,
    });
    const atmosphereMesh = new THREE.Mesh(geometry, atmosphereMaterial);
    atmosphereMesh.scale.setScalar(1.1);
    earth.add(atmosphereMesh);

    // Rotation Animation
    earth.userData.update = (t) => {
        earth.rotation.y = t * 0.2;
    };

    return earth;
}

export default getEarth;
