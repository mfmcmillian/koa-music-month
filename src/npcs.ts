import { Entity, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as npc from 'dcl-npc-toolkit'
import { startEvent, actionEvents, questProgress } from './events'
import { catIsOut, spawnCat } from './cats'
import { StepsEnum } from '.'
import * as utils from '@dcl-sdk/utils'
import { placeInHand } from './drink'
import { addCollectibles, addStrings } from './quest_collectibles'
import {addAttackInputs, spawnBoss} from "./factory";

let octo: Entity
let catGuy: Entity
let villager1: Entity
let villager2: Entity
let villager3: Entity
let villager4: Entity
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
      position: Vector3.create(16.37, 0, 29.22),
      rotation: Quaternion.create(0, 1, 0, 0),
      scale: Vector3.create(1, 1, 1)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/Druid.glb',
      onActivate: () => {
        console.log('quest: ACTIVATED NPC')
        npc.playAnimation(octo, 'talk', true, 30)
        npc.changeIdleAnim(octo, 'idle')
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
      idleAnim: 'idle',
      faceUser: true,
      reactDistance: 4,
      onWalkAway: () => {
        backToIdle()
      }
    }
  )

  catGuy = npc.create(
    {
      position: Vector3.create(26.28, 0, 28.39),
      rotation: Quaternion.create(0, 1, 0, 0),
      scale: Vector3.create(1.2, 1.2, 1.2)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/Alchemist.glb',
      reactDistance: 4,
      idleAnim: `idle`,
      faceUser: true,
      hoverText: 'Talk to Leofwine',
      portrait: `images/portraits/alchemist.png`,
      //dialogSound: `sounds/navigationForward.mp3`,
      onActivate: () => {
        console.log('npc activated')
        if (octoState === StepsEnum.talk_octo_1_step) {
          npc.talk(catGuy, catQuest)
          npc.playAnimation(catGuy, `talk`)
        } else {
          npc.talk(catGuy, catQuest2)
          npc.playAnimation(catGuy, `talk`)
        }
      },
      onWalkAway: () => {
        npc.playAnimation(catGuy, `idle`)
      }
    }
  )

  villager1 = npc.create(
    {
      position: Vector3.create(6.46, 0, 30.24),
      rotation: Quaternion.create(0, 1, 0, 0),
      scale: Vector3.create(1.2, 1.2, 1.2)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/villager1.glb',
      reactDistance: 2,
      idleAnim: `idle`,
      faceUser: true,
      hoverText: 'Talk to Tarven owner',
      portrait: `images/portraits/advWoodTrader.png`,
      //dialogSound: `sounds/navigationForward.mp3`,
      onActivate: () => {
        if (octoState === StepsEnum.talk_octo_1_step) {
          npc.talk(villager1, villager1QuestStarted)
          npc.playAnimation(villager1, `talk`)
        } else {
          npc.talk(villager1, villager1Quest)
          npc.playAnimation(villager1, `talk`)
        }
      },
      onWalkAway: () => {
        npc.playAnimation(villager1, `idle`)
      }
    }
  )

  villager2 = npc.create(
    {
      position: Vector3.create(10.56, 0, 25.09),
      rotation: Quaternion.create(0, 0, 0, 0),
      scale: Vector3.create(1.2, 1.2, 1.2)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/villager2.glb',
      reactDistance: 1,
      idleAnim: `idle`,
      faceUser: true,
      hoverText: 'Talk to Frank',
      portrait: `images/portraits/advIronTrader.png`,
      //dialogSound: `sounds/navigationForward.mp3`,
      onActivate: () => {
        if (octoState === StepsEnum.talk_octo_1_step) {
          npc.talk(villager2, villager1Quest)
          npc.playAnimation(villager2, `talk`)
        } else {
          npc.talk(villager2, villager2Quest)
          npc.playAnimation(villager2, `talk`)
        }
      },
      onWalkAway: () => {
        npc.playAnimation(villager2, `idle`)
      }
    }
  )

  villager3 = npc.create(
    {
      position: Vector3.create(7.52, 0, 16.8),
      rotation: Quaternion.create(0, 1, 0, 0),
      scale: Vector3.create(1, 1, 1)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/witch.glb',
      reactDistance: 1,
      idleAnim: `idle`,
      faceUser: true,
      hoverText: 'Talk to Haggy',
      portrait: `images/portraits/witch.png`,
      //dialogSound: `sounds/navigationForward.mp3`,
      onActivate: () => {
        if (octoState === StepsEnum.talk_octo_1_step) {
          npc.talk(villager3, villager1QuestStarted)
          npc.playAnimation(villager3, `talk`)
        } else {
          npc.talk(villager3, villager3Quest)
          npc.playAnimation(villager3, `talk`)
        }
      },
      onWalkAway: () => {
        npc.playAnimation(villager3, `idle`)
      }
    }
  )

  villager4 = npc.create(
    {
      position: Vector3.create(9.28, 3.99, 26.34),
      rotation: Quaternion.create(0, 1, 0, 0),
      scale: Vector3.create(1.2, 1.2, 1.2)
    },
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/villager3.glb',
      reactDistance: 1,
      idleAnim: `idle`,
      faceUser: true,
      hoverText: 'Talk to Jorge',
      portrait: `images/portraits/advBoneTrader.png`,
      //dialogSound: `sounds/navigationForward.mp3`,
      onActivate: () => {
        if (octoState === StepsEnum.talk_octo_1_step) {
          npc.talk(villager4, villager1QuestStarted)
          npc.playAnimation(villager4, `talk`)
        } else {
          npc.talk(villager4, villager4Quest)
          npc.playAnimation(villager4, `talk`)
        }
      },
      onWalkAway: () => {
        npc.playAnimation(villager4, `idle`)
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
    text: 'So, what brings you back here to my little corner of the town?',
    skipable: true
  },
  {
    text: "You're on a quest to restore the Lute of Antrom? That's a noble task!",
    skipable: true
  },
  {
    text: 'I can help you with one of its components.',
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

export let catQuest2: npc.Dialog[] = [
  {
    text: "Welcome, I'm Leofwine, the great wizard and musician of Antrom!",
    skipable: true
  },
  {
    text: "The Bard? Even my great powers can't stop her from stealing our melodies. If only someone were brave enough to restore the Lute of Antrom.",
    skipable: true,
    isEndOfDialog: true
  }
]

export let villager1Quest: npc.Dialog[] = [
  {
    text: "Well, howdy there! You look like you're new in these parts. I'm David, the owner of the local watering hole in Antrom.",
    skipable: true
  },
  {
    text: "Magic lute? You'll wanna mosey on over to the market square and find Eurick, our resident Shaman. They know a thing or two 'bout the trouble brewin' in town.",
    skipable: true
  },
  {
    text: 'Good luck on your quest!',
    skipable: true,
    isEndOfDialog: true
  }
]

export let villager1QuestStarted: npc.Dialog[] = [
  {
    text: 'Good luck on your quest!',
    skipable: true,
    isEndOfDialog: true
  }
]

export let villager2Quest: npc.Dialog[] = [
  {
    text: 'Hi, Im Frank. Im not a local, just here in town for the festival.',
    skipable: true,
    isEndOfDialog: true
  }
]

export let villager3Quest: npc.Dialog[] = [
  {
    text: "I love this music! Here's the schedule for the weekend:",
    skipable: true
  },
  {
    text: 'NessyTheRilla | Fri 17 Nov | 1am UTC ',
    skipable: true
  },
  {
    text: 'DJTrax | Fri 17 Nov | 8pm UTC',
    skipable: true
  },
  {
    text: 'Apropos | Fri 17 Nov | Midnight UTC',
    skipable: true
  },
  {
    text: 'Id hate to see this wonderful music fall into the hands of the Bard!',
    skipable: true,
    isEndOfDialog: true
  }
]

export let villager4Quest: npc.Dialog[] = [
  {
    text: 'Knights of Antrom is located at 144,-7 (More information about Antrom)',
    skipable: true,
    isEndOfDialog: true
  }
]

export let OctoQuest: npc.Dialog[] = [
  {
    name: 'questQ',
    text: 'Antrom is in grave danger. An evil Bard is terrorizing our town. We need your help.',
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
    text: "First, you must obtain the Lute's body from Leofwine, the musician in town. He holds a vital piece of the lute. Seek him out.",
    skipable: true
  },
  {
    text: "Return to me with all the components, and I'll repair the Lute of Antrom. Then, you'll be ready to face the evil Bard!",
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
    text: `The Lute's Melodies are the key to its power.`,
    skipable: true
  },
  {
    text: `Each melodies has its unique magic. The red melody is known for its soothing and calming influence.`,
    skipable: true
    // image: {
    //   path: 'images/quest/woodsMelody.png',
    //   offsetY: 20,
    //   offsetX: -450,
    //   section: { sourceHeight: 512, sourceWidth: 512 }
    // }
  },
  {
    text: `The green melodies holds an enigmatic and mysterious power.`,
    skipable: true
    // image: {
    //   path: 'images/quest/cavernsMelody.png',
    //   offsetY: 10,
    //   offsetX: -450,
    //   section: { sourceHeight: 512, sourceWidth: 512 }
    // }
  },
  {
    text: `The yellow melodies is said to be full of vitality and life.`,
    skipable: true
    // image: {
    //   path: 'images/quest/lakeMelody.png',
    //   offsetY: 15,
    //   offsetX: -450,
    //   section: { sourceHeight: 512, sourceWidth: 512 }
    // }
  },
  {
    text: `Find these melodies, and you'll be one step closer to restoring the Lute of Antrom. Return to me when you have all nine.`,
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
      // actionEvents.emit('action', {
      //   type: 'CUSTOM',
      //   parameters: { id: 'talk_octo_4_action' }
      // })
      placeInHand()
      backToIdle()
      spawnBoss()
      addAttackInputs()
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
