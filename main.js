import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);

  // Camera
  const fov = 40;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 150;
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  }

  const R = 0; // +X
  const L = 1; // -X
  const U = 2; // +Y
  const D = 3; // -Y
  const F = 4; // +Z
  const B = 5; // -Z

  function stickerToXYZ(face, row, col) {
    switch (face) {
      case R:
        return { x: 2, y: row, z: col };

      case L:
        return { x: 0, y: row, z: 2 - col };

      case U:
        return { x: col, y: 2, z: 2 - row };

      case D:
        return { x: col, y: 0, z: row };

      case F:
        return { x: col, y: row, z: 2 };

      case B:
        return { x: 2 - col, y: row, z: 0 };

      default:
        throw new Error("Invalid face index");
    }
  }

  function stickersToCube(stickerArray) {
    const cube = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => ({ stickers: {} }))
      )
    );

    for (let face = 0; face < 6; face++) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const { x, y, z } = stickerToXYZ(face, row, col);

          cube[x][y][z].stickers[face] = stickerArray[face][row][col];
        }
      }
    }
    return cube;
  }

  const colorMap = {
    green: 0x00ff00,
    blue: 0x0000ff,
    white: 0xffffff,
    yellow: 0xffff00,
    orange: 0xff8800,
    red: 0xff0000,
  };

  const baseMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
    new THREE.MeshPhongMaterial({ color: 0x000000 }),
  ];

  function makeCubieMesh(cubie, size) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const materials = baseMaterials.map((mat) => mat.clone());

    for (const [face, colorName] of Object.entries(cubie.stickers)) {
      materials[face].color.set(colorMap[colorName]);
    }

    return new THREE.Mesh(geometry, materials);
  }

  function clockwise(face) {
    let newFace = [
      [face[2][1], face[1][0], face[0][0]],
      [face[2][1], face[1][1], face[0][1]],
      [face[2][2], face[1][2], face[0][2]]
    ]
    return newFace;
  }

  function antiClockwise(face) {
    let newFace = [
      [face[0][2], face[1][2], face[2][2]],
      [face[0][1], face[1][1], face[2][1]],
      [face[0][0], face[1][0], face[2][0]]
    ]
    return newFace;
  }

  function rotationX(stickers) {
    let [R, L, U, D, F, B] = stickers;
    
  let R1 = clockwise(R);
  let L1 = antiClockwise(L);

    let U1 = F;
    let F1 = D;
    let D1 = B.map(r => [...r]).reverse(); // B turned 180
    let B1 = U.map(r => [...r]).reverse(); // U turned 180

    return [R1, L1, U1, D1, F1, B1];
  }

  // Create 3*3*3 cube
  const stickerArray = [
    [
      ["green", "green", "green"],
      ["green", "green", "green"],
      ["green", "green", "green"],
    ], // right
    [
      ["blue", "blue", "blue"],
      ["blue", "blue", "blue"],
      ["blue", "blue", "blue"],
    ], // left
    [
      ["white", "white", "white"],
      ["white", "white", "white"],
      ["white", "white", "white"],
    ], // up
    [
      ["yellow", "yellow", "yellow"],
      ["yellow", "yellow", "yellow"],
      ["yellow", "yellow", "yellow"],
    ], // down
    [
      ["orange", "orange", "orange"],
      ["orange", "orange", "orange"],
      ["orange", "orange", "orange"],
    ], // front
    [
      ["red", "red", "red"],
      ["red", "red", "red"],
      ["red", "red", "red"],
    ], // back
  ];

  const cube = stickersToCube(stickerArray);

  const size = 10;

  for (let x = 0; x <= 2; x++) {
    for (let y = 0; y <= 2; y++) {
      for (let z = 0; z <= 2; z++) {
        const cubie = cube[x][y][z];
        const mesh = makeCubieMesh(cubie, size);
        mesh.position.set(
          (x - 1) * size * 1.1,
          (y - 1) * size * 1.1,
          (z - 1) * size * 1.1
        );
        scene.add(mesh);
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
