import { createQuestHUD } from '@dcl/quests-client/dist/hud'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit'
import { bossUi } from './boss.ui'
import DanceUI from './dance.ui'

export const hud = createQuestHUD({
  leftSidePanel: {
    position: {
      top: '30%'
    }
  }
})

const questComponent = hud.getHUDComponent()

const SceneOwnedUi = () => [
  // other UI elements
  NpcUtilsUi(),
  questComponent(),
  DanceUI(),
  bossUi(),

  // other UI elements
]

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(SceneOwnedUi)
}
