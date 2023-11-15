import {
    Animator,
    AudioSource,
    AvatarAnchorPointType,
    AvatarAttach,
    engine,
    GltfContainer,
    InputAction,
    inputSystem,
    Material,
    MeshRenderer,
    pointerEventsSystem,
    PointerEventType,
    Transform
} from '@dcl/sdk/ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import {setupUi} from './ui'
import {triggerSceneEmote} from "~system/RestrictedActions";
import {buttonColors, decreaseScore, increaseScore, maxScore, score, setButtonColors} from "./boss.ui";

export function spawnSeeds() {
    // Create entities for each seed
    let redSeedEntity = engine.addEntity()
    let blueSeedEntity = engine.addEntity()
    let yellowSeedEntity = engine.addEntity()

    GltfContainer.create(redSeedEntity, {
        src: 'models/red.glb'
    })
    GltfContainer.create(blueSeedEntity, {
        src: 'models/blue.glb'
    })
    GltfContainer.create(yellowSeedEntity, {
        src: 'models/yellow.glb'
    })

    Transform.create(redSeedEntity, {
        position: Vector3.create(3.01, 0.88, 3.9),
        rotation: Quaternion.create(0, 1, 0, 0),
        scale: Vector3.create(1, 1, 1)
    })
    Transform.create(blueSeedEntity, {
        position: Vector3.create(6.51, 0.88, 3.33),
        rotation: Quaternion.create(0, 1, 0, 0),
        scale: Vector3.create(1, 1, 1)
    })
    Transform.create(yellowSeedEntity, {
        position: Vector3.create(3.08, 0.88, 5.51),
        rotation: Quaternion.create(0, 1, 0, 0),
        scale: Vector3.create(1, 1, 1)
    })

    let collectedSeedCount = 0

    let collectedSeeds = {
        red: false,
        blue: false,
        yellow: false
    }

    pointerEventsSystem.onPointerDown(
        {
            entity: redSeedEntity,
            opts: {button: InputAction.IA_POINTER, hoverText: 'Collect'}
        },
        function () {
            console.log('Collected red seed')
            engine.removeEntity(redSeedEntity)
            collectedSeeds.red = true
            collectedSeedCount++
            checkIfAllSeedsCollected()
        }
    )

    pointerEventsSystem.onPointerDown(
        {
            entity: blueSeedEntity,
            opts: {button: InputAction.IA_POINTER, hoverText: 'Collect'}
        },
        function () {
            console.log('Collected blue seed')
            engine.removeEntity(blueSeedEntity)
            collectedSeeds.blue = true
            collectedSeedCount++
            checkIfAllSeedsCollected()
        }
    )

    pointerEventsSystem.onPointerDown(
        {
            entity: yellowSeedEntity,
            opts: {button: InputAction.IA_POINTER, hoverText: 'Collect'}
        },
        function () {
            console.log('Collected yellow seed')
            engine.removeEntity(yellowSeedEntity)
            collectedSeeds.yellow = true
            collectedSeedCount++
            checkIfAllSeedsCollected()
        }
    )

    function checkIfAllSeedsCollected() {
        if (collectedSeedCount === 3) {
            setupUi()
            spawnBoss()
        }
    }
}


export const red = Color4.create(1, 0, 0, .1)
export const yellow = Color4.create(1, 1, 0, .1)
export const blue = Color4.create(0, 0, 1, .1)
const colors = [red, blue, yellow]

export const [bossE, orbE] = spawnBoss()

let curButton = -1


