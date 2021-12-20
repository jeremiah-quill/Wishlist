  // Fisher-Yates shuffle algorithm
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

const assignSantas = (array) => {
  let santas = [];

  for (let i = 0; i < array.length; i++) {

    let newSanta = {};

    if (i !== array.length - 1) {
      newSanta.user_id = array[i];
      newSanta.assignment_id = array[i + 1];
      santas.push(newSanta);
    } else {
      newSanta.user_id = array[i];
      newSanta.assignment_id = array[0];
      santas.push(newSanta);
    }
  }
  return santas;
};

module.exports = { shuffle, assignSantas };
