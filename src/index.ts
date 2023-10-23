import { creatAntrom } from './antrom'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as npc from 'dcl-npc-toolkit'
import { Dialog } from 'dcl-npc-toolkit'
import { spawnSeeds } from './factory'

export function main() {
  creatAntrom()
  spawnSeeds()
  let ILoveCats: Dialog[] = [
    {
      text: `Help! A rogue bard from the next town has stolen and scattered all my magical musical seeds. Find all 3 seeds and plant them to grow the Plant of Harmony. Each seed will give you a skill to fight the enemy (attack, block, heal). Climb the plant to defeat the rogue bard boss to restore peace to Antrom!`
    },
    {
      text: `To complete your quest, you must follow these steps: 
            \n1. Find and collect all 3 magical musical seeds.`
    },
    {
      text: `\n2. Plant the seeds to grow the Plant of Harmony and unlock the skills (attack, block, heal). 
             \n3. Climb the fully-grown plant to face the rogue bard boss.`
    },
    {
      text: `\nYour goal is to restore peace to Antrom by defeating the rogue bard and recovering the stolen musical seeds.`
    },
    {
      text: `Coordinate with fellow adventurers to combine your skills and strategize for the final battle! You've got this!`,

      isEndOfDialog: true,
      triggeredByNext: () => {
        // Spawn 3 music notes
        spawnSeeds()
        console.log('spawning seeds')
      }
    }
  ]

  let myNPC = npc.create(
    {
      position: Vector3.create(14.63, 0, 15.06),
      rotation: Quaternion.fromEulerDegrees(0, 25, 0),
      scale: Vector3.create(1, 1, 1)
    },
    //NPC Data Object
    {
      type: npc.NPCType.CUSTOM,
      model: 'models/GirlLP.glb',
      reactDistance: 3,
      onlyClickTrigger: true,
      onlyETrigger: true,
      textBubble: true,
      idleAnim: 'cry',
      bubbleXOffset: 0.75,
      bubbleYOffset: -0.4,

      onActivate: () => {
        console.log('npc activated')
        //npc.talk(myNPC, ILoveCats)

        npc.talkBubble(myNPC, ILoveCats)
      }
    }
  )
}
