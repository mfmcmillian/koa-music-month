import ReactEcs, {Label, UiEntity} from "@dcl/sdk/react-ecs";
import {Color4} from "@dcl/sdk/math";
import {bossE, red} from "./factory";
import {
    Animator,
    AudioSource,
    AvatarAnchorPointType,
    AvatarAttach,
    engine,
    InputAction,
    inputSystem,
    PointerEventType
} from "@dcl/sdk/ecs";
import {triggerSceneEmote} from "~system/RestrictedActions";

export const color1 = Color4.Gray()
export const color2 = Color4.Gray()
export const color3 = Color4.Gray()

export let buttonColors = [Color4.Gray(), Color4.Gray(), Color4.Gray()]

export const setButtonColors = (color1: Color4, color2: Color4, color3: Color4) => {
    buttonColors = [color1, color2, color3]
}

export let score = 0
export const maxScore = 20

export const increaseScore = () => {
    score++
}

export const decreaseScore = () => {
    score--
    score = Math.max(score, 0)
}

export const resetScore = () => {
    score = 0
}

export function bossUi() {

    return (
        <UiEntity
            uiTransform={{
                display: 'flex',
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
                    color: Color4.create(1, 0, 0, .5),
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
                    color: Color4.create(0, 0, 1, .5),
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
                    color: Color4.create(1, 1, 0, .5),
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
                    display: (score > maxScore) ? 'flex': 'none',
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