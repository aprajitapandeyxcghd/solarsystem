import * as THREE from "three";

function getUranus() {
    const loader = new THREE.TextureLoader();
    const uranusTexture = loader.load("./textures/uranus.jpg");

    const geometry = new THREE.SphereGeometry(4, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: uranusTexture });
    const uranus = new THREE.Mesh(geometry, material);
    uranus.position.set(18, 0, 0);

    // Rings
    const ringGeometry = new THREE.RingGeometry(4.5, 6, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: loader.load("./textures/uranus_rings.png"),
        side: THREE.DoubleSide,
        transparent: true,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    uranus.add(ringMesh);

    // Tilted 98 degrees
    uranus.rotation.z = Math.PI / 2;

    uranus.userData.update = (t) => {
        uranus.rotation.y = t * 0.1;
    };

    return uranus;
}

export default getUranus;
