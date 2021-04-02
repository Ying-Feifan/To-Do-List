//jshint esversion:6

module.exports = function() {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return new Date().toLocaleDateString("en-US", options);
};
