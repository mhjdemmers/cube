import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Cube {
  constructor(initialStickers) {
    this.stickers = structuredClone(initialStickers);
  }

  static clockwise(face) {
    return [
      [face[2][0], face[1][0], face[0][0]],
      [face[2][1], face[1][1], face[0][1]],
      [face[2][2], face[1][2], face[0][2]],
    ];
  }

  static antiClockwise(face) {
    return [
      [face[0][2], face[1][2], face[2][2]],
      [face[0][1], face[1][1], face[2][1]],
      [face[0][0], face[1][0], face[2][0]],
    ];
  }

  static rotate180(face) {
    return face.map(r => [...r]).reverse().map(row => row.reverse());
  }

  rotateX() {
    let [R, L, U, D, F, B] = this.stickers;

    const R1 = Cube.clockwise(R);
    const L1 = Cube.antiClockwise(L);

    const U1 = F;
    const D1 = Cube.rotate180(B); 
    const F1 = D;
    const B1 = Cube.rotate180(U);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateXPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const R1 = Cube.antiClockwise(R);
    const L1 = Cube.clockwise(L);

    const U1 = B;
    const D1 = Cube.rotate180(F);
    const F1 = U;
    const B1 = Cube.rotate180(D);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }
}

class CubeRenderer {
  constructor(scene, size, colorMap) {
    this.scene = scene;
    this.size = size;
    this.colorMap = colorMap;

    this.cubieMeshes = [];
  }

  stickerToXYZ(face, row, col) {
    const R = 0, L = 1, U = 2, D = 3, F = 4, B = 5;
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
    }
  }

  stickersToCube(stickerArray) {
    const cube = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => ({ stickers: {} }))
      )
    );

    for (let face = 0; face < 6; face++) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const { x, y, z } = this.stickerToXYZ(face, row, col);

          cube[x][y][z].stickers[face] = stickerArray[face][row][col];
        }
      }
    }
    return cube;
  }

  makeCubieMesh(cubie) {
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);

    const base = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const materials = Array.from({ length: 6 }, () => base.clone());

    for (const [face, colorName] of Object.entries(cubie.stickers)) {
      materials[face].color.set(this.colorMap[colorName]);
    }

    return new THREE.Mesh(geometry, materials);
  }

  clear() {
    for (const m of this.cubieMeshes) this.scene.remove(m);
    this.cubieMeshes = [];
  }

  render(stickerState) {
    this.clear();

    const cube = this.stickersToCube(stickerState);

    for (let x = 0; x <= 2; x++) {
      for (let y = 0; y <= 2; y++) {
        for (let z = 0; z <= 2; z++) {
          const cubie = cube[x][y][z];
          const mesh = this.makeCubieMesh(cubie);
          mesh.position.set(
            (x - 1) * this.size * 1.1,
            (y - 1) * this.size * 1.1,
            (z - 1) * this.size * 1.1
          );
          this.scene.add(mesh);
          this.cubieMeshes.push(mesh);
        }
      }
    }
  }
}


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

  const colorMap = {
    green: 0x00ff00,
    blue: 0x0000ff,
    white: 0xffffff,
    yellow: 0xffff00,
    orange: 0xff8800,
    red: 0xff0000,
  };

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

  const cube = new Cube(stickerArray);

  const cubeRenderer = new CubeRenderer(scene, 10, colorMap);
  cubeRenderer.render(cube.stickers);

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

  const rotateXBtn = document.getElementById("rotateXBtn");
  rotateXBtn.addEventListener("click", () => {
    cube.rotateX();
    cubeRenderer.render(cube.stickers);
  });

  const rotateXPrimeBtn = document.getElementById("rotateXPrimeBtn");
  rotateXPrimeBtn.addEventListener("click", () => {
    cube.rotateXPrime();
    cubeRenderer.render(cube.stickers);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "x") {
      cube.rotateX();
      cubeRenderer.render(cube.stickers);
    } else if (e.key === "X") {
      cube.rotateXPrime();
      cubeRenderer.render(cube.stickers);
    }
  });
  requestAnimationFrame(render);
}

main();
