function dice(inputStr, say) {
  const sides = 6;
  const num = Math.floor(Math.random() * sides) + 1;
  say(`You rolled a ${num}.`);
}

module.exports = dice;
