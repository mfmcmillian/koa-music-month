import { engine } from '@dcl/sdk/ecs'
import { bossHealthBar, playerHealthBar } from './ui'

export function playRockPaperScissors(choice: any) {
  // Choices
  const choices = ['rock', 'paper', 'scissors']
  const computerChoice = choices[Math.floor(Math.random() * choices.length)]
  const playerChoice = choice

  console.log(`Player: ${playerChoice}, Computer: ${computerChoice}`)

  // Determine winner
  let result = ''
  if (playerChoice === computerChoice) {
    result = "It's a draw!"
    console.log("It's a draw!")
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    result = 'Player wins!'
    console.log('Player wins!')
    bossHealthBar.decrease(0.3)
    if (bossHealthBar.read() <= 0) {
      // boss is dead
      //engine.removeEntity(boss)
    }
  } else {
    result = 'Computer wins!'
    console.log('Computer wins!')
    playerHealthBar.decrease(0.3)
    if (playerHealthBar.read() <= 0) {
      // player is dead
      //engine.removeEntity(boss)
    }
  }

  console.log(result)
}
