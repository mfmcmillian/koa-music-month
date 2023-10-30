import { Entity, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as npc from 'dcl-npc-toolkit'
import { startEvent, actionEvents, questProgress } from './events'
import { catIsOut, spawnCat } from './cats'
import { StepsEnum } from '.'
import * as utils from '@dcl-sdk/utils'
import { placeInHand } from './drink'
import { addCollectibles, addStrings } from './quest_collectibles'

let octo: Entity
let catGuy: Entity
export let octoState: StepsEnum = StepsEnum.not_started

export function addNPCs() {
  questProgress.on('step', (stepNumber: StepsEnum) => {
    if (stepNumber <= octoState) return
    octoState = stepNumber
    console.log('QUEST, NEW OCTOSTATE NUBMER: ', octoState)

    if (catIsOut && octoState == StepsEnum.catGuy_step) {
      npc.talk(catGuy, catQuest, `collect`) //5
    }
  })

  octo = npc.create(
    {
      position: Vector3.create(13.41, 0, 25.83),
      rotation: Quaternion.fromEulerDegrees(0, 25, 0),
      scale: Vector3.create(1, 1, 1)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/Druid.glb',
      onActivate: () => {
        console.log('quest: ACTIVATED NPC')
        npc.playAnimation(octo, 'TalkIntro', true, 0.63)
        npc.changeIdleAnim(octo, 'TalkLoop')
        switch (octoState) {
          case StepsEnum.not_started:
            startEvent.emit('start')
            npc.talk(octo, OctoQuest, 'questQ') // 0
            break
          case StepsEnum.talk_octo_1_step:
            npc.talk(octo, OctoQuest, 'noHairs') //21
            break
          case StepsEnum.catGuy_step:
            npc.talk(octo, OctoQuest, 'quest2') // 8
            break
          case StepsEnum.talk_octo_2_step:
            npc.talk(octo, OctoQuest, 'noHerbs') // 9
            break
          case StepsEnum.collect_herbs:
            npc.talk(octo, OctoQuest, 'quest3') // 16
            break
          case StepsEnum.talk_octo_3_step:
            npc.talk(octo, OctoQuest, 'makeLute') // 19
            break
          case StepsEnum.calis_step:
            npc.talk(octo, OctoQuest, 'restoreLute') //21
            break
          case StepsEnum.talk_octo_4_step:
            npc.talk(octo, OctoQuest, 'done') // 23
            break
        }
      },
      portrait: `images/portraits/druid.png`,
      //dialogSound: `sounds/navigationForward.mp3`,
      idleAnim: 'Idle',
      faceUser: false,
      reactDistance: 8,
      onWalkAway: () => {
        backToIdle()
      }
    }
  )

  catGuy = npc.create(
    { position: Vector3.create(28.96, 0, 17.08), rotation: Quaternion.fromEulerDegrees(0, -90, 0) },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/Catgirl.glb',
      reactDistance: 9,
      idleAnim: `idle`,
      faceUser: false,
      hoverText: 'Talk to Catrina',
      //dialogSound: `sounds/navigationForward.mp3`,
      onActivate: () => {
        console.log('npc activated')
        if (octoState === StepsEnum.talk_octo_1_step) {
          npc.talk(catGuy, catQuest)
          npc.playAnimation(catGuy, `talk`)
        }
      },
      onWalkAway: () => {
        npc.playAnimation(catGuy, `idle`)
      }
    }
  )
}

export function backToIdle() {
  npc.changeIdleAnim(octo, 'Idle')
  npc.playAnimation(octo, 'TalkOutro', true, 0.63)
}

export let catQuest: npc.Dialog[] = [
  {
    text: "Hey there! Let me introduce myself. I'm Catrina, the musician of Antrom.",
    skipable: true
  },
  {
    text: "That's what everyone calls me. Well, except my beloved cats. They have their own special names for me.",
    skipable: true
  },
  {
    text: 'So, what brings you here to my little corner of the town?',
    skipable: true
  },
  {
    text: "You're on a quest to restore the Lute of Antrom? That's a noble task! I can help you with one of its components.",
    skipable: true,
    triggeredByNext: () => {
      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'talk_catguy_action' }
      })

      if (!catIsOut) {
        spawnCat()
      }
    }
  },
  {
    text: "Here is the Lute's body. It holds a piece of the Lute's essence. It's a vital part of the instrument.",
    skipable: true,
    isEndOfDialog: true
  },
  {
    name: 'collect',
    text: 'Handle it with care. This piece is precious and holds the power to restore the Lute of Antrom.',
    isEndOfDialog: true
  }
]

