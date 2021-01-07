import inquirer from 'inquirer';

function run1() {
    inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
    inquirer
        .prompt([
            {
                type   : 'datetime',
                name   : 'dt',
                message: 'When would you like a table?',
                initial: new Date('2017-01-01 12:30'),
            },
        ])
        .then(answers => {
            // Use user feedback for... whatever!!
        })
        .catch(error => {
            if ( error.isTtyError ) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}


run2();
