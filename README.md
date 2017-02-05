# SkyBox

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![NPM](https://nodei.co/npm/three-skybox.png)](https://npmjs.org/package/three-skybox)

[A self contained class for drawing a skybox](http://dusanbosnjak.com/test/webGL/three-skybox/). This feature now exists in three.js (`Scene.background`) but uses matrices to compute the camera. This one has a slightly different approach, since the cameraPosition is available in shaders as a uniform by default, we can avoid some computation that happens with the `backgroundBoxCamera` in `THREE.WebGLRenderer`. 

The shader here does one addition and 2 matrix multiplications:

   
	vec4 wp = vec4( position + cameraPosition , 1. ); 

	vViewDir = position; //no normalization

	gl_Position = projectionMatrix * viewMatrix * wp;


It probably doesnt really affect anything since the cube has a few vertices, but it saves one multiplication and the normalization at the cost of one addition ( the original has 3 multiplications and a normalization ).

Where it could provide some performance saving is by removing the need for the `Scene.background` logic. There is no need to copy the properties into a different camera, and no need to obtain the mvp matrix since it already cuts on one multiplication in the shader:
   
    backgroundBoxCamera.projectionMatrix.copy( camera.projectionMatrix ); //no need to copy

	backgroundBoxCamera.matrixWorld.extractRotation( camera.matrixWorld ); //these are somewhat expensive operations
	backgroundBoxCamera.matrixWorldInverse.getInverse( backgroundBoxCamera.matrixWorld );
	backgroundBoxMesh.modelViewMatrix.multiplyMatrices( backgroundBoxCamera.matrixWorldInverse, backgroundBoxMesh.matrixWorld );


# Constructor

* **SkyBox( renderer:[ *THREE.WebGLRenderer* ] , (opt) cubemap:[ *THREE.TextureCube* ] )**

  The renderer is required for construction, the cubemap can be assigned later.


# Properties

* **cubemap:[ THREE.TextureCube ]** 

	the cubemap currently assigned to the skybox


# Methods

* **void render( *camera:[THREE.Camera]* )**
 
  renders the skybox to the window frame buffer, call it before rendering the main scene


# Install
```
$ npm install three-skybox
```

# Usage

```javascript

var SkyBox = require('three-skybox')(THREE);

var skybox = new SkyBox( renderer , myTextureCube );


function render(){

	skybox.render( camera );

	renderer.render( scene , camera )

}
```
