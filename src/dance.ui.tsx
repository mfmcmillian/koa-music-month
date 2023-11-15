import ReactEcs, { Button, UiEntity } from '@dcl/sdk/react-ecs';
import { danceSystem, triggerRandomEmote } from './danceArea';
import { engine } from '@dcl/sdk/ecs';


export function DanceUI(){
  let danceButtonText = 'Auto Dance Off'; 
  const buttonWidth = 100; 

  return (
    <UiEntity
    uiTransform={{
        display: 'flex',
        positionType: 'absolute',
        position: {top: '20%', left: '40%'},
        width: 300,
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
                            //danceButtonText = 'Auto Dance On'
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