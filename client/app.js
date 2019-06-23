/* eslint-disable max-statements */
/* eslint-disable guard-for-in */
import * as THREE from 'three';
import Key from './keyboard';
import createClientSocket from 'socket.io-client';
// import { Socket } from 'net';

// let gameState = {};
let playersCubes = {};
// import {GLTFLoader} from 'three'
// import { GLTFLoader } from 'three-gltf-loader';

const clientSocket = createClientSocket(window.location.origin);
const cubeField = window.location.pathname;

clientSocket.on('connect', () => {
  console.log('Connected to server! client Socket: ', clientSocket.id);
  clientSocket.emit('new-player');
});

// clientSocket.on('update', updatedGameState => {
//   gameState = updatedGameState;
//   return gameState;
// });

clientSocket.on('establish-players', gameState => {
  // console.log('gameState in establish players: ', gameState);
  for (const key in gameState.players) {
    let player = gameState.players[key];
    // console.log('player', player);
    // console.log('key', key);
    // console.log(player.cube1.x);
    if (key !== clientSocket.id) {
      createPlayerCubes(player);
    } else {
      createCubes(player);
    }
  }
});

clientSocket.on('create-new-player', player => {
  console.log('New player joined:', player);
  // console.log(gameState);
  createPlayerCubes(player);

  // clientSocket.emit('new-player');
});

clientSocket.on('delete-player', player => {
  //Remove Cube
  console.log('delete player: ', player);
  // console.log(gameState);
  deletePlayerCube(player);
});

clientSocket.on('player-move-from-server', player => {
  console.log('movement from server:', player);
  movePlayerCube(player)
});

// clientSocket.on('state', (gameState)=>{
//   // for(let player in gameState.players){
//     // console.log(gameState)
//     // createCubes(gameState.players[player])
//   // }
//   console.log(gameState)
// })
// clientSocket.on('move-from-server'){

// }

// clientSocket.on('move',)

let renderer, scene, camera, pointLight, spotLight;

let cubeSize, cubeWidth, cubeHeight, cubeDepth, cubeQuality;

let cube1, cube2;

let container;
let renderer2;
let mesh;

