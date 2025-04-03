import * as THREE from "three";

function getMercury() {
    const loader = new THREE.TextureLoader();
    const mercuryTexture = loader.load("./textures/mercury.jpg");

    const geometry = new THREE.SphereGeometry(0.38, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: mercuryTexture });
    const mercury = new THREE.Mesh(geometry, material);
    mercury.position.set(2, 0, 0);

    mercury.userData.update = (t) => {
        mercury.rotation.y = t * 0.1;
    };

    return mercury;
}

export default getMercury;
