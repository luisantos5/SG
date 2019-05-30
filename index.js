var renderer, scene, camera;

var ambientLight, spotLight, directionalLight, pointLight;
var controls;
var toggleShadows = true;

var cancelas = []
var plane, walk;

var cameraXPosition = -10100

var playerRight = false
var playerLeft = false

var playerMesh
var gameOver = false

var velocity = 5
var paused = false

window.onload = function init() {

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  createScene()

  createLights()

  createPlan()

  loadPlanObjects()

  renderer.render(scene, camera);

  animate()

}

function createScene() {

  scene = new THREE.Scene();

  //Ajuda nos limites da camera

  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(100, aspect, 0.1, 10000);
  //Meter câmera a olhar para longe
  camera.position.set(cameraXPosition, 120, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x66ccff, 1.0);

  // enable shadows
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // add the output of the renderer to an HTML element (this case, the body)
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', function () {
    renderer.render(scene, camera);
  });
  controls.target.set(-25, -50, 0);
  controls.update();

  console.log("Scene Created")

}

function createLights() {

  ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  // directionallight
  directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(100, 350, 250);
  directionalLight.shadow.camera.bottom = -500;
  directionalLight.shadow.camera.top = 500;
  directionalLight.shadow.camera.left = -500;
  directionalLight.shadow.camera.right = 500;
  directionalLight.shadow.camera.far = 1000;
  directionalLight.castShadow = true;

  scene.add(directionalLight);

  directionalLight.visible = true;

  console.log("Lights Created")

}

function createPlan() {

  //Grass
  var planeGeometry = new THREE.PlaneBufferGeometry(20000, 2000, 32, 32);

  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x46E84C,
    side: THREE.DoubleSide
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.name = "plane"
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1;
  plane.receiveShadow = true;
  scene.add(plane);

  //Walk
  var planeGeometry = new THREE.PlaneBufferGeometry((plane.geometry.parameters.width), (plane.geometry.parameters.height / 2), 32, 32);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x696969,
    side: THREE.DoubleSide
  });
  walk = new THREE.Mesh(planeGeometry, planeMaterial);
  walk.name = "plane"
  walk.rotation.x = -Math.PI / 2;
  walk.position.y = 8;
  walk.receiveShadow = true;
  scene.add(walk);

  console.log("Plan Created")

}

