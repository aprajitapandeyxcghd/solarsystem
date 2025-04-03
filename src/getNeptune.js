import * as THREE from "three";

function getNeptune() {
    const loader = new THREE.TextureLoader();
    const neptuneTexture = loader.load("./textures/neptune.jpg");

    const geometry = new THREE.SphereGeometry(3.9, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: neptuneTexture });
    const neptune = new THREE.Mesh(geometry, material);
    neptune.position.set(22, 0, 0);

    neptune.userData.update = (t) => {
        neptune.rotation.y = t * 0.2;
    };

    return neptune;
}

export default getNeptune;
