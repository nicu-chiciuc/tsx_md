import React from 'react'
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook'
import { Scene, Mesh, CubeTexture } from '@babylonjs/core'

// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
// import './App.css'

const boxes: Mesh[] = []

const onSceneReady = (scene: Scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero())

  const canvas = scene.getEngine().getRenderingCanvas()

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true)

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7

  // Add reflection to the boxes
  const reflectionTexture = new CubeTexture('https://assets.babylonjs.com/environments/cubehouse.env', scene)

  // Create group of boxex with n boxes (let n be 5 for now)
  const n = 5
  const size = 1
  // prettier-ignore
  const start = -(n / (size * 2))

  for (let i = 0; i < n; i++) {
    const box = MeshBuilder.CreateBox(`box-${i}`, { size }, scene)

    box.position.y = size / 2
    box.position.x = start + i * size
    box.position.z = start + i * size
    boxes.push(box)
  }

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  for (const box of boxes) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime()

    const rpm = 10
    // box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
  }
}

function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: undefined,
    height: undefined,
  })

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export default function Something() {
  const windowSize = useWindowSize()

  return (
    <div>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
        height={windowSize.height}
        width={windowSize.width}
      />
    </div>
  )
}
