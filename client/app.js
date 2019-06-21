import * as THREE from 'three';
import Key from './keyboard';
import createClientSocket from 'socket.io-client';

// import {GLTFLoader} from 'three'
import { GLTFLoader } from 'three-gltf-loader';

const clientSocket = createClientSocket(window.location.origin);
const cubeField = window.location.pathname;

clientSocket.on('connect', () => {
  console.log('Connected to server!');
  clientSocket.emit('newPlayer');
});

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
  createCubes();
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

function createCubes() {
  // for (let i = 0; i < 3; i++) {
  const loader = new THREE.TextureLoader();

  let imgIdx = Math.floor(Math.random() * 12) + 1;
  let cube1Material = new THREE.MeshBasicMaterial({
    map: loader.load(`../public/imgs/animal${imgIdx}.jpg`),
  });
  console.log(imgIdx);
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
  cube1.position.x = -170;
  cube1.position.z = cubeDepth;
  // }
  // // let cube1Material = new THREE.MeshBasicMaterial({ color: 'coral' });
  // let cube1Material = new THREE.MeshBasicMaterial({
  //   map: loader.load('../public/imgs/patricia.jpg'),
  // });
  // let cube2Material = new THREE.MeshBasicMaterial({
  //   map: loader.load('../public/imgs/animal1.jpg'),
  // });

  // const materials = [
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load('../public/imgs/patricia.jpg'),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load('../public/imgs/patricia.jpg'),
  //   }),
  //   new THREE.MeshBasicMaterial({ color: 'black' }),
  //   new THREE.MeshBasicMaterial({ color: 'black' }),
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load('../public/imgs/patricia.jpg'),
  //   }),
  //   new THREE.MeshBasicMaterial({
  //     map: loader.load('../public/imgs/patricia.jpg'),
  //   }),
  // ];

  // cubeSize = 30;
  // cubeHeight = 30;
  // cubeDepth = 30;
  // cubeQuality = 1;

  // cube1 = new THREE.Mesh(
  //   new THREE.CubeGeometry(
  //     cubeSize,
  //     cubeSize,
  //     cubeSize,
  //     cubeQuality,
  //     cubeQuality,
  //     cubeQuality
  //   ),

  //   materials
  // );

  // scene.add(cube1);
  // cube1.receiveShadow = true;
  // cube1.castShadow = true;
  // cube1.position.x = -170;
  // cube1.position.z = cubeDepth;

  imgIdx = Math.floor(Math.random() * 12) + 1;
  let cube2Material = new THREE.MeshBasicMaterial({
    map: loader.load(`../public/imgs/animal${imgIdx}.jpg`),
  });
  cube2 = new THREE.Mesh(
    new THREE.CubeGeometry(
      cubeSize,
      cubeSize,
      cubeSize,
      cubeQuality,
      cubeQuality,
      cubeQuality
    ),

    cube2Material
  );
  scene.add(cube2);
  cube2.receiveShadow = true;
  cube2.castShadow = true;
  cube2.position.z = cubeDepth;
}

function createGround() {
  let tableMaterial = new THREE.MeshLambertMaterial({
    color: 'green',
  });

  let table = new THREE.Mesh(
    new THREE.CubeGeometry(
      500, // this creates the feel of a billiards table, with a lining
      500,
      20, // an arbitrary depth, the camera can't see much of it anyway
      15,
      15,
      1
    ),

    tableMaterial
  );
  table.position.z = -51; // we sink the table into the ground
  scene.add(table);
  table.receiveShadow = true;

  // let terrain = new THREE.Mesh(
  //   // new THREE.CubeGeometry(500, 500, 100, 1, 1, 1),
  //   new THREE.PlaneGeometry(0, 0, 500, 500),
  //   new THREE.MeshStandardMaterial({
  //     color: 'green',
  //     flatShading: true,
  //     metalness: 0,
  //     vertexColors: THREE.FaceColors,
  //   })
  // );

  // for (let i = 0; i < terrain.geometry.vertices.length; i++) {
  //   terrain.geometry.vertices[i].setZ(Math.random() * 0.5+50);
  // }
  // terrain.position.z = -51; // align terrain with ground
  // scene.add(terrain);
  // terrain.receiveShadow = true;

  // create the ground's material
  let groundMaterial = new THREE.MeshLambertMaterial({
    color: 0x888888,
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

function loadModels() {
  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = (gltf, position) => {
    const model = gltf.scene.children[0];
    model.position.copy(position);

    const animation = gltf.animations[0];

    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(model);
  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3(0, 0, 2.5);
  loader.load(
    'models/Parrot.glb',
    gltf => onLoad(gltf, parrotPosition),
    onProgress,
    onError
  );

  const flamingoPosition = new THREE.Vector3(7.5, 0, -10);
  loader.load(
    'models/Flamingo.glb',
    gltf => onLoad(gltf, flamingoPosition),
    onProgress,
    onError
  );

  const storkPosition = new THREE.Vector3(0, -2.5, -10);
  loader.load(
    'models/Stork.glb',
    gltf => onLoad(gltf, storkPosition),
    onProgress,
    onError
  );
}

function draw() {
  // draw THREE.JS scene
  renderer.render(scene, camera);
  // loop draw function call
  requestAnimationFrame(draw);

  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  cube2.rotation.x += 0.015;
  cube2.rotation.y += 0.015;

  cameraPhysics();
  cubeMovement();
  cube2Movement();
}

function cubeMovement() {
  // move left
  if (Key.isDown(37)) {
    cube1.position.y += 1;
  } else if (Key.isDown(39)) {
    cube1.position.y += -1;
  } else if (Key.isDown(38)) {
    cube1.position.x += 1;
  } else if (Key.isDown(40)) {
    cube1.position.x += -1;
  }
}

function cube2Movement() {
  // move left
  if (Key.isDown(Key.A)) {
    cube2.position.y += 1;
  } else if (Key.isDown(Key.D)) {
    cube2.position.y += -1;
  } else if (Key.isDown(Key.W)) {
    cube2.position.x += 1;
  } else if (Key.isDown(Key.S)) {
    cube2.position.x += -1;
  }
}

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
