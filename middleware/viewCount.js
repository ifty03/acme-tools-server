let count = 0;
console.log(count);
const viewCount = (req, res, next) => {
  count++;
  res.send("nothing changes ");
  next();
};

module.exports = viewCount;
