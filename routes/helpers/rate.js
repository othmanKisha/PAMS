const rate = (newRating, appNum, currRating) => {
  return (appNum * currRating + newRating) / (appNum + 1);
};

module.exports = { rate };
