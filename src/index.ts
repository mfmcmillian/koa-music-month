import {
  Animator,
  AudioSource,
  AvatarAttach,
  engine,
  GltfContainer,
  pointerEventsSystem,
  Transform,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

// You can remove this if you don't use any asset packs
initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  AudioSource,
  AvatarAttach,
  Transform,
  VisibilityComponent,
  GltfContainer
})
import { setupUi } from './ui'
import { creatAntrom } from './antrom'

export function main() {
  //setupUi()
  creatAntrom()
}
