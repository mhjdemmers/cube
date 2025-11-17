import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    camera.position.z = 150;

    const controls = new OrbitControls( camera, canvas );
    controls.target.set( 0,0,0 );
    controls.update();
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);
    
    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const objects = [];
    const spread = 11;

    function addObject(x, y, z, obj) {
        obj.position.x = x * spread;
        obj.position.y = y * spread;
        obj.position.z = z * spread;

        scene.add(obj);
        objects.push(obj);
    }

    function createMaterial() {
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
        });

        const hue = Math.random();
        const saturation = 1;
        const luminance = .5;
        material.color.setHSL(hue, saturation, luminance);

        return material;
    }

    function addSolidGeometry(x, y, z, geometry) {
        const mesh = new THREE.Mesh(geometry, createMaterial());
        console.log("yeet");
        addObject(x, y, z, mesh);
    }

    function addLineGeometry(x, y, z, geometry) {
        const material = new THREE.LineBasicMaterial( { color: 0x000000 });
        const mesh = new THREE.LineSegments( geometry, material );
        addObject(x, y, z, mesh);
    }

    {
        const width = 10;
        const height = 10;
        const depth = 10;
       
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    addSolidGeometry(x, y, z, new THREE.BoxGeometry(width, height, depth));
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

        // objects.forEach((obj, ndx) => {
        //     const speed = 1 + ndx * .1;
        //     const rot = time * speed;
        //     obj.rotation.x = rot;
        //     obj.rotation.y = rot;
        // });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();