import inquirer from "inquirer";
import fs from "fs/promises";

const user = { name: "", gender: "", age: "" };

const getName = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "userName",
        message: "Enter the user's name. To cancel press ENTER: ",
      },
    ])
    .then((res) => {
      if (res.userName) {
        user.name = res.userName;
        getGender();
      } else {
        getDBResults();
      }
    });
};

const getGender = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "gender",
        message: "Choose the user's gender: ",
        choices: ["male", "female"],
      },
    ])
    .then((res) => {
      if (res.gender) {
        user.gender = res.gender;
        getAge();
      } else {
        return;
      }
    });
};

const getAge = () => {
  inquirer
    .prompt([
      {
        type: "number",
        name: "age",
        message: "Enter the user's age: ",
        default: "",
        validate(res) {
          if (!Number(res)) {
            return "Please, enter a number!";
          }
          return true;
        },
      },
    ])
    .then((res) => {
      if (res.age) {
        user.age = res.age;
        pushData();
        getName();
      } else {
        return;
      }
    });
};

const getDBResults = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "results",
        message: "Would you like to search values in DB? ",
        default: false,
      },
    ])
    .then(async (res) => {
      if (res.results) {
        const data = await fs.readFile("./users.txt");
        const parsedData = JSON.parse(data);
        console.log(parsedData)
        searchName();
      } else {
        return;
      }
    });
};

const searchName = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "searchName",
        message: "Enter the user's name: ",
      },
    ])
    .then(async (res) => {
      const data = await fs.readFile("./users.txt");
      const parsedData = JSON.parse(data);

      const user = parsedData.filter(
        (item) => item.name.toLowerCase() === res.searchName.toLowerCase()
      );
      if (user.length >= 1) {
        console.log(user);
        return;
      } else {
        console.log("Such user does not exists");
        searchName()
      }
    });
};

const pushData = async () => {
  const data = await fs.readFile("./users.txt");
  const parsedData = JSON.parse(data);

  const newData = [...parsedData, user];
  await fs.writeFile("./users.txt", JSON.stringify(newData));
};

getName();