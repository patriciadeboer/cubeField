import * as THREE from 'three';
import Key from './keyboard';
import createClientSocket from 'socket.io-client';

let playersCubes = {};

const clientSocket = createClientSocket(window.location.origin);

clientSocket.on('connect', () => {
  clientSocket.emit('new-player');
});

clientSocket.on('establish-players', gameState => {
  for (const key in gameState.players) {
    if (gameState.players.hasOwnProperty(key)) {
      let player = gameState.players[key];
      if (key !== clientSocket.id) {
        createPlayerCubes(player);
      } else {
        createCubes(player);
      }
    }
  }
});

clientSocket.on('create-new-player', player => {
  console.log('New player joined:', player);
  createPlayerCubes(player);
});

clientSocket.on('delete-player', player => {
  //Remove Cube
  deletePlayerCube(player);
});

clientSocket.on('player-move-from-server', player => {
  movePlayerCube(player);
});

let renderer, scene, camera, cube1, container;

//INITIALIZE ALL 3D ELEMENTS
function init() {
  //initialize all the elements for the scene
  container = document.querySelector('#field');

  window.addEventListener('resize', onWindowResize);
  createScene();

  createCloud();
  createGround();
  createLights();
  createTrees();

  createCamera();

  createRenderer();

  //animate and move
  draw();
}

function draw() {
  renderer.render(scene, camera);
  requestAnimationFrame(draw);

  cameraPhysics();
  cubeMovement();
}

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');
}

function createCamera() {
  // Create a Camera
  const fov = 75; //Field of view
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1; // the near clipping plane
  const far = 10000; // the far clipping plane

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 400);

  scene.add(camera);
}

function createPlayerCubes(player) {
  const loader = new THREE.TextureLoader();
  let playersCubeMaterial = new THREE.MeshBasicMaterial({
    map: loader.load(`../public/imgs/animal${player.imgIdx}.jpg`),
  });

  let cubeSize = 30;
  let cubeQuality = 1;

  playersCubes[player.id] = new THREE.Mesh(
    new THREE.BoxGeometry(
      cubeSize,
      cubeSize,
      cubeSize,
      cubeQuality,
      cubeQuality,
      cubeQuality
    ),

    playersCubeMaterial
  );

  scene.add(playersCubes[player.id]);
  playersCubes[player.id].receiveShadow = true;
  playersCubes[player.id].castShadow = true;
  playersCubes[player.id].position.x = player.cube.x;
  playersCubes[player.id].position.z = player.cube.z;
  playersCubes[player.id].rotation.x = Math.PI / 2;
}

function createCubes(player) {
  const loader = new THREE.TextureLoader();

  let cube1Material = new THREE.MeshBasicMaterial({
    map: loader.load(`../public/imgs/animal${player.imgIdx}.jpg`),
  });

  let cubeSize = 30;
  let cubeQuality = 1;

  cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(
      cubeSize,
      cubeSize,
      cubeSize,
      cubeQuality,
      cubeQuality,
      cubeQuality
    ),

    cube1Material
  );

  scene.add(cube1);
  cube1.receiveShadow = true;
  cube1.castShadow = true;
  cube1.position.x = player.cube.x;
  cube1.position.z = player.cube.z;
}

function movePlayerCube(player) {
  playersCubes[player.id].position.x = player.cube.x;
  playersCubes[player.id].position.y = player.cube.y;
  playersCubes[player.id].position.z = player.cube.z;
}

function deletePlayerCube(player) {
  scene.remove(playersCubes[player.id]);
}

function createGround() {
  let grassMaterial = new THREE.MeshLambertMaterial({
    color: 'green',
  });

  let grass = new THREE.Mesh(
    new THREE.CubeGeometry(500, 500, 50, 15, 15, 1),

    grassMaterial
  );
  grass.position.z = -51;
  scene.add(grass);
  grass.castShadow = true;
  grass.receiveShadow = true;

  // create the ground's material
  let groundMaterial = new THREE.MeshLambertMaterial({
    color: 'sienna',
  });

  let ground = new THREE.Mesh(
    new THREE.CubeGeometry(1000, 1000, 3, 1, 1, 1),

    groundMaterial
  );
  // set ground to arbitrary z position to best show off shadowing
  ground.position.z = -50;
  ground.receiveShadow = true;
  scene.add(ground);
}

