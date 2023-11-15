import ReactEcs, {Label, UiEntity} from "@dcl/sdk/react-ecs";
import {Color4} from "@dcl/sdk/math";
import {red} from "./factory";

export const color1 = Color4.Gray()
export const color2 = Color4.Gray()
export const color3 = Color4.Gray()

export let buttonColors = [Color4.Gray(), Color4.Gray(), Color4.Gray()]

export const setButtonColors = (color1: Color4, color2: Color4, color3: Color4) => {
    buttonColors = [color1, color2, color3]
}

export function bossUi() {

    return (
        <UiEntity
            uiTransform={{
                display: 'flex',
                positionType: 'absolute',
                position: {top: '5%', left: '40%'},
                width: 300,
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
        </UiEntity>
    )
}