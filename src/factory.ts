import { GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'

export function spawnSeeds() {
  // Create entities for each seed
  let redSeedEntity = engine.addEntity()
  let blueSeedEntity = engine.addEntity()
  let yellowSeedEntity = engine.addEntity()

  GltfContainer.create(redSeedEntity, {
    src: 'models/ghost.glb'
  })
  GltfContainer.create(blueSeedEntity, {
    src: 'models/ghost.glb'
  })
  GltfContainer.create(yellowSeedEntity, {
    src: 'models/ghost.glb'
  })

  Transform.create(redSeedEntity, {
    position: Vector3.create(3.01, 0.88, 3.9),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(blueSeedEntity, {
    position: Vector3.create(6.51, 0.88, 3.33),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(yellowSeedEntity, {
    position: Vector3.create(3.08, 0.88, 5.51),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })

  let collectedSeedCount = 0

  let collectedSeeds = {
    red: false,
    blue: false,
    yellow: false
  }

  pointerEventsSystem.onPointerDown(
    {
      entity: redSeedEntity,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Collect' }
    },
    function () {
      console.log('Collected red seed')
      engine.removeEntity(redSeedEntity)
      collectedSeeds.red = true
      collectedSeedCount++
      checkIfAllSeedsCollected()
    }
  )

  pointerEventsSystem.onPointerDown(
    {
      entity: blueSeedEntity,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Collect' }
    },
    function () {
      console.log('Collected blue seed')
      engine.removeEntity(blueSeedEntity)
      collectedSeeds.blue = true
      collectedSeedCount++
      checkIfAllSeedsCollected()
    }
  )

  pointerEventsSystem.onPointerDown(
    {
      entity: yellowSeedEntity,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Collect' }
    },
    function () {
      console.log('Collected yellow seed')
      engine.removeEntity(yellowSeedEntity)
      collectedSeeds.yellow = true
      collectedSeedCount++
      checkIfAllSeedsCollected()
    }
  )

  function checkIfAllSeedsCollected() {
    if (collectedSeedCount === 3) {
      setupUi()
      spawnBoss()
    }
  }
}

export function spawnBoss() {
  // Create entities for each seed
  let boss = engine.addEntity()

  GltfContainer.create(boss, {
    src: 'models/ghost.glb'
  })

  Transform.create(boss, {
    position: Vector3.create(2.95, 0.88, 21.4),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
}
