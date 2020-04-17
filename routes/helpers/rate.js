const rateClinicAndDoctor = (record, id, rating, next) => {
  record.findOne({ _id: id }, (err, r) => {
    if (err) console.log(err);
    else
      record.updateOne(
        { _id: id },
        {
          $set: { rating: rate(rating, r.appointments, r.rating) },
          $inc: { appointments: 1 }
        },
        (err, _cb) => {
          if (err) console.log(err);
          else next;
        }
      );
  });
};
const rate = (newRating, appNum, currRating) => {
  return (appNum * currRating + newRating) / (aooNum + 1);
};

module.exports = { rateClinicAndDoctor };
