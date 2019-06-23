
var renderer, scene, cameraBack, cameraUp;

var ambientLight, spotLight, directionalLight, pointLight;
var controls;
var toggleShadows = true;

var cancelas = []
var plane, walk;

var fallingObjects = []

var cameraXPosition = -10100

var playerRight = false
var playerLeft = false

var player = {}
var gameOver = false

var velocity = 5
var paused = false

var rotationFlagLA = 0.02
var rotationFlagRA = -0.02
var rotationFlagLL = -0.02
var rotationFlagRL = 0.02

var frames = 0
var heart;
var score = 0
var lifes = 5;
var meshScore;
var fontText;
var meshLifes;
var pausedMesh;
var gameOverMesh;


window.onload = function init() {

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  createScene()

  createLights()

  createSkyBox()

  createPlan()

  loadPlanObjects()

  loadHealthAndScore()

  renderer.render(scene, camera);

  animate()

}

function loadHealthAndScore() {

  console.log(lifes)

  var loader = new THREE.FontLoader();
  //var 
  loader.load('./json/font.json', data => {
    //var font = new THREE.FontLoader().parse(data);
    fontText = data;

    ////mesh scores
    var text = 'Score: ' + score;
    var geometry = new THREE.TextGeometry(text, {
      font: fontText,
      size: 10,
      height: 0.5,


      bevelThickness: 1,
      extrudeMaterial: 1
    });

    var material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    meshScore = new THREE.Mesh(geometry, material)
    meshScore.position.x = - (plane.geometry.parameters.width / 2) + 50;
    meshScore.position.y = 8;
    meshScore.position.z = 200;
    //mesh.position.set(-1000,0,-50)
    meshScore.rotateY(-Math.PI / 2)
    scene.add(meshScore)

    ////mesh vidas
    text = 'Vidas: ' + lifes;
    geometry = new THREE.TextGeometry(text, {
      font: fontText,
      size: 10,
      height: 0.5,


      bevelThickness: 1,
      extrudeMaterial: 1
    });
    meshLifes = new THREE.Mesh(geometry, material)
    meshLifes.position.x = - (plane.geometry.parameters.width / 2) + 50;
    meshLifes.position.y = 20;
    meshLifes.position.z = 200;
    //mesh.position.set(-1000,0,-50)
    meshLifes.rotateY(-Math.PI / 2)
    scene.add(meshLifes)

  });

  console.log("Health and Score Available")

}


function createScene() {

  scene = new THREE.Scene();

  //Ajuda nos limites da camera

  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(100, aspect, 0.1, 30000);
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

function createSkyBox() {

  var geometry = new THREE.CubeGeometry(20500, 20500, 10000);
  var cubeMaterials = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("Elements/SkyBox/xpos.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("Elements/SkyBox/xneg.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("Elements/SkyBox/ypos.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("Elements/SkyBox/yneg.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("Elements/SkyBox/zpos.png"),
      side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("Elements/SkyBox/zneg.png"),
      side: THREE.DoubleSide
    })
  ]

  var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
  var cube = new THREE.Mesh(geometry, cubeMaterial);

  scene.add(cube)

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
  walk.name = "walk"
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

      player.playerMesh = object;
      //mesh.material.color = "#B08A3E";
      player.playerMesh.position.x = - (plane.geometry.parameters.width / 2) + 100;
      player.playerMesh.position.y = 60;
      player.playerMesh.position.z = 0;

      player.playerMesh.rotation.y = Math.PI / 2;

      scene.add(player.playerMesh)

      player.rightLeg = player.playerMesh.children[1]
      player.leftLeg = player.playerMesh.children[2]
      player.rightArm = player.playerMesh.children[5]
      player.leftArm = player.playerMesh.children[3]

      /*player.playerMesh.geometry.computeBoundingBox()
      player.box = player.playerMesh.geometry.boundingBox.clone()*/

    });
  });

  console.log("Objects Plan Loaded")

}

//let cookie

