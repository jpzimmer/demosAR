// init renderer
	var renderer	= new THREE.WebGLRenderer({
		antialias	: true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	// array of functions for the rendering loop
	var onRenderFcts= [];

	// init scene and camera
	var scene	= new THREE.Scene();
		
	//////////////////////////////////////////////////////////////////////////////////
	//		Initialize a basic camera
	//////////////////////////////////////////////////////////////////////////////////

	// Create a camera
	var camera = new THREE.Camera();
	scene.add(camera);
	/*
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 200 );
//camera.position.z = 100;
	camera.position.set( 0, 5, 5 );
	camera.target = new THREE.Vector3( 0, 100, 100 );
	*/
	////////////////////////////////////////////////////////////////////////////////
	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////

	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam 
		sourceType : 'webcam',	
	})

	arToolkitSource.init(function onReady(){
		// handle resize of renderer
		arToolkitSource.onResize(renderer.domElement)		
	})
	
	// handle resize
	window.addEventListener('resize', function(){
		// handle arToolkitSource resize
		//arToolkitSource.onResize(renderer.domElement)		
	})	
	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////
	

	// create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono',
		imageSmoothingEnabled: false,
		maxDetectionRate: 10,
		canvasWidth: 80*4,
		canvasHeight: 60*4,
	})
	// initialize it
	arToolkitContext.init(function onCompleted(){
		// copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	})

	// update artoolkit on every frame
	onRenderFcts.push(function(){
		if( arToolkitSource.ready === false )	return

		arToolkitContext.update( arToolkitSource.domElement )
		
		// update scene.visible if the marker is seen
		scene.visible = camera.visible
	})
		
	////////////////////////////////////////////////////////////////////////////////
	//          Create a ArMarkerControls
	////////////////////////////////////////////////////////////////////////////////
	
	// init controls for camera
	/*
	var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type : 'pattern',
		patternUrl : 'data/patt.hiro',
		// patternUrl : '../../data/data/patt.kanji',
		// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		changeMatrixMode: 'cameraTransformMatrix'
	})
	*/
	
	var markerRoot = new THREE.Group
	scene.add(markerRoot)
	var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type : 'pattern',
		patternUrl : 'data/patt.hiro',
		// patternUrl : '../../data/data/patt.kanji',
	})
	
	// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
	//scene.visible = false

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object in the scene
	//////////////////////////////////////////////////////////////////////////////////
/*
var renderer	= new THREE.WebGLRenderer({
		antialias	: true
});
var clock = new THREE.Clock();
var scene	= new THREE.Scene();

scene.fog = new THREE.Fog( 0x050505, 400, 1000 );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( scene.fog.color );
renderer.setPixelRatio( window.devicePixelRatio );
//renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
document.body.appendChild( renderer.domElement );
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
				

var onRenderFcts= [];
*/

scene.add( new THREE.AmbientLight( 0x222222 ) );
var light = new THREE.SpotLight( 0xffffff, 5, 1000 );
light.position.set( 200, 250, 500 );
light.angle = 0.5;
light.penumbra = 0.5;
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add( light );

var light2 = new THREE.DirectionalLight( 0xffffff, 2.25 );
light2.position.set( 200, 450, 500 );
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 512;
light2.shadow.camera.near = 100;
light2.shadow.camera.far = 1200;
light2.shadow.camera.left = -1000;
light2.shadow.camera.right = 1000;
light2.shadow.camera.top = 350;
light2.shadow.camera.bottom = -350;
//scene.add( light2 );

var containerM	= new THREE.Object3D()
//containerM.position.z	= 0
scene.add(containerM)
markerRoot.add(containerM);

var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	//containerM.add( mesh );

/*
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 200 );
//camera.position.z = 100;
camera.position.set( 0, 100, 100 );

camera.target = new THREE.Vector3( 0, 100, 100 );


onRenderFcts.push(function(delta, now){
	var radius =50;
	camera.rotation.y += 1/32 * delta;
	camera.lookAt( camera.target );
})
*/	

