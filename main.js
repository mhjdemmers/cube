import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setPixelRatio(window.devicePixelRatio);

    // Camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 150;
    const controls = new OrbitControls( camera, canvas );
    controls.target.set( 0,0,0 );
    controls.update();
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    
    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    }

    // Helpers
    const addCubie = (x, y, z, size) => {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const materials = [
            new THREE.MeshPhongMaterial({ color: 'green' }),    // right
            new THREE.MeshPhongMaterial({ color: 'blue'}),      // left
            new THREE.MeshPhongMaterial({ color: 'white'}),     // top
            new THREE.MeshPhongMaterial({ color: 'yellow'}),    // bottom
            new THREE.MeshPhongMaterial({ color: 'orange'}),    // front
            new THREE.MeshPhongMaterial({ color: 'red'})        // back
        ]
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.x = x * size * 1.1;
        mesh.position.y = y * size * 1.1;
        mesh.position.z = z * size * 1.1;
        scene.add(mesh);
    }

    // Create 3*3*3 cube
    {
        const size = 10;
       
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    addCubie(x, y, z, size);
                }
            }
        }
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001; // time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();