function loadFallingObjects() {

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('Elements/Cookie.mtl', function (materials) {
    materials.preload(); // load a material’s resource
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('Elements/Cookie.obj', function (object) {// load a geometry resource

      // let cookie
      let range = walk.geometry.parameters.height

      cookie = object;
      // cookie.material.color.setRGB(204, 204, 204);
      cookie.position.x = camera.position.x + 500
      cookie.position.y += 500
      cookie.position.z = Math.floor(Math.random() * (range)) + -(range / 2);
      //console.log(cookie.position)

      fallingObjects.push({ object: cookie, type: "good" })
      //console.log(fallingObjects)
      scene.add(cookie)

    });
  });

  var randomEnemy = Math.floor(Math.random() * (2)) + 1;
  var enemyObject, enemyMTL

  switch (randomEnemy) {
    case 1: enemyObject = 'Elements/Enemy1.obj'
      enemyMTL = 'Elements/Enemy1.mtl'
      break
    case 2: enemyObject = 'Elements/Enemy2.obj'
      enemyMTL = 'Elements/Enemy2.mtl'
      break

  }

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load(enemyMTL, function (materials) {
    materials.preload(); // load a material’s resource
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(enemyObject, function (object) {// load a geometry resource

      // let cookie
      let range = walk.geometry.parameters.height

      enemy = object;
      // cookie.material.color.setRGB(204, 204, 204);
      enemy.position.x = camera.position.x + 500
      enemy.position.y += 500
      enemy.position.z = Math.floor(Math.random() * (range)) + -(range / 2);
      //console.log(cookie.position)

      fallingObjects.push({ object: enemy, type: "bad" })
      //console.log(fallingObjects)
      scene.add(enemy)

    });
  });

  console.log("ENEMIES LOADED")

}

function pauseMenu() {

  var loader = new THREE.FontLoader();
  //var 
  loader.load('./json/font.json', data => {
    //var font = new THREE.FontLoader().parse(data);
    fontText = data;

    ////mesh scores
    var text = 'PAUSE';
    var geometry = new THREE.TextGeometry(text, {
      font: fontText,
      size: 10,
      height: 0.5,


      bevelThickness: 1,
      extrudeMaterial: 1
    });
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    pausedMesh = new THREE.Mesh(geometry, material)
    pausedMesh.position.x = - (plane.geometry.parameters.width / 2) + 50;
    pausedMesh.position.y = 20;
    pausedMesh.position.z = 200;
    //mesh.position.set(-1000,0,-50)
    pausedMesh.rotateY(-Math.PI / 2)
    scene.add(pausedMesh)
    console.log("pause")
  
  })
  
 

}

function animate() {

  if (lifes == 0) {
    gameOver = true;

  }
  if (gameOver) {
    GameOverText()

  }
  if (!gameOver) {

    frames++



    if (paused) {

      pauseMenu()

    }


    if (!paused) {
      if (pausedMesh) {
        scene.remove(pausedMesh)
      }

      if (frames % 100 == 0) {

        loadFallingObjects()

      }
      if (player.playerMesh) {

        if (playerRight) {

          if (player.playerMesh.position.z <= 400) {
            player.playerMesh.position.z += 10
          }

        }

        if (playerLeft) {

          if (player.playerMesh.position.z > -400) {
            player.playerMesh.position.z -= 10
          }

        }

        camera.position.x += velocity
        player.playerMesh.position.x += velocity

        meshScore.position.x += velocity
        meshLifes.position.x += velocity

        if (player.playerMesh.position.x >= 10000) {

          player.playerMesh.position.y -= 10
          //paused = true
          gameOver = true

        }

        /*player.playerMesh.updateMatrixWorld(true)
        player.box.copy(player.box).applyMatrix4(player.playerMesh.matrixWorld)*/

        //Rotation of all members of the Player Body
        rotateMembers()
        updateFallingObjects()
        calculateCollisions()
        //loadHealthAndScore()

      }


    }
  }
    renderer.render(scene, camera);

    requestAnimationFrame(animate)

  


}
function GameOverText() {
  var text = "Game Over"
  var geometry = new THREE.TextGeometry(text, {
    font: fontText,
    size: 20,
    height: 0.5,


    bevelThickness: 1,
    extrudeMaterial: 1
  });
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  gameOverMesh = new THREE.Mesh(geometry, material)
  gameOverMesh.position.x = - (plane.geometry.parameters.width / 2) + 50;
  gameOverMesh.position.y = 20;
  gameOverMesh.position.z = 0;
  //mesh.position.set(-1000,0,-50)
  gameOverMesh.rotateY(-Math.PI / 2)
  scene.add(gameOverMesh)
  console.log(gameOverMesh)
  console.log(fontText)

  
 

}

