export function playRockPaperScissors(choice: any) {
  // Choices
  const choices = ['rock', 'paper', 'scissors']

  // Randomly select a choice for computer
  const computerChoice = choices[Math.floor(Math.random() * choices.length)]

  // For simplicity, let’s let player always choose rock in this example
  // But you could utilize a UI popup or something to let player make a choice
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
    // Player wins, so spawn a cube
  } else {
    result = 'Computer wins!'
    console.log('Computer wins!')
    // Optionally: handle computer win scenario
  }

  console.log(result)
}
