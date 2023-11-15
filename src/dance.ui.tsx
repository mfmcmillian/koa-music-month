import ReactEcs, {Button, UiEntity} from '@dcl/sdk/react-ecs';
import {danceSystem, triggerRandomEmote} from './danceArea';
import {engine} from '@dcl/sdk/ecs';

let danceButtonText = 'Auto Dance Off';
const buttonWidth = 120;

export function DanceUI() {


    return (
        <UiEntity
            uiTransform={{
                display: 'flex',
                positionType: 'absolute',
                position: {top: 140, right: 2},
                width: 140,
                height: 60,
                justifyContent: 'space-between',
            }
            }

        >

            <Button
                uiTransform={{width: buttonWidth, height: 40, margin: 8}}
                value={danceButtonText}
                variant={(danceButtonText == 'Auto Dance Off') ? 'secondary' : 'primary'}
                fontSize={14}
                onMouseDown={() => {
                    danceButtonText = (danceButtonText == 'Auto Dance Off') ? 'Auto Dance On' : 'Auto Dance Off'
                    if (danceButtonText == 'Auto Dance Off') {
                        engine.removeSystem(danceSystem)

                    } else {
                        engine.addSystem(danceSystem)
                        triggerRandomEmote()
                    }
                }}
            />
        </UiEntity>
    );
};

export default DanceUI;