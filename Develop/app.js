const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


// function to write HTML File
function writeToFile(fileName, data) {
    // console.log("fileName: ", fileName)
    return fs.writeFileSync(fileName, data);
}

// function to collect inputs

const collectInputs = async (inputs = []) => {
    const questions = [
    {
        type: "input",
        name: "name",
        message: "What is the employee's name?"
    },
    {
        type: "input",
        name: "id",
        message: "What is the employee's id?"
    } ,{
        type: "input",
        name: "email",
        message: "What is the employee's email address?"
    },
    {
        type: "list",
        name: "role",
        message: "Choose the employee's role:",
        choices: ["Manager", "Engineer", "Intern"]
    },
    {
        type: "input",
        name: "officeNumber",
        message: "What is the Manager's Office Number?",
        when: (answers) => answers.role ==="Manager"
    },
    {
        type: "input",
        name: "github",
        message: "What is the Engineer's github account?",
        when: (answers) => answers.role ==="Engineer"
    },
    {
        type: "input",
        name: "school",
        message: "What is the Intern's school?",
        when: (answers) => answers.role ==="Intern"
    },
    {
        type: 'confirm',
        name: 'again',
        message: 'Do you need to enter another employee? ',
        default: true
      }
    ];
  
    const { again, ...answers } = await inquirer.prompt(questions)

    const newInputs = [...inputs, answers];
    return again ? collectInputs(newInputs) : newInputs;
  };
  
// function to initialize program

  const init = async () => {

    try {
        if (fs.existsSync(OUTPUT_DIR)) {
            // console.log("Directory exists.")

        } else {
            // console.log("Directory does not exist.")
            fs.mkdirSync(OUTPUT_DIR, true );
        }
    } catch(e) {
    console.log("An error occurred: ", e)
    }
    
    const inputs = await collectInputs().then(inputs => {

        // console.log("inputs: ", inputs);
        let employees = inputs.map(input => {
            if (input.role === "Manager"){
                const e = new Manager(name = input.name, id=input.id, email=input.email, officeNumber=input.officeNumber) 
                return e;
            }
            if (input.role === "Engineer"){
                const e = new Engineer(name = input.name, id=input.id, email=input.email, github=input.github) 
                return e;
            }
            if (input.role === "Intern"){
                const e = new Intern(name = input.name, id=input.id, email=input.email, school=input.school) 
                return e;
            }
          });
        //   console.log("New Employees: ", employees);

        // console.log("outputPath",outputPath);
        console.log("creating team.html.....")
        writeToFile(outputPath, render(employees))
    })
    .catch(error => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else when wrong
            console.log("Error: ", error)
        }
    });
  };
  
  // function call to initialize program
  init();