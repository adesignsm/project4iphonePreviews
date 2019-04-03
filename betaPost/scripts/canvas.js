var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

//CAMERA STUFF
var camera = new THREE.OrthographicCamera
(
	window.innerWidth /  80,
	window.innerWidth / - 80,
	window.innerHeight /  80,
	window.innerHeight / - 80,
	-1000,
	1000
);

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

//CONTROLS AND VIDEO LOADING/TEXTURE
var controls = new THREE.OrbitControls(camera, renderer.domElement);

var video = document.getElementById("video");
video.load();
video.play();
var videoTexture = new THREE.VideoTexture(video);

function createMesh(geom) {

	var cubeMaterial = [];

	cubeMaterial.push(
		new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0}),
		new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0}),
		new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0}),
		new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0}),
		new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide, transparent: true, opacity: 1}),
		new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0})
	);

	var actualMesh = new THREE.MeshFaceMaterial(cubeMaterial);
	var mesh = new THREE.Mesh(geom, actualMesh);

	return mesh;
}

var videoCube = createMesh(new THREE.CubeGeometry(5, 9, 5));
scene.add(videoCube);

var loader = new THREE.ObjectLoader();
loader.load("iphone-5s-threejs/iphone-5s.json", function(object) {

	object.scale.set(.05, .05, .05);
	object.rotation.y = 3.15;
	object.position.y = "-6";
	scene.add(object);

	camera.position = object.position; //centers the camera on the object in scene when rotating the camera
});

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

	videoCube.position.y = "-.21";
	videoCube.position.z = -2.08;

	camera.rotation.y += 0.03;
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