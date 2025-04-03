import * as THREE from "three";

function getJupiter() {
    const loader = new THREE.TextureLoader();
    const jupiterTexture = loader.load("./textures/jupiter.jpg");

    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: jupiterTexture });
    const jupiter = new THREE.Mesh(geometry, material);
    jupiter.position.set(10, 0, 0);

    jupiter.userData.update = (t) => {
        jupiter.rotation.y = t * 0.3;
    };

    return jupiter;
}

export default getJupiter;
