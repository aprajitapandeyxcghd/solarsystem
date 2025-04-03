import * as THREE from "three";

function getMars() {
    const loader = new THREE.TextureLoader();
    const marsTexture = loader.load("./textures/mars.jpg");

    const geometry = new THREE.SphereGeometry(0.53, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: marsTexture });
    const mars = new THREE.Mesh(geometry, material);
    mars.position.set(6, 0, 0);

    // Rotation Animation
    mars.userData.update = (t) => {
        mars.rotation.y = t * 0.2;
    };

    return mars;
}

export default getMars;