export let OctoQuest: npc.Dialog[] = [
  {
    name: 'questQ',
    text: 'Antrom is in grave danger. An evil Bard and her army of killer scarecrows are terrorizing our town. We need your help.',
    skipable: true
  },
  {
    text: 'The only hope we have is to restore the magical Lute of Antrom. With its melodies, you can defeat the Bard and save our town. Will you accept this quest?',
    isQuestion: true,
    buttons: [
      {
        label: 'YES',
        goToDialog: 3, // 'quest1',
        triggeredActions: () => {
          actionEvents.emit('action', {
            type: 'CUSTOM',
            parameters: { id: 'talk_octo_1_action' }
          })
        }
      },
      {
        label: 'NO',
        goToDialog: 2 // 'end'
      }
    ]
  },
  {
    name: 'end',
    text: 'The fate of Antrom is in your hands. Return to me if you change your mind or need guidance.',
    triggeredByNext: () => {
      console.log('ended conversation')
      backToIdle()
    },
    isEndOfDialog: true
  },
  {
    name: 'quest1',
    text: 'Thank you for accepting this quest. The Lute of Antrom was shattered into pieces. To restore it, we need to gather its components.',
    skipable: true
  },
  {
    text: "First, you must obtain the Lute's body from Catrina, the musician in town. She holds a vital piece of the lute. Seek her out.",
    skipable: true
  },
  {
    text: "Once you have the Lute's body, we need to collect melodies from three different sources. Each melody is a key to the Lute's power.",
    skipable: true
  },
  {
    text: "You'll find these melodies in the following places: one from the Whispering Woods, one from the Dark Caverns, and one from the Enchanted Lake.",
    skipable: true
  },
  {
    text: "After collecting the melodies, the final component is a Lute String. You can find it in the local tavern. This string is crucial for the lute's resonance.",
    skipable: true
  },
  {
    text: "Return to me with all the components, and I'll repair the Lute of Antrom. Then, you'll be ready to face the evil Bard and her scarecrow army.",
    skipable: true,
    triggeredByNext: () => {
      backToIdle()

      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'talk_octo_2_action' }
      })
    },
    isEndOfDialog: true
  },
  {
    name: 'noComponents',
    text: 'It seems you are missing some components. Come back when you have gathered all the necessary parts for the Lute of Antrom.',
    skipable: true,
    triggeredByNext: () => {
      backToIdle()
    }
  },
  {
    text: 'Would you like to review the components you need to collect?',
    isQuestion: true,
    buttons: [
      {
        label: 'YES',
        goToDialog: 9 // 'components',
      },
      {
        label: 'NO',
        goToDialog: 'end'
      }
    ],
    isEndOfDialog: true
  },
  {
    name: 'quest2',
    text: `Great! Now that you have the Lute's body, it's time to gather the Lute's Melodies.`,
    skipable: true
  },
  {
    text: `The Lute's Melodies are the key to its power. They can be found in three different places: the Whispering Woods, the Dark Caverns, and the Enchanted Lake.`,
    skipable: true
  },
  {
    text: `Each melody has its unique magic. The Whispering Woods melody is known for its soothing and calming influence.`,
    skipable: true,
    image: {
      path: 'images/quest/woodsMelody.png',
      offsetY: 20,
      offsetX: -450,
      section: { sourceHeight: 512, sourceWidth: 512 }
    }
  },
  {
    text: `The Dark Caverns melody holds an enigmatic and mysterious power. It's hidden in the depths of the caverns.`,
    skipable: true,
    image: {
      path: 'images/quest/cavernsMelody.png',
      offsetY: 10,
      offsetX: -450,
      section: { sourceHeight: 512, sourceWidth: 512 }
    }
  },
  {
    text: `The Enchanted Lake melody is said to be full of vitality and life. It's located near the magical lake in our town.`,
    skipable: true,
    image: {
      path: 'images/quest/lakeMelody.png',
      offsetY: 15,
      offsetX: -450,
      section: { sourceHeight: 512, sourceWidth: 512 }
    }
  },
  {
    text: `Find these melodies, and you'll be one step closer to restoring the Lute of Antrom. Return to me when you have all three.`,
    skipable: true,
    triggeredByNext: () => {
      backToIdle()
      addCollectibles()
      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'talk_octo_2_action' }
      })
    },
    isEndOfDialog: true
  },

  {
    name: 'makeLute',
    text: "You've gathered all the components needed to repair the Lute of Antrom. I will now work on restoring the lute's power.",
    triggeredByNext: () => {
      placeInHand()
      npc.playAnimation(octo, 'CalisPrep', true, 7.17)
      utils.timers.setTimeout(() => {
        npc.talk(octo, OctoQuest, 'restoreLute')
        //placeInHand()
      }, 7250)
    },
    isEndOfDialog: true
  },
  {
    name: 'restoreLute',
    text: 'The Lute of Antrom is now restored. It is a powerful instrument with melodies that can vanquish the evil Bard and her scarecrow army.',
    triggeredByNext: () => {
      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'talk_octo_4_action' }
      })

      backToIdle()
    },
    isEndOfDialog: true
  },
  {
    name: 'done',
    text: "You've done a great service for Antrom. The town is in your debt. Use the Lute's melodies wisely, and may you succeed in defeating the evil Bard.",
    isEndOfDialog: true
  },

  {
    name: 'noHairs',
    text: "We're still missing a crucial component, the Lute's body. I cannot proceed without it; it's an essential part of the Lute of Antrom.",
    skipable: true,
    triggeredByNext: () => {
      backToIdle()
    },
    isEndOfDialog: true
  },

  {
    name: 'noHerbs',
    text: "It seems we're missing something crucial. Without all the required components, we can't proceed with restoring the Lute of Antrom.",
    skipable: true,
    triggeredByNext: () => {
      backToIdle()
    }
  },
  {
    text: "Would you like to review the components you need to collect for the lute's restoration?",
    isQuestion: true,
    buttons: [
      {
        label: 'YES',
        goToDialog: 9 // 'components',
      },
      { label: 'NO', goToDialog: 'end' }
    ]
  },

  {
    name: 'quest3',
    text: "Excellent, you've collected all the vital components for the Lute of Antrom. Your dedication is impressive!",
    skipable: true
  },
  {
    text: "However, we can't use the lute in its current state. It requires one more essential part—a magical Lute String.",
    skipable: true
  },
  {
    text: "I've heard that the local tavern might have a unique Lute String. Visit the tavern and see if you can acquire it for our cause.",
    skipable: true
  },
  {
    text: 'Once you have the Lute String in your possession, return to me. With it, we can complete the restoration of the Lute of Antrom.',
    triggeredByNext: () => {
      actionEvents.emit('action', {
        type: 'CUSTOM',
        parameters: { id: 'talk_octo_3_action' }
      })
      backToIdle()
      addStrings()
    },
    isEndOfDialog: true
  }
]
