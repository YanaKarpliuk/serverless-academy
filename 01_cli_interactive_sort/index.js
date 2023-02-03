const readline = require("readline");
const {
  sortNumbersAsc,
  sortNumbersDesc,
  sortWords,
  sortWordsByLength,
  getUniqueValues,
  getUniqueWords,
} = require("./options.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const commands = {
  a: sortWords,
  b: sortNumbersAsc,
  c: sortNumbersDesc,
  d: sortWordsByLength,
  e: getUniqueWords,
  f: getUniqueValues,
};

function getString(message) {
  rl.question(message, (str) => {
    if (str === "exit") {
      return rl.close();
    }

    const elements = str.replace(/\s+/g, " ").trim().split(" ");

    if (elements.length > 1) {
      rl.question(
        `Select operation by entering one of the following commands:
        a: Sort words alphabetically
        b: Show numbers from lesser to greater
        c: Show numbers from bigger to smaller
        d: Display words in ascending order by number of letters in the word
        e: Show only unique words
        f: Display only unique values from the set of words and numbers
        exit: exit the program
        `,
        (command) => {
          const obj = {
            allElements: elements,
            words: elements.filter((el) => isNaN(Number(el))),
            numbers: elements.filter((el) => !isNaN(Number(el))),
          };
          console.log(commands[command](obj));
          getString("Enter 10 words or digits separated by a space: ");
        }
      );
    } else {
      getString("Enter more than one number or word: ");
    }
  });
}

getString("Hello! Enter 10 words or digits separated by a space: ");
