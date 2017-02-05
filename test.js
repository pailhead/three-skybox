var createApp = require('canvas-testbed')

var THREE = require('three')
var ScreenQuad = require('./')(THREE)

createApp(render, start, {
    context: 'webgl',
    onResize: resize
});

var renderer,
    scene,
    camera,
    controls,
    screenQuad

function start(gl, width, height) {

    renderer = new THREE.WebGLRenderer({
        canvas: gl.canvas
    });

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, width/height, 1, 1000);
    camera.position.set(0, 0 , -10);
    camera.lookAt(new THREE.Vector3());

    //make a quad thats 50% width and 50% height of the canvas
    //but offset in pixels
    screenQuad = new ScreenQuad({
        width: .5, 
        height: .5,
        top:'25px',
        left: '25px'
    });

    screenQuad.setScreenSize( renderer.getSize().width , renderer.getSize().height );

    scene.add(screenQuad)

}

function render(gl, width, height) {
    renderer.render(scene, camera);
}

function resize(width, height) {
    if (!renderer)
        return

    renderer.setViewport(0, 0, width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    screenQuad.setScreenSize( width , height );
}