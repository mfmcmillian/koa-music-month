import {
  AvatarAnchorPointType,
  AvatarAttach,
  AvatarModifierArea,
  CameraMode,
  CameraModeArea,
  CameraType,
  GltfContainer,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export function placeInHand() {
  const calisParent = engine.addEntity()
  AvatarAttach.create(calisParent, {
    anchorPointId: AvatarAnchorPointType.AAPT_LEFT_HAND
  })

  const calis = engine.addEntity()
  Transform.create(calis, {
    position: Vector3.create(.022,.1,.28),
    rotation: Quaternion.fromEulerDegrees(0,85,-95),
    parent: calisParent
  })
  GltfContainer.create(calis, {
    src: 'models/lute.glb'
  })

  //   const camearaModifier = engine.addEntity()
  //   AvatarAttach.create(camearaModifier)

  //   CameraModeArea.create(camearaModifier, {
  //     area: Vector3.create(10, 10, 10),
  //     mode: CameraType.CT_FIRST_PERSON
  //   })
}
