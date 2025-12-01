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

    const U1 = Cube.rotate180(B);
    const D1 = F;
    const F1 = U;
    const B1 = Cube.rotate180(D);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateY() {
    let [R, L, U, D, F, B] = this.stickers;

    const U1 = Cube.clockwise(U);
    const D1 = Cube.antiClockwise(D);

    const R1 = B;
    const L1 = F;
    const F1 = R;
    const B1 = L;

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateYPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const U1 = Cube.antiClockwise(U);
    const D1 = Cube.clockwise(D);

    const R1 = F;
    const L1 = B;
    const F1 = L;
    const B1 = R;

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateZ() {
    let [R, L, U, D, F, B] = this.stickers;

    const F1 = Cube.clockwise(F);
    const B1 = Cube.antiClockwise(B);

    const R1 = Cube.clockwise(U);
    const L1 = Cube.clockwise(D);
    const U1 = Cube.clockwise(L);
    const D1 = Cube.clockwise(R);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }
  
  rotateZPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const F1 = Cube.antiClockwise(F);
    const B1 = Cube.clockwise(B);

    const R1 = Cube.antiClockwise(D);
    const L1 = Cube.antiClockwise(U);
    const U1 = Cube.antiClockwise(R);
    const D1 = Cube.antiClockwise(L);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateR() {
    let [R, L, U, D, F, B] = this.stickers;

    const R1 = Cube.clockwise(R);
    const L1 = L;
    const U1 = U.map((row, i) => [row[0], row[1], F[i][2]]);
    const D1 = D.map((row, i) => [row[0], row[1], B[2 - i][0]]);
    const F1 = F.map((row, i) => [row[0], row[1], D[i][2]]);
    const B1 = B.map((row, i) => [U[2 - i][2], row[1], row[2]]);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateRPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const R1 = Cube.antiClockwise(R);
    const L1 = L;
    const U1 = U.map((row, i) => [row[0], row[1], B[2 - i][0]]);
    const D1 = D.map((row, i) => [row[0], row[1], F[i][2]]);
    const F1 = F.map((row, i) => [row[0], row[1], U[i][2]]);
    const B1 = B.map((row, i) => [D[2 - i][2], row[1], row[2]]);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }

  rotateL() {
    let [R, L, U, D, F, B] = this.stickers;

    const R1 = R;
    const L1 = Cube.clockwise(L);
    const U1 = U.map((row, i) => [B[2 - i][2], row[1], row[2]]);
    const D1 = D.map((row, i) => [F[i][0], row[1], row[2]]);
    const F1 = F.map((row, i) => [U[i][0], row[1], row[2]]);
    const B1 = B.map((row, i) => [row[0], row[1], D[2 - i][0]]);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  } 
  
  rotateLPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const R1 = R;
    const L1 = Cube.antiClockwise(L);
    const U1 = U.map((row, i) => [F[i][0], row[1], row[2]]);
    const D1 = D.map((row, i) => [B[2 - i][2], row[1], row[2]]);
    const F1 = F.map((row, i) => [D[i][0], row[1], row[2]]);
    const B1 = B.map((row, i) => [row[0], row[1], U[2 - i][0]]);

    this.stickers = [R1, L1, U1, D1, F1, B1];
  } 
  
  rotateU() {
    let [R, L, U, D, F, B] = this.stickers;

    const U1 = Cube.clockwise(U);
    const D1 = D;

    const R1 = [ [...B[0]], ...R.slice(1).map(row => [...row]) ];
    const L1 = [ [...F[0]], ...L.slice(1).map(row => [...row]) ];
    const F1 = [ [...R[0]], ...F.slice(1).map(row => [...row]) ];
    const B1 = [ [...L[0]], ...B.slice(1).map(row => [...row]) ];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }
  
  rotateUPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const U1 = Cube.antiClockwise(U);
    const D1 = D;

    const R1 = [ [...F[0]], ...R.slice(1).map(row => [...row]) ];
    const L1 = [ [...B[0]], ...L.slice(1).map(row => [...row]) ];
    const F1 = [ [...L[0]], ...F.slice(1).map(row => [...row]) ];
    const B1 = [ [...R[0]], ...B.slice(1).map(row => [...row]) ];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  } 
  
  rotateD() {
    let [R, L, U, D, F, B] = this.stickers;
    // console.log(this.stickers);

    const U1 = U;
    const D1 = Cube.clockwise(D);

    const R1 = [...R.slice(0, 2).map(row => [...row]),  [...F[2]]];
    const L1 = [ ...L.slice(0, 2).map(row => [...row]), [...B[2]] ];
    const F1 = [ ...F.slice(0, 2).map(row => [...row]), [...L[2]] ];
    const B1 = [ ...B.slice(0, 2).map(row => [...row]), [...R[2]] ];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }
  
  rotateDPrime() {
    let [R, L, U, D, F, B] = this.stickers;
    // console.log(this.stickers);

    const U1 = U;
    const D1 = Cube.antiClockwise(D);

    const R1 = [...R.slice(0, 2).map(row => [...row]),  [...B[2]]];
    const L1 = [ ...L.slice(0, 2).map(row => [...row]), [...F[2]] ];
    const F1 = [ ...F.slice(0, 2).map(row => [...row]), [...R[2]] ];
    const B1 = [ ...B.slice(0, 2).map(row => [...row]), [...L[2]] ];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  }
  
  rotateF() {
    let [R, L, U, D, F, B] = this.stickers;

    const F1 = Cube.clockwise(F)
    const B1 = B

    const R1 = R.map((row, i) => [U[2][i], row[1], row[2]]);
    const L1 = L.map((row, i) => [row[0], row[1], D[0][i]]);
    const U1 = [ ...U.slice(0, 2).map(row => [...row]), [L[2][2], L[1][2], L[0][2]]];
    const D1 = [ [R[2][0], R[1][0], R[0][0]], ...D.slice(1).map(row => [...row])];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  } 
  
  rotateFPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const F1 = Cube.antiClockwise(F)
    const B1 = B

    const R1 = R.map((row, i) => [D[0][2 - i], row[1], row[2]]);
    const L1 = L.map((row, i) => [row[0], row[1], U[2][2 - i]]);
    const U1 = [ ...U.slice(0, 2).map(row => [...row]), [R[0][0], R[1][0], R[2][0]]];
    const D1 = [ [L[0][2], L[1][2], L[2][2]], ...D.slice(1).map(row => [...row])];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  } 

  rotateB() {
    let [R, L, U, D, F, B] = this.stickers;

    const F1 = F
    const B1 = Cube.clockwise(B)

    const R1 = R.map((row, i) => [row[0], row[1], D[2][2 - i]]);
    const L1 = L.map((row, i) => [U[0][2 - i], row[1], row[2]]);
    const U1 = [ [R[0][2], R[1][2], R[2][2]], ...U.slice(1).map(row => [...row] ) ];
    const D1 = [ ...D.slice(0, 2).map(row => [...row]), [L[0][0], L[1][0], L[2][0]]];

    this.stickers = [R1, L1, U1, D1, F1, B1];
  } 
  
  rotateBPrime() {
    let [R, L, U, D, F, B] = this.stickers;

    const F1 = F;
    const B1 = Cube.antiClockwise(B);

    const R1 = R.map((row, i) => [row[0], row[1], U[0][i]]);
    const L1 = L.map((row, i) => [D[2][i], row[1], row[2]]);
    const U1 = [ [L[2][0], L[1][0], L[0][0]], ...U.slice(1).map(row => [...row]) ];
    const D1 = [ ...D.slice(0, 2).map(row => [...row]), [R[2][2], R[1][2], R[0][2]] ];

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
    const rowFromBottom = 2 - row;
    
    switch (face) {
      case R:
        return { x: 2, y: rowFromBottom, z: 2 - col };

      case L:
        return { x: 0, y: rowFromBottom, z: col };

      case U:
        return { x: col, y: 2, z: 2 - rowFromBottom };

      case D:
        return { x: col, y: 0, z: rowFromBottom };

      case F:
        return { x: col, y: rowFromBottom, z: 2 };

      case B:
        return { x: 2 - col, y: rowFromBottom, z: 0 };
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

  // const stickerArray = [
  //   [
  //     ["green", "green", "green"],
  //     ["green", "green", "green"],
  //     ["green", "green", "green"],
  //   ], // right
  //   [
  //     ["blue", "blue", "blue"],
  //     ["blue", "blue", "blue"],
  //     ["blue", "blue", "blue"],
  //   ], // left
  //   [
  //     ["white", "white", "red"],
  //     ["white", "white", "red"],
  //     ["white", "white", "red"],
  //   ], // up
  //   [
  //     ["yellow", "yellow", "orange"],
  //     ["yellow", "yellow", "orange"],
  //     ["yellow", "yellow", "orange"],
  //   ], // down
  //   [
  //     ["orange", "orange", "white"],
  //     ["orange", "orange", "white"],
  //     ["orange", "orange", "white"],
  //   ], // front
  //   [
  //     ["yellow", "red", "red"],
  //     ["yellow", "red", "red"],
  //     ["yellow", "red", "red"],
  //   ], // back
  // ];

  //   const stickerArray = [
  //   [
  //     ["red", "red", "red"],
  //     ["green", "green", "green"],
  //     ["green", "green", "green"],
  //   ], // right
  //   [
  //     ["orange", "orange", "orange"],
  //     ["blue", "blue", "blue"],
  //     ["blue", "blue", "blue"],
  //   ], // left
  //   [
  //     ["white", "white", "white"],
  //     ["white", "white", "white"],
  //     ["white", "white", "white"],
  //   ], // up
  //   [
  //     ["yellow", "yellow", "yellow"],
  //     ["yellow", "yellow", "yellow"],
  //     ["yellow", "yellow", "yellow"],
  //   ], // down
  //   [
  //     ["green", "green", "green"],
  //     ["orange", "orange", "orange"],
  //     ["orange", "orange", "orange"],
  //   ], // front
  //   [
  //     ["blue", "blue", "blue"],
  //     ["red", "red", "red"],
  //     ["red", "red", "red"],
  //   ], // back
  // ];

  //   const stickerArray = [
  //   [
  //     ["white", "green", "green"],
  //     ["white", "green", "green"],
  //     ["white", "green", "green"],
  //   ], // right
  //   [
  //     ["blue", "blue", "yellow"],
  //     ["blue", "blue", "yellow"],
  //     ["blue", "blue", "yellow"],
  //   ], // left
  //   [
  //     ["white", "white", "white"],
  //     ["white", "white", "white"],
  //     ["blue", "blue", "blue"],
  //   ], // up
  //   [
  //     ["green", "green", "green"],
  //     ["yellow", "yellow", "yellow"],
  //     ["yellow", "yellow", "yellow"],
  //   ], // down
  //   [
  //     ["orange", "orange", "orange"],
  //     ["orange", "orange", "orange"],
  //     ["orange", "orange", "orange"],
  //   ], // front
  //   [
  //     ["red", "red", "red"],
  //     ["red", "red", "red"],
  //     ["red", "red", "red"],
  //   ], // back
  // ];


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

  const rotateYBtn = document.getElementById("rotateYBtn");
  rotateYBtn.addEventListener("click", () => {
    cube.rotateY();
    cubeRenderer.render(cube.stickers);
  });

  const rotateYPrimeBtn = document.getElementById("rotateYPrimeBtn");
  rotateYPrimeBtn.addEventListener("click", () => {
    cube.rotateYPrime();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateZBtn = document.getElementById("rotateZBtn");
  rotateZBtn.addEventListener("click", () => {
    cube.rotateZ();
    cubeRenderer.render(cube.stickers);
  });

  const rotateZPrimeBtn = document.getElementById("rotateZPrimeBtn");
  rotateZPrimeBtn.addEventListener("click", () => {
    cube.rotateZPrime();
    cubeRenderer.render(cube.stickers);
  });

  const rotateRBtn = document.getElementById("rotateRBtn");
  rotateRBtn.addEventListener("click", () => {
    cube.rotateR();
    cubeRenderer.render(cube.stickers);
  });

  const rotateRPrimeBtn = document.getElementById("rotateRPrimeBtn");
  rotateRPrimeBtn.addEventListener("click", () => {
    cube.rotateRPrime();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateLBtn = document.getElementById("rotateLBtn");
  rotateLBtn.addEventListener("click", () => {
    cube.rotateL();
    cubeRenderer.render(cube.stickers);
  });

  const rotateLPrimeBtn = document.getElementById("rotateLPrimeBtn");
  rotateLPrimeBtn.addEventListener("click", () => {
    cube.rotateLPrime();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateUBtn = document.getElementById("rotateUBtn");
  rotateUBtn.addEventListener("click", () => {
    cube.rotateU();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateUPrimeBtn = document.getElementById("rotateUPrimeBtn");
  rotateUPrimeBtn.addEventListener("click", () => {
    cube.rotateUPrime();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateDBtn = document.getElementById("rotateDBtn");
  rotateDBtn.addEventListener("click", () => {
    cube.rotateD();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateDPrimeBtn = document.getElementById("rotateDPrimeBtn");
  rotateDPrimeBtn.addEventListener("click", () => {
    cube.rotateDPrime();
    cubeRenderer.render(cube.stickers);
  });

  const rotateFBtn = document.getElementById("rotateFBtn");
  rotateFBtn.addEventListener("click", () => {
    cube.rotateF();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateFPrimeBtn = document.getElementById("rotateFPrimeBtn");
  rotateFPrimeBtn.addEventListener("click", () => {
    cube.rotateFPrime();
    cubeRenderer.render(cube.stickers);
  });

  const rotateBBtn = document.getElementById("rotateBBtn");
  rotateBBtn.addEventListener("click", () => {
    cube.rotateB();
    cubeRenderer.render(cube.stickers);
  });
  
  const rotateBPrimeBtn = document.getElementById("rotateBPrimeBtn");
  rotateBPrimeBtn.addEventListener("click", () => {
    cube.rotateBPrime();
    cubeRenderer.render(cube.stickers);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "x") {
      cube.rotateX();
      cubeRenderer.render(cube.stickers);
    } else if (e.key === "X") {
      cube.rotateXPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="y") {
      cube.rotateY();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="Y") {
      cube.rotateYPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="z") {
      cube.rotateZ();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="Z") {
      cube.rotateZPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="r") {
      cube.rotateR();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="R") {
      cube.rotateRPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="l") {
      cube.rotateL();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="L") {
      cube.rotateLPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="u") {
      cube.rotateU();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="U") {
      cube.rotateUPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="d") {
      cube.rotateD();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="D") {
      cube.rotateDPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="f") {
      cube.rotateF();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="F") {
      cube.rotateFPrime();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="b") {
      cube.rotateB();
      cubeRenderer.render(cube.stickers);
    } else if (e.key ==="B") {
      cube.rotateBPrime();
      cubeRenderer.render(cube.stickers);
    }
  });
  requestAnimationFrame(render);
}

main();
