import { ColliderLayer, Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { actionEvents } from './events'
import * as utils from '@dcl-sdk/utils'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export function makeQuestCollectible(entity: Entity, questId: string, addCollider?: boolean) {
  pointerEventsSystem.onPointerDown(
    {
      entity: entity,
      opts: {
        button: InputAction.IA_PRIMARY,
        hoverText: 'Collect'
      }
    },
    () => {
      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: questId }
      })
      const currentScale = Transform.get(entity).scale
      utils.tweens.startScaling(entity, currentScale, Vector3.Zero(), 0.5, utils.InterpolationType.EASEOUTEBOUNCE)
    }
  )

  if (addCollider) {
    const mutableGLTF = GltfContainer.getMutable(entity)
    mutableGLTF.invisibleMeshesCollisionMask = undefined
    mutableGLTF.visibleMeshesCollisionMask = ColliderLayer.CL_POINTER
  }
}

export function addCollectibles() {
  // fetch models from Inspector
  let redSeedEntity = engine.addEntity()
  let blueSeedEntity = engine.addEntity()
  let yellowSeedEntity = engine.addEntity()
  let redSeedEntity1 = engine.addEntity()
  let blueSeedEntity1 = engine.addEntity()
  let yellowSeedEntity1 = engine.addEntity()
  let redSeedEntity2 = engine.addEntity()
  let blueSeedEntity2 = engine.addEntity()
  let yellowSeedEntity2 = engine.addEntity()
  //let item = engine.addEntity()
  //   let item2 = engine.addEntity()
  //   let item3 = engine.addEntity()
  //   let item4 = engine.addEntity()

  GltfContainer.create(redSeedEntity, {
    src: 'models/red.glb'
  })
  GltfContainer.create(blueSeedEntity, {
    src: 'models/blue.glb'
  })
  GltfContainer.create(yellowSeedEntity, {
    src: 'models/yellow.glb'
  })

  GltfContainer.create(redSeedEntity1, {
    src: 'models/red2.glb'
  })
  GltfContainer.create(blueSeedEntity1, {
    src: 'models/blue.glb'
  })
  GltfContainer.create(yellowSeedEntity1, {
    src: 'models/yellow.glb'
  })

  GltfContainer.create(redSeedEntity2, {
    src: 'models/red.glb'
  })
  GltfContainer.create(blueSeedEntity2, {
    src: 'models/blue.glb'
  })
  GltfContainer.create(yellowSeedEntity2, {
    src: 'models/yellow.glb'
  })

  Transform.create(redSeedEntity, {
    position: Vector3.create(12.28, 8.9, 1.97),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(blueSeedEntity, {
    position: Vector3.create(24.55, 2.04, 19.81),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(yellowSeedEntity, {
    position: Vector3.create(17.21, 0.88, 4.86),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })

  Transform.create(redSeedEntity1, {
    position: Vector3.create(5.14, 7.22, 15.97),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(blueSeedEntity1, {
    position: Vector3.create(28.77, 1.98, 10.17),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(yellowSeedEntity1, {
    position: Vector3.create(30.04, 1.04, 29.68),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(redSeedEntity2, {
    position: Vector3.create(5.47, 4.91, 22.16),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(blueSeedEntity2, {
    position: Vector3.create(1.19, 0.88, 1.73),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  Transform.create(yellowSeedEntity2, {
    position: Vector3.create(9.67, 0.88, 14.52),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  //   Transform.create(item, {
  //     position: Vector3.create(16.04, 1.88, 16.01),
  //     rotation: Quaternion.create(0, 1, 0, 0),
  //     scale: Vector3.create(1, 1, 1)
  //   })
  if (redSeedEntity && blueSeedEntity && yellowSeedEntity) {
    makeQuestCollectible(redSeedEntity, 'collect_vine_action', true)
    makeQuestCollectible(blueSeedEntity, 'collect_berry_action', true)
    makeQuestCollectible(yellowSeedEntity, 'collect_kimkim_action', true)
    makeQuestCollectible(redSeedEntity1, 'collect_vine_action', true)
    makeQuestCollectible(blueSeedEntity1, 'collect_berry_action', true)
    makeQuestCollectible(yellowSeedEntity1, 'collect_kimkim_action', true)
    makeQuestCollectible(redSeedEntity2, 'collect_vine_action', true)
    makeQuestCollectible(blueSeedEntity2, 'collect_berry_action', true)
    makeQuestCollectible(yellowSeedEntity2, 'collect_kimkim_action', true)
    // makeQuestCollectible(item, 'calis_action', true)
    // makeQuestCollectible(calis2, 'calis_action', true)
    // makeQuestCollectible(calis3, 'calis_action', true)
    // makeQuestCollectible(calis4, 'calis_action', true)
  }
}

export function addStrings() {
  // fetch models from Inspector

  let item = engine.addEntity()

  GltfContainer.create(item, {
    src: 'models/lutestrings.glb'
  })

  Transform.create(item, {
    position: Vector3.create(2.06, 1.84, 25.0),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
  if (item) {
    makeQuestCollectible(item, 'calis_action', true)
    // makeQuestCollectible(calis2, 'calis_action', true)
    // makeQuestCollectible(calis3, 'calis_action', true)
    // makeQuestCollectible(calis4, 'calis_action', true)
  }
}