function init() {
  //initialize all the elements for the scene
  container = document.querySelector('#field');
  createScene();
  createCamera();
  // createCubes();
  createCloud();
  createGround();
  createLights();
  // loadModels()
  createRenderer();

  //animate and move
  draw();
}
// container = document.querySelector('#field');

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
  console.log('In createPlayerCubes, create this player:', player);
  const loader = new THREE.TextureLoader();
  let playersCubeMaterial = new THREE.MeshBasicMaterial({
    map: loader.load(`../public/imgs/animal${player.imgIdx}.jpg`),
  });

  cubeSize = 30;
  cubeHeight = 30;
  cubeDepth = 30;
  cubeQuality = 1;

  playersCubes[player.id] = new THREE.Mesh(
    new THREE.CubeGeometry(
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
  console.log(playersCubes);
}

function createCubes(player) {
  const loader = new THREE.TextureLoader();

  let cube1Material = new THREE.MeshBasicMaterial({
    map: loader.load(`../public/imgs/animal${player.imgIdx}.jpg`),
  });
  // const materials = [
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load(`../public/imgs/animal${imgIdx}.jpg`),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load(`../public/imgs/animal${imgIdx}.jpg`),
  //   }),
  //   new THREE.MeshBasicMaterial({ color: 'black' }),
  //   new THREE.MeshBasicMaterial({ color: 'black' }),
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load(`../public/imgs/animal${imgIdx}.jpg`),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load(`../public/imgs/animal${imgIdx}.jpg`),
  //   }),
  // ];
  cubeSize = 30;
  cubeHeight = 30;
  cubeDepth = 30;
  cubeQuality = 1;

  cube1 = new THREE.Mesh(
    new THREE.CubeGeometry(
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

function createGround() {
  let grassMaterial = new THREE.MeshLambertMaterial({
    color: 'green',
  });

  let grass = new THREE.Mesh(
    new THREE.CubeGeometry(
      500,
      500,
      50, // depth to show 3D
      15,
      15,
      1
    ),

    grassMaterial
  );
  grass.position.z = -51; // we sink the grass into the ground
  scene.add(grass);
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
  ground.position.z = -132;
  ground.receiveShadow = true;
  scene.add(ground);
}

function movePlayerCube(player){
  playersCubes[player.id].position.x = player.cube.x
  playersCubes[player.id].position.y = player.cube.y
}

function deletePlayerCube(player) {
  scene.remove(playersCubes[player.id]);
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
function createLights() {
  // // create a point light
  // // pointLight = new THREE.PointLight(0xf8d898);

  // // // set its position
  // // pointLight.position.x = -1000;
  // // pointLight.position.y = 0;
  // // pointLight.position.z = 1000;
  // // pointLight.intensity = 2.9;
  // // pointLight.distance = 10000;
  // // // add to the scene
  // // scene.add(pointLight);

  // // add a spot light
  // // this is important for casting shadows
  // spotLight = new THREE.SpotLight(0xf8d898);
  // spotLight.position.set(0, 0, 460);
  // spotLight.intensity = 10;
  // spotLight.shadowDarkness = .5;
  // spotLight.shadowCameraVisible=true
  // spotLight.castShadow = true;
  // scene.add(spotLight);

  // // const light2 = new THREE.DirectionalLight(0xffffff, 5.0);

  // // // move the light back and up a bit
  // // light2.position.set(10, 10, 10);

  // // // remember to add the light to the scene
  // // scene.add(light);
  // //Create a PointLight and turn on shadows for the light
  // let light = new THREE.DirectionalLight(0xffffff, 1, 100);
  // light.position.set(0, 1000, 1000);
  // light.castShadow = true; // default false
  // scene.add(light);

  // //Set up shadow properties for the light
  // light.shadow.mapSize.width = 512; // default
  // light.shadow.mapSize.height = 512; // default
  // light.shadow.camera.near = 0.5; // default
  // light.shadow.camera.far = 500; // default
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const intensity = 2;
  const light2 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light2);

  const color = 0xffffff;
  // const intensity2 = 1;
  const light = new THREE.DirectionalLight(0xffffff, intensity);
  light.position.set(0, 10, 5);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);
}

function createRenderer() {
  let canvas = document.getElementById('field');

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  canvas.appendChild(renderer.domElement);
}

const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function draw() {
  // console.log('gamestate in draw', gameState)
  // draw THREE.JS scene
  renderer.render(scene, camera);
  // loop draw function call
  requestAnimationFrame(draw);

  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;

  // console.log('in draw GameState:', gameState)
  cameraPhysics();
  cubeMovement();
}

function cubeMovement() {
  // move left
  if (Key.isDown(37)) {
    cube1.position.y += 1;
    playerMovement.left = true;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
      },
    });
  } else if (Key.isDown(39)) {
    cube1.position.y += -1;
    playerMovement.right = true;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
      },
    });
  } else if (Key.isDown(38)) {
    cube1.position.x += 1;
    playerMovement.up = true;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
      },
    });
  } else if (Key.isDown(40)) {
    playerMovement.down = true;
    cube1.position.x += -1;
    clientSocket.emit('playerMovement', {
      id: clientSocket.id,
      cube: {
        x: cube1.position.x,
        y: cube1.position.y,
      },
    });
  }
}

// function cube2Movement() {
//   // move left
//   if (Key.isDown(Key.A)) {
//     cube2.position.y += 1;
//   } else if (Key.isDown(Key.D)) {
//     cube2.position.y += -1;
//   } else if (Key.isDown(Key.W)) {
//     cube2.position.x += 1;
//   } else if (Key.isDown(Key.S)) {
//     cube2.position.x += -1;
//   }
// }

// Handles camera and lighting logic
function cameraPhysics() {
  // we can easily notice shadows if we dynamically move lights during the game
  // spotLight.position.x = cube2.position.x * 2;
  // spotLight.position.y = cube2.position.y * 2;

  // move to behind the player's cube
  camera.position.x = cube1.position.x - 100;
  camera.position.y += (cube1.position.y - camera.position.y) * 0.05;
  camera.position.z = cube1.position.z + 100 + 0.04 * cube1.position.x;

  // rotate to face towards the opponent
  camera.rotation.x = (-0.01 * Math.PI) / 180;
  camera.rotation.y = (-60 * Math.PI) / 180;
  camera.rotation.z = (-90 * Math.PI) / 180;
}

init();
