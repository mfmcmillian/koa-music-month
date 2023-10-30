import { creatAntrom } from './antrom'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as npc from 'dcl-npc-toolkit'
import { Dialog } from 'dcl-npc-toolkit'
import { spawnSeeds } from './factory'
import { createVideoScreens } from './videoScreens'
import { executeTask } from '@dcl/sdk/ecs'
import { createQuestsClient, QuestInstance } from '@dcl/quests-client'
import { pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { addNPCs } from './npcs'
import { startEvent, actionEvents, questProgress } from './events'
import { addCollectibles, makeQuestCollectible } from './quest_collectibles'
import { hud, setupUi } from './setupUI'
import { createQuestHUD, QuestUI } from '@dcl/quests-client/dist/hud'
import { placeInHand } from './drink'
import { Action } from '@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen'
import { spawnCat } from './cats'

const serviceUrl = 'wss://quests-rpc.decentraland.org'
const QUEST_ID = '919c0fc0-6c19-4d4d-ae4c-b1e8c9d226e7'

export enum StepsEnum {
  not_started = 0,
  talk_octo_1_step = 1,
  catGuy_step = 2,
  talk_octo_2_step = 3,
  collect_herbs = 4,
  talk_octo_3_step = 5,
  calis_step = 6,
  talk_octo_4_step = 7
}

export function main() {
  creatAntrom()
  // spawnSeeds()
  createVideoScreens()
  executeTask(async () => {
    try {
      const questsClient = await createQuestsClient(serviceUrl, QUEST_ID)
      console.log('Quests Client is ready to use!')

      // update in case player had already stated quest
      const currentProgress = questsClient.getQuestInstance()
      if (currentProgress) {
        console.log('QUEST WAS ALREADY STARTED ', currentProgress)
        updateInternalState(currentProgress)
        hud.upsert(currentProgress)
      }

      // update when player makes progress
      questsClient.onUpdate((questInstance) => {
        console.log('QUEST UPDATE ARRIVED ', questInstance)
        updateInternalState(questInstance)
        hud.upsert(questInstance)
      })

      // check if already started, if not then start
      startEvent.on('start', async () => {
        console.log('quest stated: CALLING START QUEST')
        const instances = questsClient.getInstances()
        let found: boolean = false
        instances.forEach((quest) => {
          if (quest.id === QUEST_ID) {
            found = true
          }
        })
        console.log('quest: WAS ID FOUND? ', found)

        if (!found) {
          await questsClient.startQuest()
        }
      })

      // react to the start of your Quest
      questsClient.onStarted((quest: QuestInstance) => {
        hud.upsert(quest)
      })

      // forward completed actions to server
      actionEvents.on('action', async (action: Action) => {
        console.log('SENDING QUEST ACTION TO SERVER, ', action)
        await questsClient.sendEvent({ action })
      })
    } catch (e) {
      console.error('Error on connecting to Quests Service')
    }
  })

  // add NPC characters
  addNPCs()

  // set up quest and NPC UI
  setupUi()

  // add plants and calis
  //addCollectibles()
}

function updateInternalState(questInstance: QuestInstance) {
  if (questInstance.quest.id === QUEST_ID) {
    for (let step of questInstance.state.stepsCompleted) {
      switch (step) {
        case 'talk_octo_1_step':
          questProgress.emit('step', StepsEnum.talk_octo_1_step)
          break
        case 'catGuy_step':
          questProgress.emit('step', StepsEnum.catGuy_step)
          break
        case 'talk_octo_2_step':
          questProgress.emit('step', StepsEnum.talk_octo_2_step)
          break
        case 'collect_herbs':
          questProgress.emit('step', StepsEnum.collect_herbs)
          break
        case 'talk_octo_3_step':
          questProgress.emit('step', StepsEnum.talk_octo_3_step)
          break
        case 'calis_step':
          questProgress.emit('step', StepsEnum.calis_step)
          break
        case 'talk_octo_4_step':
          questProgress.emit('step', StepsEnum.talk_octo_4_step)
          break
      }
    }
  }
}
