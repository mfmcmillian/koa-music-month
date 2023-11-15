
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs';
import { playRockPaperScissors } from './rps';
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math';
import { BarStyles } from 'dcl-ui-toolkit';

export function setupUi() {
  //ReactEcsRenderer.setUiRenderer(RockPaperScissorsDialog)
  ReactEcsRenderer.setUiRenderer(uiComponent)

}

const playerHealthLabel = ui.createComponent(ui.CornerLabel, {value: 'Player HP', xOffset: -190})
playerHealthLabel.show()

export const playerHealthBar = ui.createComponent(ui.UIBar, {value: 1, color: Color4.Green(), style: BarStyles.ROUNDGOLD})
playerHealthBar.show()

const bossHealthLabel = ui.createComponent(ui.CornerLabel, {value: 'Boss HP', xOffset: -190})
bossHealthLabel.show()

export const bossHealthBar = ui.createComponent(ui.UIBar, {value: 1, color: Color4.Red(), style: BarStyles.ROUNDSILVER})
bossHealthBar.show()

const GameButton = (props: { src: string, onMouseDown: () => void }) => (
  <UiEntity
    uiTransform={{
      width: 100,
      height: 100, 
      margin: { top: '8px', left: '8px' } 
    }}
    onMouseDown={props.onMouseDown}
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

const uiComponent = () => (
  <UiEntity
      uiTransform={{
          width: '400px',
          height: '100%',
          positionType: "absolute",
          position: {right: 10},
          justifyContent: 'center',
          display: "flex",
          alignItems: "center",
          flexDirection: "row"
      }}
  >

      <UiEntity
          uiTransform={{
              width: '400px',
              height: '700px',
          }}
      >
          {/*<UiEntity*/}
          {/*    uiTransform={{*/}
          {/*        width: '100%',*/}
          {/*        height: 100,*/}
          {/*        margin: '8px 0'*/}
          {/*    }}*/}
          {/*    uiBackground={{*/}
          {/*        textureMode: 'stretch',*/}
          {/*        texture: {*/}
          {/*            src: 'images/Hide_seek.png',*/}
          {/*        },*/}
          {/*    }}*/}
          {/*    uiText={{value: '', fontSize: 18}}*/}
          {/*/>*/}

          <UiEntity
              uiTransform={{width: '400px', height:'600px', display: "flex", flexDirection: "column"}}>

              <UiEntity
                  uiTransform={{width: '100%', height: 60}}>
                  {playerHealthLabel.render()}
                  {playerHealthBar.render()}
              </UiEntity>

              
              <UiEntity
                    uiTransform={{width: '100%', height: 60}}>
                    {bossHealthLabel.render()}
                    {bossHealthBar.render()}
                </UiEntity>

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

      </UiEntity>
      {/*<UiEntity*/}
      {/*    uiTransform={{*/}

      {/*        positionType: "absolute",*/}
      {/*        position: {right: 700, bottom: 200},*/}
      {/*    }}>*/}
      {/*<NpcUtilsUi />*/}
      {/*</UiEntity>*/}
  </UiEntity>
)

const handlePlayerChoice = (choice: string) => {
  // Here, update the global visibility variable
  playRockPaperScissors(choice);
};



