import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getSun from "./src/getSun.js";
import getNebula from "./src/getNebula.js";
import getStarfield from "./src/getStarfield.js";
import getPlanet from "./src/getPlanet.js";
import getAsteroidBelt from "./src/getAsteroidBelt.js";
import getElipticLines from "./src/getElipticLines.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10000);
camera.position.set(0, 2.5, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
const milkyWay = new THREE.Group();
scene.add(milkyWay);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

let initialCameraPosition = new THREE.Vector3(0, 2.5, 10);
let targetCameraPosition = initialCameraPosition.clone();
let sun;
let rotate360 = false;
let rotating = true;

// Facts for speech output
const facts = {
  "Solar System": "Our Solar System consists of the Sun, eight planets, asteroids, and moons orbiting around it.",
  "Mercury": "Mercury is the smallest planet in our solar system and the closest to the Sun.",
  "Venus": "Venus has a thick atmosphere that traps heat, making it the hottest planet.",
  "Earth": "Earth is the only known planet to support life and has a surface covered seventy percent by water.",
  "Mars": "Mars is known as the Red Planet and has the largest volcano in the Solar System.",
  "Jupiter": "Jupiter is the largest planet and has a Great Red Spot, a storm bigger than Earth.",
  "Saturn": "Saturn is famous for its beautiful rings made of ice and rock.",
  "Uranus": "Uranus rotates on its side and is a very cold gas giant.",
  "Neptune": "Neptune has the fastest winds in the Solar System, reaching up to two thousand kilometers per hour.",
  "Milky Way": "The Milky Way is our galaxy, home to billions of stars, planets, and cosmic wonders."
};

// Speech function
function speakFact(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.length > 0 ? voices[0] : null;
    utterance.lang = 'en-US';
    utterance.rate = 1; // Normal speed

    // Stop ongoing speech before starting new one
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

    console.log("Speaking:", text);
  } else {
    console.warn("❌ Text-to-Speech not supported in this browser.");
  }
}

// Track last spoken fact to avoid repetition
let lastSpokenFact = "";

// Scene Initialization
function initScene(data) {
  const { objs } = data;
  const solarSystem = new THREE.Group();
  scene.add(solarSystem);

  sun = getSun();
  solarSystem.add(sun);

  const planets = [
    { name: "Mercury", size: 0.1, distance: 1.5, img: "mercury.png" },
    { name: "Venus", size: 0.2, distance: 1.75, img: "venus.png" },
    { name: "Earth", size: 0.225, distance: 2.0, img: "earth.png" },
    { name: "Mars", size: 0.15, distance: 2.25, img: "mars.png" },
    { name: "Jupiter", size: 0.5, distance: 3.0, img: "jupiter.png" },
    { name: "Saturn", size: 0.45, distance: 3.5, img: "saturn.png" },
    { name: "Uranus", size: 0.3, distance: 4.0, img: "uranus.png" },
    { name: "Neptune", size: 0.3, distance: 4.5, img: "neptune.png" }
  ];

  planets.forEach(planet => {
    const planetObj = getPlanet(planet);
    solarSystem.add(planetObj);
    planetObj.userData = { rotationSpeed: Math.random() * 0.005 + 0.002, name: planet.name };
  });

  solarSystem.add(getAsteroidBelt(objs));
  solarSystem.add(getElipticLines());
  scene.add(getStarfield({ numStars: 5000, size: 1.0 }));
  scene.add(getNebula({ hue: 0.6, numSprites: 150, opacity: 0.7, radius: 250, size: 300, z: -300 }));
  scene.add(getNebula({ hue: 0.8, numSprites: 150, opacity: 0.7, radius: 250, size: 300, z: 300 }));

  function animate(t = 0) {
    requestAnimationFrame(animate);
    controls.update();
    camera.position.lerp(targetCameraPosition, 0.05);

    if (rotate360) {
      scene.rotation.y += 0.01;
    }

    if (rotating) {
      sun.rotation.y += 0.002;
      solarSystem.children.forEach(obj => {
        if (obj.userData && obj.userData.rotationSpeed) {
          obj.rotation.y += obj.userData.rotationSpeed;
        }
      });
    }

    // AI Guide Logic (Voice Only)
    const camDistance = camera.position.length();
    let currentFact = "";

    if (camDistance < 15) {
      currentFact = "Solar System";
    } else if (camDistance < 30) {
      currentFact = "Milky Way";
    }

    if (currentFact && currentFact !== lastSpokenFact) {
      speakFact(facts[currentFact]);
      lastSpokenFact = currentFact;
    }

    renderer.render(scene, camera);
  }
  animate();
}

// Keyboard Events for Navigation
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") targetCameraPosition.z -= 2.5;
  if (event.key === "ArrowDown") targetCameraPosition.z += 2.5;
  if (event.key === "ArrowLeft") targetCameraPosition.x -= 2.5;
  if (event.key === "ArrowRight") targetCameraPosition.x += 2.5;
  if (event.key === "0") targetCameraPosition.copy(initialCameraPosition);
  if (event.key === "1") targetCameraPosition.z += 10;
  if (event.code === "Space") rotate360 = !rotate360;
  if (event.code === "Enter") rotating = !rotating;
});

// Object Loader
const sceneData = { objs: [] };
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
["Rock1", "Rock2", "Rock3"].forEach(name => {
  loader.load(`./rocks/${name}.obj`, obj => {
    obj.traverse(child => child.isMesh && sceneData.objs.push(child));
  });
});

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
