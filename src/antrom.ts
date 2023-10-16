import { ColliderLayer, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export function creatAntrom() {
  const zombiehouse = engine.addEntity()

  GltfContainer.create(zombiehouse, {
    src: 'models/NewAntrom2x2.glb',
    invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
  })

  Transform.create(zombiehouse, {
    position: Vector3.create(16, -1, 16),
    rotation: Quaternion.create(0, 1, 0, 0),
    scale: Vector3.create(1, 1, 1)
  })
}
