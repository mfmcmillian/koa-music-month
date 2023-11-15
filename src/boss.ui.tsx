import ReactEcs, {Label, UiEntity} from "@dcl/sdk/react-ecs";
import {Color4} from "@dcl/sdk/math";
import {AudioSource, AvatarAnchorPointType, AvatarAttach, engine} from "@dcl/sdk/ecs";

export const color1 = Color4.Gray()
export const color2 = Color4.Gray()
export const color3 = Color4.Gray()

export let buttonColors = [Color4.Gray(), Color4.Gray(), Color4.Gray()]

export const setButtonColors = (color1: Color4, color2: Color4, color3: Color4) => {
    buttonColors = [color1, color2, color3]
}

export let buttonAlphaColors = [.5, .5, .5]

export const setButtonAlphaColors = (color1: number, color2: number, color3: number) => {
    buttonAlphaColors = [color1, color2, color3]
}

export let score = 0
export const maxScore = 20

export let gameRunning = false

export const setGameRunning = (value: boolean) => {
    gameRunning = value
}


export const increaseScore = () => {
    score++
}

export const decreaseScore = () => {
    score--
    score = Math.max(score, 0)

    // Create entity
    const sourceEntity = engine.addEntity()
    AvatarAttach.create(sourceEntity, {
        anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
    })

    // Create AudioSource component
    AudioSource.create(sourceEntity, {
        audioClipUrl: 'sounds/F#.mp3',
        loop: false,
        playing: true,
    })
}

export const resetScore = () => {
    score = 0
}

export function bossUi() {

    return (
        <UiEntity
            uiTransform={{
                display: gameRunning ? 'flex' : 'none',
                positionType: 'absolute',
                position: {top: '5%', left: '40%'},
                width: 360,
                height: 200,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }
            }
        >
            <UiEntity
                uiTransform={{
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: {top: 30, bottom: 10, left: 10, right: 10},
                }}
                uiBackground={{
                    color: Color4.create(1, 0, 0, buttonAlphaColors[0]),
                }}
            >
                <Label value="1" fontSize={40} color={buttonColors[0]}/>
            </UiEntity>
            <UiEntity
                uiTransform={{
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: {top: 30, bottom: 10, left: 10, right: 10},
                }}
                uiBackground={{
                    color: Color4.create(0, 0, 1, buttonAlphaColors[1]),
                }}
            >
                <Label value="2" fontSize={40} color={buttonColors[1]}/>
            </UiEntity>
            <UiEntity
                uiTransform={{
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: {top: 30, bottom: 10, left: 10, right: 10},
                }}
                uiBackground={{
                    color: Color4.create(1, 1, 0, buttonAlphaColors[2]),
                }}
            >
                <Label value="3" fontSize={40} color={buttonColors[2]}/>
            </UiEntity>

            <UiEntity
                uiTransform={{
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: {top: 30, bottom: 10, left: 10, right: 10},
                }}
                uiBackground={{
                    color: Color4.White(),
                }}
            >
                <Label value={`${score}`} fontSize={40} color={Color4.Black()}/>
            </UiEntity>
            <UiEntity
                uiTransform={{
                    height: 80,
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'column',
                    display: (score >= maxScore) ? 'flex' : 'none',
                    padding: {top: 30, bottom: 10, left: 10, right: 10},
                }}
                uiBackground={{
                    color: Color4.Green(),
                }}
            >
                <Label value={`Press 4 to End`} fontSize={40} color={Color4.White()}/>
            </UiEntity>
        </UiEntity>
    )
}