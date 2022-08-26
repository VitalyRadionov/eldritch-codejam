function getRandomNum(max, min) {
  if (max === undefined) {
    max = 1;
  }
  if (min === undefined) {
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default getRandomNum;