//var containerM	= new THREE.Object3D()
//containerM.rotateZ(-23.4 * Math.PI/180)
//containerM.position.z	= 0
//scene.add(containerM)
//markerRoot.add(containerM);

var config2 = {
					
	baseUrl: "models/md2/ogro/",
	body: "ogro.md2",
	skins: [ "grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png",
			"gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png","sharokh.png" ],
	weapons:  [ [ "weapon.md2", "weapon.jpg" ] ],
	animations: {
		move: "run",
		idle: "stand",
		jump: "jump",
		attack: "attack",
		crouchMove: "cwalk",
		crouchIdle: "cstand",
		crouchAttach: "crattack"
	},
	walkSpeed: 350,
	crouchSpeed: 175
}


var controls;
// CONTROLS
controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.target.set( 0, 50, 0 );

var controls2 = {
	moveForward: false,
	moveBackward: false,
	moveLeft: false,
	moveRight: false
};
				
character = new THREE.MD2Character();
//character.scale = 0.01;
//character.controls = controls;
character.onLoadComplete = function() {
	character.setSkin(5)
	character.setAnimation( character.meshBody.geometry.animations[1].name )	
	//character.root.rotateX(Math.PI/2)
	character.root.scale.set(1,1,1).multiplyScalar(0.02)
	character.root.position.z = 0;				
	//character.root.position.y = 0.5
	//character.root.position.z = 0.5
	
};
character.loadParts( config2 );

onRenderFcts.push(function(delta){
	var present = Date.now()/1000
	var angle = present*Math.PI * 0.2
	var radius = 0.8 ;//+ 0.02*Math.sin(present*Math.PI)
	character.root.position.x = Math.cos(angle) * radius
	character.root.position.y = (1+Math.sin(angle))*0.5
	character.root.position.z = (1-Math.sin(angle))*0.5;
	character.root.rotation.y = angle +Math.PI;//+3*Math.PI/4
	//character.root.rotation.z = Math.sin(present*Math.PI*1) * Math.PI/15
})			
			
containerM.add(character.root)

/*
onRenderFcts.push(function(delta, now){
	var r=50
	//character.root.position.x = r * Math.cos(delta);
	//character.root.position.z = r * Math.sin(delta);		
})
*/
	//  GROUND
var gt = new THREE.TextureLoader().load( "textures/terrain/grasslight-big.jpg" );
var gg = new THREE.PlaneBufferGeometry( 10, 10 );
var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );
var ground = new THREE.Mesh( gg, gm );
ground.rotation.x = -0.5*Math.PI ;
ground.material.map.repeat.set( 1, 1 );
ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
ground.receiveShadow = true;
//containerM.add( ground );
				
				
/*
var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
		mouse.y	= (event.clientY / window.innerHeight) - 0.5
	}, false)
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*50 - camera.position.x) * (delta*3)
		camera.position.y += (mouse.y*50 - camera.position.y) * (delta*3)
		camera.lookAt( scene.position )
	})
*/

//////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////

var clock = new THREE.Clock();

onRenderFcts.push(function(){
	var delta = clock.getDelta();
	//controls.update();
	character.update( delta );
	
	var yAxis = new THREE.Vector3(0,5,0);		
	//rotateAboutWorldAxis(containerM,yAxis,5/100);
	renderer.render( scene, camera );		
})

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
		// keep looping
	requestAnimationFrame( animate );
		// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	
// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})

function rotateAboutWorldAxis(object, axis, angle) {
	var rotationMatrix = new THREE.Matrix4();
	rotationMatrix.makeRotationAxis( axis.normalize(), angle );
	var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 15);
	var newPos = currentPos.applyMatrix4(rotationMatrix);
	object.position.x = newPos.x;
	object.position.y = newPos.y;
	object.position.z = newPos.z;
}	
