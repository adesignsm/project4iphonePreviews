var mouse = new THREE.Vector2();

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f4f6);

//CAMERA STUFF
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var tmp = camera.right; // when using orthographic camera these lines will flip all images
camera.right = camera.left;
camera.left = tmp;
camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMapEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer.setSize(width, height);

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

var logoGeo = new THREE.PlaneGeometry(3, 3, 0);
var logoMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("logo.jpg"), side: THREE.DoubleSide});
var logo = new THREE.Mesh(logoGeo, logoMaterial);
scene.add(logo);

//CONTROLS AND CAMERA
var controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = 10;

var mirrorFrameGeo = new THREE.PlaneGeometry(4, 8, 0);
var mirrorFrameMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});

var mirrorFrame1 = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMaterial);
var mirrorFrame2 = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMaterial);
var mirrorFrame3 = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMaterial);

scene.add(mirrorFrame1);
scene.add(mirrorFrame2);
scene.add(mirrorFrame3);

var mirrorGeo = new THREE.PlaneGeometry(3, 7, 0);
var mirror1 = new THREE.Reflector(mirrorGeo, {

	clipBias: 0.005,
	textureWidth: window.innerWidth,
	textureHeight: window.innerHeight,
	color: 0xffffff,
	recurssion: 10 
});

var mirror2 = new THREE.Reflector(mirrorGeo, {

	clipBias: 0.005,
	textureWidth: window.innerWidth,
	textureHeight: window.innerHeight,
	color: 0xffffff,
	recurssion: 10
});

var mirror3 = new THREE.Reflector(mirrorGeo, {

	clipBias: 0.005,
	textureWidth: window.innerWidth,
	textureHeight: window.innerHeight,
	color: 0xffffff,
	recurssion: 10
});

scene.add(mirror1);
scene.add(mirror2);
scene.add(mirror3);

document.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {

	mouseX = event.clientX - window.innerWidth / 2;
	mouseY = event.clientY - window.innerHeight / 2;

	camera.position.x = (mouseX - camera.position.x) * 0.01;
	camera.position.y = (mouseY - camera.position.y) * 0.01;

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	camera.lookAt(scene.position);
	camera.updateMatrixWorld();
}

var composer = new THREE.EffectComposer(renderer);

var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

var glitchPass = new THREE.GlitchPass(10);
composer.addPass(glitchPass);
glitchPass.renderToScreen = true;

var FXAA = new THREE.ShaderPass(THREE.FXAAShader);
composer.addPass(FXAA);
FXAA.renderToScreen = false;

var update = function() {

	logo.rotation.y += 0.01;

	mirrorFrame1.position.z = -5;
	mirrorFrame1.position.y = 5;
	mirrorFrame1.rotation.x = .5;

	mirrorFrame2.position.z = -2;
	mirrorFrame2.position.x = -8;
	mirrorFrame2.rotation.y = 1;

	mirrorFrame3.position.z = -2;
	mirrorFrame3.position.x = 8;
	mirrorFrame3.rotation.y = -1;

	mirror1.position.z = -4.9;
	mirror1.position.y = 5;
	mirror1.rotation.x = .5;

	mirror2.position.z = -2;
	mirror2.position.x = -7.9;
	mirror2.rotation.y = 1;

	mirror3.position.z = -2;
	mirror3.position.x = 7.9;
	mirror3.rotation.y = -1;
};

var render = function() {

	composer.render();
	// renderer.render(scene, camera);
};

var animate = function() {

	requestAnimationFrame(animate);

	update();
	render();
};

animate();