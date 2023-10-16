
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs';
import { playRockPaperScissors } from './rps';

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(RockPaperScissorsDialog)
}

const GameButton = (props: { src: string, onMouseDown: () => void }) => (
  <UiEntity
    uiTransform={{
      width: 100,
      height: 100, 
      margin: { top: '8px', left: '8px' } 
    }}
    //onMouseDown={props.onMouseDown}
    uiBackground={{
      textureMode: 'stretch', 
      texture: { src: props.src }
    }}
  />
  
);

const RockPaperScissorsDialog = () => (
  <UiEntity
    uiTransform={{ 
      width: 320, 
      height: 100, 
      margin: { 
        top: `${(1100 - 100) / 2}px`, 
        bottom: '16px', 
        left: `${(1300 - 320) / 2}px`, 
        right: '16px'
      }
    }}
    //visible={props.isVisible}
  >
    <GameButton 
      src="images/rock.png" 
      onMouseDown={() => handlePlayerChoice('rock')} 
    />
    <GameButton 
      src="images/paper.png" 
      onMouseDown={() => handlePlayerChoice('paper')} 
    />
    <GameButton 
      src="images/scissors.png" 
      onMouseDown={() => handlePlayerChoice('scissors')} 
    />
  </UiEntity>
);

const handlePlayerChoice = (choice: string) => {
  // Here, update the global visibility variable
  playRockPaperScissors(choice);
};