function calculateCollisions() {

  for (let i = 0; i < fallingObjects.length; i++) {

    playerBox = new THREE.Box3().setFromObject(player.playerMesh)

    fOBox = new THREE.Box3().setFromObject(fallingObjects[i].object)

    if (fOBox.intersectsBox(playerBox)) {

      var object = fallingObjects[i].object

      if (fallingObjects[i].type === "good") {
        score += 200

        updateLifeScore()

        fallingObjects.splice(i, 1)
        scene.remove(object)
        i--
        //console.log(score)
      }
      else if (fallingObjects[i].type === "bad") {
        if (score >= 100) { score -= 100 }
        else {
          score = 0
        }

        lifes -= 1

        updateLifeScore()
        fallingObjects.splice(i, 1)
        scene.remove(object)
        i--
        //console.log(score)
      }
    }

  }


}
function updateLifeScore() {
  
  var text = "Score: " + score;
  meshScore.geometry = new THREE.TextGeometry(text, {
    font: fontText,
    size: 10,
    height: 0.5,


    bevelThickness: 1,
    extrudeMaterial: 1
  });
  var text = "Vidas: " + lifes;
  meshLifes.geometry = new THREE.TextGeometry(text, {
    font: fontText,
    size: 10,
    height: 0.5,


    bevelThickness: 1,
    extrudeMaterial: 1
  });

}

function updateFallingObjects() {

  for (let i = 0; i < fallingObjects.length; i++) {

    var object = fallingObjects[i]

    if (fallingObjects[i].type === "good") {

      if ((fallingObjects[i].object.position.y > plane.position.y + 20)) {

        fallingObjects[i].object.position.y -= 7
        fallingObjects[i].object.position.x += velocity

      }

      if (fallingObjects[i].object.position.x < camera.position.x) {

        fallingObjects.splice(i, 1)
        scene.remove(object)
        i--

      }

    }
    else if (fallingObjects[i].type === "bad") {

      if ((fallingObjects[i].object.position.y > plane.position.y + 15)) {

        fallingObjects[i].object.position.y -= 7
        fallingObjects[i].object.position.x += velocity

      }

      if (fallingObjects[i].object.position.x < camera.position.x) {

        fallingObjects.splice(i, 1)
        scene.remove(object)
        i--

      }

    }

  }

}

function rotateMembers() {

  player.leftArm.rotation.x += rotationFlagLA

  if (player.leftArm.rotation.x > 1 || player.leftArm.rotation.x < -1) {
    rotationFlagLA = -rotationFlagLA
  }

  player.rightArm.rotation.x += rotationFlagRA

  if (player.rightArm.rotation.x > 1 || player.rightArm.rotation.x < -1) {
    rotationFlagRA = -rotationFlagRA
  }

  player.leftLeg.rotation.x += rotationFlagLL

  if (player.leftLeg.rotation.x > 0.3 || player.leftLeg.rotation.x < -0.3) {
    rotationFlagLL = -rotationFlagLL
  }

  player.rightLeg.rotation.x += rotationFlagRL

  if (player.rightLeg.rotation.x > 0.3 || player.rightLeg.rotation.x < -0.3) {
    rotationFlagRL = -rotationFlagRL
  }

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
