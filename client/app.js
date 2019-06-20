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
  createRenderer();

  //animate and move
  draw();
}
// container = document.querySelector('#field');

function createScene() {
  scene = new THREE.Scene();
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
  let cube1Material = new THREE.MeshBasicMaterial({ color: 'coral' });
  let cube2Material = new THREE.MeshBasicMaterial({ color: 'teal' });

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

  cube1.position.x = -170

  // lift cube1 up
  cube1.position.z = cubeDepth;

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

  // // add the sphere to the scene
  scene.add(cube2);
  cube2.receiveShadow = true;
  cube2.castShadow = true;
}

function createGround() {
  let tableMaterial = new THREE.MeshLambertMaterial({
    color: 'green',
  });

  // create the ground's material
  let groundMaterial = new THREE.MeshLambertMaterial({
    color: 0x888888,
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
  table.position.z = -51; // we sink the table into the ground by 50 units. The extra 1 is so the plane can be seen
  scene.add(table);
  table.receiveShadow = true;

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
  // create a point light
  pointLight = new THREE.PointLight(0xf8d898);

  // set its position
  pointLight.position.x = -1000;
  pointLight.position.y = 0;
  pointLight.position.z = 1000;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;
  // add to the scene
  scene.add(pointLight);

  // add a spot light
  // this is important for casting shadows
  spotLight = new THREE.SpotLight(0xf8d898);
  spotLight.position.set(0, 0, 460);
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function createRenderer() {
  let canvas = document.getElementById('field');

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMapEnabled = true;

  canvas.appendChild(renderer.domElement);
}

function draw() {
  // draw THREE.JS scene
  renderer.render(scene, camera);
  // loop draw function call
  requestAnimationFrame(draw);

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