function createCloud() {
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.Geometry();

    const tuft1 = new THREE.SphereGeometry(15, 70, 80);
    tuft1.translate(0, -20, 0);
    geo.merge(tuft1);

    const tuft2 = new THREE.SphereGeometry(15, 70, 80);
    tuft2.translate(0, 20, 0);
    geo.merge(tuft2);

    const tuft3 = new THREE.SphereGeometry(20, 70, 80);
    tuft3.translate(0, 0, 0);
    geo.merge(tuft3);

    const cloud = new THREE.Mesh(
      geo,
      new THREE.MeshLambertMaterial({
        color: 'white',
        flatShading: true,
      })
    );

    const y = [0, 200, -200];
    scene.add(cloud);
    cloud.receiveShadow = true;
    cloud.castShadow = true;
    cloud.position.x = 200;
    cloud.position.y = y[i];
    cloud.position.z = 100 + Math.floor(Math.random() * 50);
  }
}

function createTrees() {
  for (let i = 0; i < 11; i++) {
    let x = [100, 200, -180, -120, -200, -175, 8, 90, -70, -200];
    let y = [-90, 200, -215, 100, 0, 150, -10, 80, -200, -50];
    let geometry = new THREE.CylinderGeometry(4, 6, 20, 20);
    // let material = new THREE.MeshBasicMaterial({ color: 0x654321});
    let material = new THREE.MeshLambertMaterial({
      color: 0x654321,
      // flatShading: true,
    });

    // let x = Math.floor(Math.random() * 600) - 300;
    // let y = Math.floor(Math.random() * 600) - 300;

    let cylinder = new THREE.Mesh(geometry, material);
    // cylinder.position.z=50;
    // cylinder.translate(0,90,90)
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.x = x[i];
    cylinder.position.y = y[i];
    cylinder.position.z = -20;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);

    let geometrySphere = new THREE.SphereGeometry(15, 10, 10);
    let treeTop = new THREE.MeshBasicMaterial({ color: 0x32cd32 });
    let sphere = new THREE.Mesh(geometrySphere, treeTop);
    sphere.position.z = -2;
    sphere.position.x = x[i];
    sphere.position.y = y[i];
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
  }
}

function createLights() {
  let spotLight = new THREE.SpotLight(0xf8d898);
  spotLight.position.set(0, 0, 460);
  spotLight.intensity = 10;
  spotLight.shadowDarkness = 0.2;
  spotLight.shadowCameraVisible = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.castShadow = true;
  scene.add(spotLight);

  const intensity = 2;
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const hemisphereLight = new THREE.HemisphereLight(
    skyColor,
    groundColor,
    intensity
  );
  scene.add(hemisphereLight);
}

function createRenderer() {
  let canvas = document.getElementById('field');

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.physicallyCorrectLights = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  canvas.appendChild(renderer.domElement);
}

function cubeMovement() {
  // move left
  if (Key.isDown(37)) {
    cube1.position.y += 1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
        z: cube1.position.z,
      },
    });
  } else if (Key.isDown(39)) {
    cube1.position.y += -1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
        z: cube1.position.z,
      },
    });
  } else if (Key.isDown(38)) {
    cube1.position.x += 1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
        z: cube1.position.z,
      },
    });
  } else if (Key.isDown(40)) {
    cube1.position.x += -1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
        z: cube1.position.z,
      },
    });
  } else if (Key.isDown(Key.SPACE)) {
    cube1.position.z += -1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
        z: cube1.position.z,
      },
    });
  } else if (Key.isDown(Key.SHIFT)) {
    cube1.position.z += 1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
        z: cube1.position.z,
      },
    });
  }
  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
}

//  camera movement and positioning
function cameraPhysics() {
  // move to behind the player's cube
  camera.position.x = cube1.position.x - 100;
  camera.position.y += (cube1.position.y - camera.position.y) * 0.05;
  camera.position.z = cube1.position.z + 100 + 0.04 * cube1.position.x;

  // rotate to face towards the opponent
  camera.rotation.x = (-0.01 * Math.PI) / 180;
  camera.rotation.y = (-60 * Math.PI) / 180;
  camera.rotation.z = (-90 * Math.PI) / 180;
}

function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);
  console.log('You resized the browser window!');
}

init();
