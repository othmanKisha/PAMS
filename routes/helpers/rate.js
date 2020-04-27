module.exports = (appointments, newRating, currRating) => {
  return (
    (appointments * currRating + Number(newRating)) /
    (appointments + 1)
  ).toFixed(3);
};