export function spawnBoss() {
    // Create entities for each seed
    let boss = engine.addEntity()

    GltfContainer.create(boss, {
        src: 'models/Bard.glb'
    })


    Animator.create(boss, {
        states: [
            {
                clip: 'attack',
                playing: true,
                loop: true,
            },
            {
                clip: 'die',
                playing: false,
                loop: false,
            }]
    })


    // Create AudioSource component
    AudioSource.create(boss, {
        audioClipUrl: 'sounds/boss_melody.mp3',
        loop: true,
        playing: true,
    })

    Transform.create(boss, {
        position: Vector3.create(19, 0, 14),
        rotation: Quaternion.fromEulerDegrees(0, -90, 0),
        scale: Vector3.create(2, 2, 2)
    })


    const orbE = engine.addEntity()
    MeshRenderer.setSphere(orbE)
    Transform.create(orbE, {
        parent: boss,
        scale: Vector3.create(2, 2, 2),
        position: Vector3.create(0, 1, .2),
    })
    Material.setPbrMaterial(orbE, {
        emissiveColor: Color4.create(1, 1, 1, .75),
        albedoColor: Color4.create(1, 1, 1, .1),
        metallic: 1,
    })

    let timer = 1
    const gameSystem = (dt: number) => {
        timer -= dt
        if (timer <= 0) {
            timer = 1

            console.log('timer')
            //Transform.getMutable(orbE).scale = Vector3.add(Transform.get(orbE).scale, Vector3.create(.5,.5,.5))

            const newColorPos = Math.floor(Math.random() * colors.length)

            const newColor = colors[newColorPos]

            setButtonColors(Color4.Gray(), Color4.Gray(), Color4.Gray())

            buttonColors[newColorPos] = Color4.Black()

            curButton = newColorPos

            Material.setPbrMaterial(orbE, {
                albedoColor: newColor,
                emissiveColor: newColor,
            })
        }
    }

    engine.addSystem(gameSystem)


    return [boss, orbE]
}


export function addAttackInputs() {

    engine.addSystem(() => {
        if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
            console.log('Attack button 1 pressed')

            if (curButton === 0) {
                console.log('correct button pressed')
                buttonColors[0] = Color4.Green()
                increaseScore()
            } else {
                console.log('incorrect button pressed')
                buttonColors[0] = Color4.Red()
                decreaseScore()

            }

            // Logic in response to button press
            triggerSceneEmote({src: 'models/Lute_Emote.glb'})

            // Create entity
            const sourceEntity = engine.addEntity()
            AvatarAttach.create(sourceEntity, {
                anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
            })

            // Create AudioSource component
            AudioSource.create(sourceEntity, {
                audioClipUrl: 'sounds/SO_TR_baglama_chord_Cm.wav',
                loop: false,
                playing: true,
            })

        }


        if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
            console.log('Attack button 2 pressed')

            if (curButton === 1) {
                console.log('correct button pressed')
                buttonColors[1] = Color4.Green()
                increaseScore()
            } else {
                console.log('incorrect button pressed')
                buttonColors[1] = Color4.Red()
                decreaseScore()
            }

            // Logic in response to button press
            triggerSceneEmote({src: 'models/Lute_Emote.glb'})

            // Create entity
            const sourceEntity = engine.addEntity()
            AvatarAttach.create(sourceEntity, {
                anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
            })

            // Create AudioSource component
            AudioSource.create(sourceEntity, {
                audioClipUrl: 'sounds/SO_TR_baglama_chord_Fm.wav',
                loop: false,
                playing: true,
            })

        }

        if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)) {
            console.log('Attack button 3 pressed')

            if (curButton === 2) {
                console.log('correct button pressed')
                buttonColors[2] = Color4.Green()
                increaseScore()
            } else {
                console.log('incorrect button pressed')
                buttonColors[2] = Color4.Red()
                decreaseScore()
            }

            // Logic in response to button press
            triggerSceneEmote({src: 'models/Lute_Emote.glb'})

            // Create entity
            const sourceEntity = engine.addEntity()
            AvatarAttach.create(sourceEntity, {
                anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
            })

            // Create AudioSource component
            AudioSource.create(sourceEntity, {
                audioClipUrl: 'sounds/SO_TR_baglama_chord_Bb.wav',
                loop: false,
                playing: true,
            })

        }


        if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)) {
            if (score >= maxScore) {
                console.log('Boss defeated !')

                AudioSource.getMutable(bossE).playing = false

                // Create entity
                const sourceEntity = engine.addEntity()
                AvatarAttach.create(sourceEntity, {
                    anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
                })

                // Create AudioSource component
                AudioSource.create(sourceEntity, {
                    audioClipUrl: 'sounds/boss_dead.mp3',
                    loop: false,
                    playing: true,
                })

                Animator.playSingleAnimation(bossE, 'die')

                engine.removeEntity(orbE)
            }

        }


    })

}