function loadPlanObjects() {

  var cancelaWidth = 220
  var treeWidth = 250
  var lampWidth = 700
  //console.log(plane.geometry.parameters.width)

  //Cancela
  //Right Side
  for (let i = 1; i < (plane.geometry.parameters.width) / cancelaWidth; i++) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('Elements/Cancela.mtl', function (materials) {
      materials.preload(); // load a material’s resource
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('Elements/Cancela.obj', function (object) {// load a geometry resource
        mesh = object;
        //mesh.material.color = "#B08A3E";
        mesh.position.x = -(plane.geometry.parameters.width / 2) + (i * cancelaWidth);
        mesh.position.y = 0;
        mesh.position.z = (plane.geometry.parameters.height) / 2;

        scene.add(mesh)

      });
    });
  }

  //Cancela
  //Left Side
  for (let i = 1; i < (plane.geometry.parameters.width) / cancelaWidth; i++) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('Elements/Cancela.mtl', function (materials) {
      materials.preload(); // load a material’s resource
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('Elements/Cancela.obj', function (object) {// load a geometry resource
        mesh = object;

        //mesh.material.color = "#B08A3E";
        mesh.position.x = -(plane.geometry.parameters.width / 2) + (i * cancelaWidth);
        mesh.position.y = 0;
        mesh.position.z = -(plane.geometry.parameters.height) / 2;


        scene.add(mesh)

      });
    });
  }

  //Trees
  //Left Side
  for (let i = 1; i < (plane.geometry.parameters.width) / treeWidth; i++) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('Elements/Tree.mtl', function (materials) {
      materials.preload(); // load a material’s resource
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('Elements/Tree.obj', function (object) {// load a geometry resource

        var randomLeftSpacing = Math.floor(Math.random() * 300) + 100
        var randomFrontalSpacing = Math.floor(Math.random() * 300) + 170

        mesh = object;
        //mesh.material.color = "#B08A3E";
        mesh.position.x = -(plane.geometry.parameters.width / 2) + (i * treeWidth);
        mesh.position.y = 0;
        mesh.position.z = -(plane.geometry.parameters.height) / 2 + randomLeftSpacing;


        mesh.material = new THREE.MeshLambertMaterial({ color: "green" })
        scene.add(mesh)

      });
    });
  }

  //Trees
  //Right Side
  for (let i = 1; i < (plane.geometry.parameters.width) / treeWidth; i++) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('Elements/Tree.mtl', function (materials) {
      materials.preload(); // load a material’s resource
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('Elements/Tree.obj', function (object) {// load a geometry resource

        var randomLeftSpacing = Math.floor(Math.random() * 300) + 200
        var randomFrontalSpacing = Math.floor(Math.random() * 300) + 170

        mesh = object;
        //mesh.material.color = "#B08A3E";
        mesh.position.x = -(plane.geometry.parameters.width / 2) + (i * treeWidth);
        mesh.position.y = 0;
        mesh.position.z = (plane.geometry.parameters.height) / 2 - randomLeftSpacing;

        scene.add(mesh);

      });
    });
  }

  //Lamps
  //Left Side
  for (let i = 1; i <= (plane.geometry.parameters.width) / lampWidth; i++) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('Elements/Lamp.mtl', function (materials) {
      materials.preload(); // load a material’s resource
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('Elements/Lamp.obj', function (object) {// load a geometry resource

        mesh = object;
        //mesh.material.color = "#B08A3E";
        mesh.position.x = -(plane.geometry.parameters.width / 2) + (i * lampWidth);
        mesh.position.y = 0;
        mesh.position.z = -(plane.geometry.parameters.height) / 2 + (plane.geometry.parameters.height / 2.8);


        /*
        if (i == 1) {

          var axisHelper = new THREE.AxesHelper(50);
          mesh.add(axisHelper);

          //Add ON -> Meter uma spotLight nos candeeiros
          var spotLight = new THREE.SpotLight(0xffffff);
          spotLight.position.set(mesh.position.x, mesh.position.y, mesh.position.z);


          var spotLightHelper = new THREE.SpotLightHelper(spotLight);
          scene.add(spotLightHelper);

          scene.add(spotLight);
        }*/


        scene.add(mesh)

      });
    });
  }

  //Right Side
  for (let i = 0; i <= ((plane.geometry.parameters.width) / lampWidth) - 1; i++) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('Elements/Lamp.mtl', function (materials) {
      materials.preload(); // load a material’s resource
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('Elements/Lamp.obj', function (object) {// load a geometry resource

        mesh = object;
        //mesh.material.color = "#B08A3E";
        mesh.position.x = -(plane.geometry.parameters.width / 2) + (i * lampWidth);
        mesh.position.y = 0;
        mesh.position.z = (plane.geometry.parameters.height) / 2 - (plane.geometry.parameters.height / 2.8);
        mesh.rotation.y = Math.PI

        scene.add(mesh)

      });
    });
  }

  //Player
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('Elements/Player1.mtl', function (materials) {
    materials.preload(); // load a material’s resource
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('Elements/Player1.obj', function (object) {// load a geometry resource

      playerMesh = object;
      //mesh.material.color = "#B08A3E";
      playerMesh.position.x = - (plane.geometry.parameters.width / 2) + 100;
      playerMesh.position.y = 25;
      playerMesh.position.z = 0;

      playerMesh.rotation.y = Math.PI / 2;

      scene.add(playerMesh)

    });
  });

  console.log("Objects Plan Loaded")

}

function pauseMenu() {

  //Walk
  var planeGeometry = new THREE.PlaneBufferGeometry((200), (200), 32, 32);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x696969,
    side: THREE.DoubleSide,
    opacity: 0.5
  });
  blur = new THREE.Mesh(planeGeometry, planeMaterial);
  blur.name = "plane"

  scene.add(blur);

}

function animate() {

  if (paused) {

    pauseMenu()

  }

  if (!paused) {

    if (playerRight) {

      if (playerMesh.position.z <= 400) {
        playerMesh.position.z += 10
      }

    }

    if (playerLeft) {

      if (playerMesh.position.z > -400) {
        playerMesh.position.z -= 10
      }

    }

    if (playerMesh) {

      camera.position.x += velocity
      playerMesh.position.x += velocity

      if (playerMesh.position.x >= 10000) {
        playerMesh.position.y -= 10
        gameOver = true
      }

    }
  }


  renderer.render(scene, camera);
  requestAnimationFrame(animate)

}

function handleKeyDown(event) {

  var char = String.fromCharCode(event.keyCode);

  if (char === "D") {
    playerRight = true
  }

  if (char === "A") {
    playerLeft = true
  }

  if (char === " ") {
    paused = !paused
  }
}

function handleKeyUp(event) {

  var char = String.fromCharCode(event.keyCode);

  if (char === "D") {
    playerRight = false
  }

  if (char === "A") {
    playerLeft = false
  }

}