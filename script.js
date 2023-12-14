import * as Three from 'three';

window.canvas = document.getElementById('canvas');
window.canvas.width = innerWidth;
window.canvas.height = innerHeight;
window.iw = innerWidth;
window.ih = innerHeight;

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(70, iw / ih);

const geometry = computeGeometry();

const material = new Three.PointsMaterial({ size: 0.015, vertexColors: true });
const mesh = new Three.Points(geometry, material);

scene.add(mesh);

camera.position.set(0, 0.5, 1.5);
camera.lookAt(0, -0.5, 0);

const renderer = new Three.WebGLRenderer({ canvas });

// Ajout de la lumière ambiante
const ambientLight = new Three.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Fonction pour gérer le redimensionnement de la fenêtre
function onWindowResize() {
    iw = window.innerWidth;
    ih = window.innerHeight;

    camera.aspect = iw / ih;
    camera.updateProjectionMatrix();

    renderer.setSize(iw, ih);
}

window.addEventListener('resize', onWindowResize);

const clock = new Three.Clock();

let t = 0;

loop();

function loop() {
    const dt = clock.getDelta(); 
    t += dt; // Incrémentation du temps 
    animeGeometry(geometry, t); 
    mesh.rotation.y = 0.1 * t;
    mesh.rotateY(0.1 * dt);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function computeGeometry() {
    const space = 4, nb = 100, amp = 0.1, fre = 1, pi2 = Math.PI * 2;

    const geometry = new Three.BufferGeometry();
    const positions = new Float32Array(nb * nb * 3);
    const colors = new Float32Array(nb * nb * 3);

    let k = 0;
    for (let i = 0; i < nb; ++i) {
        for (let j = 0; j < nb; ++j) {
            const x = (j / (nb - 1) - 0.5) * space;
            const z = (i / (nb - 1) - 0.5) * space;
            const y = amp * (Math.cos(x * pi2 * fre) + Math.sin(z * pi2 * fre));
            positions[3 * k + 0] = x;
            positions[3 * k + 1] = y;
            positions[3 * k + 2] = z;

            // Création d'un dégradé de bleu à violet (sans jaune au milieu)
            const color = new Three.Color();
            const gradient = (i / nb) * 0.8; // Ajustez les valeurs pour le dégradé souhaité
            color.setHSL(0.66 - gradient, 0.8, 0.5); // Ajustez la saturation à 0.8

            colors[3 * k + 0] = color.r;
            colors[3 * k + 1] = color.g;
            colors[3 * k + 2] = color.b;

            k++;
        }
    }

    geometry.setAttribute('position', new Three.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Three.BufferAttribute(colors, 3));
    return geometry;
}




function animeGeometry(geometry, progress) {
    const space = 4, nb = 100, amp = 0.1, fre = 1, pi2 = Math.PI * 2;

    let k = 0;
    for (let i = 0; i < nb; ++i) {
        for (let j = 0; j < nb; ++j) {
            const x = (j / (nb - 1) - 0.5) * space;
            const z = (i / (nb - 1) - 0.5) * space;
            const y = amp * 0.5 * (Math.cos((x + progress) * pi2 * fre) + Math.sin((z + progress) * pi2 * fre));
            geometry.attributes.position.setY(k, y);
            const intensity = (y / amp) / 2 + 0.3;
            geometry.attributes.color.setX(k, j / (nb - 1) * intensity);
            geometry.attributes.color.setY(k, i / (nb - 1) * intensity);
            k++;
        }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
}

