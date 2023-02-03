module.exports = {
  sortWords: function (input) {
    return input.words.sort();
  },

  sortNumbersAsc: function (input) {
    return input.numbers.sort((a, b) => a - b);
  },

  sortNumbersDesc: function (input) {
    return input.numbers.sort((a, b) => b - a);
  },

  sortWordsByLength: function (input) {
    return input.words.sort((a, b) => a.length - b.length);
  },

  getUniqueWords: function (input) {
    return input.words.filter(
      (item, index, array) => array.indexOf(item) === index
    );
  },

  getUniqueValues: function (input) {
    return input.allElements.filter(
      (item, index, array) => array.indexOf(item) === index
    );
  },
};
