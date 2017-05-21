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
	// add a torus knot	
	var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	scene.add( mesh );
	
	var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,32,32);
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	scene.add( mesh );
	
	onRenderFcts.push(function(delta){
		mesh.rotation.x += Math.PI*delta
	})
*/
	var light	= new THREE.AmbientLight( 0x222222 )
	scene.add( light )
	var light	= new THREE.DirectionalLight( 0xffffff, 1 )
	light.position.set(5,5,5)
	scene.add( light )
	light.castShadow	= true
	light.shadowCameraNear	= 0.01
	light.shadowCameraFar	= 15
	light.shadowCameraFov	= 45
	light.shadowCameraLeft	= -1
	light.shadowCameraRight	=  1
	light.shadowCameraTop	=  1
	light.shadowCameraBottom= -1
	// light.shadowCameraVisible	= true
	light.shadowBias	= 0.001
	light.shadowDarkness	= 0.2
	light.shadowMapWidth	= 1024
	light.shadowMapHeight	= 1024

	
	//var starSphere	= THREEx.Planets.createStarfield()
	//scene.add(starSphere)
	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////
	// var datGUI	= new dat.GUI()
	var containerEarth	= new THREE.Object3D()
	containerEarth.rotateZ(-23.4 * Math.PI/180)
	containerEarth.position.z	= 0
	containerEarth.position.y	= 1
	scene.add(containerEarth)
	markerRoot.add( containerEarth);
	var moonMesh	= THREEx.Planets.createMoon()
	moonMesh.position.set(1,1,0.5)
	moonMesh.scale.multiplyScalar(1/5)
	moonMesh.receiveShadow	= true
	moonMesh.castShadow	= true
	containerEarth.add(moonMesh)
	var earthMesh	= THREEx.Planets.createEarth()
	earthMesh.receiveShadow	= true
	earthMesh.castShadow	= true
	containerEarth.add(earthMesh)
	onRenderFcts.push(function(delta, now){
		earthMesh.rotation.y += 1/32 * delta;		
	})
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= THREEx.createAtmosphereMaterial()
	material.side	= THREE.BackSide
	material.uniforms.glowColor.value.set(0x00b3ff)
	material.uniforms.coeficient.value	= 0.5
	material.uniforms.power.value		= 4.0
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.15);
	containerEarth.add( mesh );
	var earthCloud	= THREEx.Planets.createEarthCloud()
	earthCloud.receiveShadow	= true
	earthCloud.castShadow	= true
	containerEarth.add(earthCloud)
	onRenderFcts.push(function(delta, now){
		earthCloud.rotation.y += 1/16 * delta;		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////

	// render the scene
	onRenderFcts.push(function(){
		containerEarth.rotation.y -= 1/1000;
		var yAxis = new THREE.Vector3(0,5,0);		
		//rotateAboutWorldAxis(containerEarth,yAxis,5/100);
		renderer.render( scene, camera );
	})

// run the rendering loop
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
