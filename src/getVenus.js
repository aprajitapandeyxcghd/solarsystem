import * as THREE from "three";
import { getFresnelMat } from "./getFresnelMat.js";

function getVenus() {
    const loader = new THREE.TextureLoader();
    const venusTexture = loader.load("./textures/venus.jpg");

    const geometry = new THREE.SphereGeometry(0.95, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: venusTexture });
    const venus = new THREE.Mesh(geometry, material);
    venus.position.set(3, 0, 0);

    // Thick Atmosphere
    const atmosphereMaterial = getFresnelMat({
        rimHex: 0xffaa88,
        facingHex: 0x000000,
    });
    const atmosphereMesh = new THREE.Mesh(geometry, atmosphereMaterial);
    atmosphereMesh.scale.setScalar(1.1);
    venus.add(atmosphereMesh);

    venus.userData.update = (t) => {
        venus.rotation.y = t * 0.07; // Slow rotation
    };

    return venus;
}

export default getVenus;
