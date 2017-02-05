module.exports = function( THREE ){

var defaultSkyboxVertexShader = [

"varying vec3 vViewDir;", //send the view direction for lookup to frag

"void main(){",

	"vec4 wp = vec4( position + cameraPosition , 1. ); ", //move the unit cube to be centered with the camera

	"vViewDir = position;", //the unit cube has its vertices positioned so that this can be used for word space lookup

	"gl_Position = projectionMatrix * viewMatrix * wp;", //project the transformed cube, modelMatrix ommited because all thats needed is the translation

"}"

].join('\n');

var defaultSkyboxFragmentShader = [

"varying vec3 vViewDir;", //view dir for lookup

"uniform samplerCube uCubemap;", //cubemap texture

"void main(){", 

	"vec4 tex = textureCube( uCubemap , normalize( vViewDir) );",

	"gl_FragColor = tex;", 
	
	// "gl_FragColor = vec4( vViewDir , 1. );", 

"}"

].join('\n');

var defaultCubeGeometry = new THREE.CubeGeometry(2,2,2,1,1,1); 	//a single segment cube;

function SkyBoxMaterial( cubemap ){

	THREE.ShaderMaterial.call( this , {

		uniforms:{

			uCubemap:{

				type:'t',

				value: null

			}

		},

		vertexShader: defaultSkyboxVertexShader,

		fragmentShader: defaultSkyboxFragmentShader,

		side: THREE.BackSide,									//render the backside of the cube

		depthWrite: false 										//its infinitely far away, so no interferance with depth

	});

	Object.defineProperty( this , 'cubemap' , {

		get: function () { return this.uniforms.uCubemap.value },

		set: function (v) { this.uniforms.uCubemap.value = v; }

	});

	if( undefined !== cubemap ) this.cubemap = cubemap;

}

SkyBoxMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

SkyBoxMaterial.constructor = SkyBoxMaterial;


//skybox class extends from mesh
function SkyBox( renderer , cubemap ){

	// params = params || {};

	THREE.Mesh.call( this , defaultCubeGeometry , new SkyBoxMaterial() );

	if( undefined === renderer ){
		
		console.warn( "SkyBox: renderer not provided.");
		
		return false;
	
	}

	else this._renderer = renderer;

	this._scene = new THREE.Scene(); //have its own self contained scene
	
	this.frustumCulled = false; //prevent threejs from trying to cull this object (the matrix is not used so three.js doesnt know where it is)

	this._scene.add( this );
	
	Object.defineProperty( this , 'cubemap' , {

		get: function(){ return this.material.cubemap; },

		set: function(v){ this.material.cubemap = v; }

	});

	if( undefined !== cubemap ) this.cubemap = cubemap;

}

SkyBox.prototype = Object.create( THREE.Mesh.prototype );

SkyBox.constructor = SkyBox;

SkyBox.prototype.render = function( camera ){

	var hijackedAutoClear = this._renderer.autoClear;

	this._renderer.autoClear = false;

	this._renderer.render( this._scene , camera );

	this._renderer.autoClear = hijackedAutoClear;

}

return SkyBox;
	
}

