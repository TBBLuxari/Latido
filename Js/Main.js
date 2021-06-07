const params = {
exposure: 1,
bloomStrength:0,
bloomThreshold: 0,
bloomRadius: 0,
scene: "Scene with Glow"
};
let t1=0;
//-----------------------------------------------------------
const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};
//-----------------------------------------------------------
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );
//-----------------------------------------------------------
const scene = new THREE.Scene();
//-----------------------------------------------------------
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 200 );
camera.position.set( 0, 0, 20 );
camera.lookAt( 0, 0, 0 );
//-----------------------------------------------------------
const controls = new THREE.OrbitControls( camera, renderer.domElement );
//Leborre los parametros delorbit
scene.add( new THREE.AmbientLight( 0x404040 ) );
//-----------------------------------------------------------
const renderScene = new THREE.RenderPass( scene, camera );
//-----------------------------------------------------------
const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = t1/*params.bloomStrength;*/
bloomPass.radius = params.bloomRadius;
/*Le agrege 2 librerias extra CopyShader y LuminosityHighPassShader*/
//----------------------------------------------------------------
const bloomComposer = new THREE.EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );
//-----------------------------------------------------------
const finalPass = new THREE.ShaderPass(
	new THREE.ShaderMaterial( {
		uniforms: {
			baseTexture: { value: null },
			bloomTexture: { value: bloomComposer.renderTarget2.texture }
		},
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		//Explicacion de esto pls
		defines: {}
	} ), "baseTexture"
);
finalPass.needsSwap = true;
//------------------------------------------------------------
const finalComposer = new THREE.EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );
//------------------------------------------------------------
bloomComposer.setSize( window.innerWidth, window.innerHeight  );
finalComposer.setSize( window.innerWidth, window.innerHeight  );
//-------------------------------------------------------------
const geometry = new THREE.IcosahedronGeometry( 1, 15 );
for ( let i = 0; i < 50; i ++ ) 
{

	const color = new THREE.Color();
	color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

	const material = new THREE.MeshBasicMaterial( { color: color } );
	const sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = Math.random() * 10 - 5;
	sphere.position.y = Math.random() * 10 - 5;
	sphere.position.z = Math.random() * 10 - 5;
	sphere.position.normalize().multiplyScalar( Math.random() * 4.0 + 2.0 );
	sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
	scene.add( sphere );

}


//(Math.sin(a)+Math.cos(b))*5


const animate = function () 
{
requestAnimationFrame( animate );

t1+=0.1;
bloomPass.strength = (Math.pow((Math.sin(Math.cos(t1)*2)),21))*5;

bloomComposer.render()
finalComposer.render();
//renderer.render( scene, camera );

};

animate();
