import { Animator, ColliderLayer, InputAction, MeshCollider, PointerEvents, Transform } from '@dcl/sdk/ecs'
import { GltfContainer } from '@dcl/sdk/ecs'
import { pointerEventsSystem } from '@dcl/sdk/ecs'
import { engine } from '@dcl/sdk/ecs'
import { Quaternion } from '@dcl/sdk/math'
import { Vector3 } from '@dcl/sdk/math'
import { startEvent, actionEvents, questProgress } from './events'
import * as utils from '@dcl-sdk/utils'
import { StepsEnum } from '.'

export let catIsOut: boolean = false

export function spawnCat() {
  if (catIsOut) return
  catIsOut = true

  const initialPosition = Vector3.create(25.67, 1, 28.82)
  const initialRotation = Quaternion.create(0, 1, 0, 0)
  const endPosition = Vector3.add(initialPosition, Vector3.rotate(Vector3.Forward(), initialRotation))

  const cat = engine.addEntity()
  Transform.create(cat, {
    position: initialPosition,
    rotation: initialRotation,
    scale: Vector3.create(1, 1, 1)
  })

  GltfContainer.create(cat, {
    src: 'models/lute.glb',
    visibleMeshesCollisionMask: ColliderLayer.CL_POINTER
  })

  MeshCollider.setBox(cat)

  pointerEventsSystem.onPointerDown(
    {
      entity: cat,
      opts: {
        button: InputAction.IA_PRIMARY,
        hoverText: 'Collect Lute body'
      }
    },
    () => {
      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'get_hair_action' }
      })
      const currentScale = Transform.get(cat).scale
      utils.tweens.startScaling(cat, currentScale, Vector3.Zero(), 0.5, utils.InterpolationType.EASEOUTEBOUNCE)
    }
  )

  utils.tweens.startTranslation(cat, initialPosition, endPosition, 2, utils.InterpolationType.LINEAR, () => {
    Animator.stopAllAnimations(cat)
    Animator.playSingleAnimation(cat, 'idle')
  })

  Animator.create(cat, {
    states: [
      {
        clip: 'run',
        loop: true,
        playing: true
      },
      {
        clip: 'idle',
        loop: true,
        playing: true
      }
    ]
  })

  questProgress.on('step', (stepNumber: number) => {
    if (!catIsOut) return
    // remove click from cat
    if (stepNumber == StepsEnum.catGuy_step) {
      PointerEvents.deleteFrom(cat)
    }
  })
}
