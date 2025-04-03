import * as THREE from "three";

function getSaturn() {
    const loader = new THREE.TextureLoader();
    const saturnTexture = loader.load("./textures/saturn.jpg");

    const geometry = new THREE.SphereGeometry(9, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: saturnTexture });
    const saturn = new THREE.Mesh(geometry, material);
    saturn.position.set(14, 0, 0);

    // Rings
    const ringGeometry = new THREE.RingGeometry(13, 18, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: loader.load("./textures/saturn_rings.png"),
        side: THREE.DoubleSide,
        transparent: true,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    saturn.add(ringMesh);

    // Rotation Animation
    saturn.userData.update = (t) => {
        saturn.rotation.y = t * 0.15;
    };

    return saturn;
}

export default getSaturn;
