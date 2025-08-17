import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

// --- renderer / scene / camera ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e12);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(6, 5, 8);

// --- controls ---
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

const tcontrols = new TransformControls(camera, renderer.domElement);
tcontrols.setSize(0.9);
scene.add(tcontrols);
tcontrols.addEventListener('dragging-changed', (e) => { orbit.enabled = !e.value; });

// --- lights / helpers ---
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(3, 5, 2);
scene.add(dir);

scene.add(new THREE.GridHelper(20, 20, 0x444444, 0x222222));
const axes = new THREE.AxesHelper(1.5);
axes.position.set(-9.5, 0.01, -9.5);
scene.add(axes);

// --- editor state ---
const POINT_RADIUS = 0.12;
const points = [];
let selected = null;

const pointGeom = new THREE.SphereGeometry(POINT_RADIUS, 16, 16);
const pointMat = new THREE.MeshStandardMaterial({ color: 0x7aa2ff, roughness: 0.4, metalness: 0.1 });

const selectionOutlineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const statusEl = document.getElementById('status');

// --- UI ---
const btnAdd = document.getElementById('add-point');
const btnDel = document.getElementById('delete-point');
const onUI = (e) => e.target && e.target.closest && e.target.closest('#ui');

btnAdd.addEventListener('click', (e) => { e.stopPropagation(); /* keep from reaching window */
    addPoint(new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(6),
        THREE.MathUtils.randFloat(0, 3),
        THREE.MathUtils.randFloatSpread(6)
    ));
});

btnDel.addEventListener('click', (e) => { e.stopPropagation(); deleteSelected(); });

btnDel.onclick = () => deleteSelected();

// invisible ground plane to click-add at y=0
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshBasicMaterial({ visible: false })
);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

// --- functions ---
function addPoint(pos) {
    const mesh = new THREE.Mesh(pointGeom, pointMat.clone());
    mesh.position.copy(pos);
    mesh.userData.type = 'point';
    scene.add(mesh);
    points.push(mesh);
    select(mesh);
    setStatus(`Added point @ ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
}

function select(obj) {
    tcontrols.detach();
    selected = null;

    // remove previous outline
    scene.traverse(o => { if (o.userData && o.userData.__selectionOutline) scene.remove(o); });

    if (obj && obj.userData?.type === 'point') {
        selected = obj;
        tcontrols.attach(obj);

        const outline = new THREE.Mesh(pointGeom, selectionOutlineMat);
        outline.position.copy(obj.position);
        outline.scale.setScalar(1.5);
        outline.userData.__selectionOutline = true;
        scene.add(outline);

        const sync = () => outline.position.copy(obj.position);
        tcontrols.addEventListener('change', sync);
        const cleanup = () => {
            tcontrols.removeEventListener('change', sync);
            tcontrols.removeEventListener('dragging-changed', cleanup);
        };
        tcontrols.addEventListener('dragging-changed', cleanup);

        setStatus('Selected point');
    } else {
        setStatus('No selection');
    }
}

function clearSelection() {
    tcontrols.detach();
    // remove any selection outline meshes
    const toRemove = [];
    scene.traverse((o) => {
        if (o.userData && o.userData.__selectionOutline) toRemove.push(o);
    });
    toRemove.forEach((o) => scene.remove(o));
    selected = null;
    setStatus('No selection');
}

function deleteSelected() {
    if (!selected) return;
    const idx = points.indexOf(selected);
    if (idx >= 0) points.splice(idx, 1);
    scene.remove(selected);
    clearSelection(); // <-- ensure gizmo + outline are gone
    setStatus('Deleted point');
}

function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

// picking: click point to select, click ground to add at hit
function onPointerDown(evt) {
    if (onUI(evt)) return;            // <-- ignore clicks on the toolbar

    pointer.x = (evt.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(points, false);
    if (hits.length) {
        select(hits[0].object);
    } else {
        const groundHit = raycaster.intersectObject(plane, false)[0];
        if (groundHit) addPoint(groundHit.point.clone().setY(Math.max(0, groundHit.point.y)));
        else select(null);
    }
}

window.addEventListener('pointerdown', onPointerDown);

// resize + render loop
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function tick() {
    orbit.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}
tick();

// starter points
addPoint(new THREE.Vector3(0, 0.5, 0));
select(null);

// keyboard delete/backspace
window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
});
