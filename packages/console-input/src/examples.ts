import { Input } from '../lib';


async function basics() {

    let answer = await Input.datetime('datetime', {
        message: 'When would you like ttrya table?',
        initial: new Date('2017-01-01 12:30'),
    });
    console.dir(answer);
    answer = await Input.filetree('filetree', process.cwd(), {});
    console.dir(answer);
    answer = await Input.maxinputlength('maxinputlength', 10, {
        maxLength: 10,
    });
    console.dir(answer);

}

async function autocomplete() {

    var states     = [
        'Alabama',
        'Alaska',
        'American Samoa',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'District Of Columbia',
        'Federated States Of Micronesia',
        'Florida',
        'Georgia',
        'Guam',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Marshall Islands',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Northern Mariana Islands',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Palau',
        'Pennsylvania',
        'Puerto Rico',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virgin Islands',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
    ];
    const _        = require('lodash');
    const fuzzy    = require('fuzzy');
    const inquirer = require('inquirer');

    function searchStates<T>(answers, input): Promise<T> {
        input = input || '';
        return new Promise(function (resolve) {
            setTimeout(function () {
                var fuzzyResult = fuzzy.filter(input, states);
                const results   = fuzzyResult.map(function (el) {
                    return el.original;
                });

                results.splice(5, 0, new inquirer.Separator());
                results.push(new inquirer.Separator());
                resolve(results);
            }, _.random(30, 500));
        });
    }

    let answer = await Input.autocomplete('autocomplete', searchStates, {});
    console.dir(answer);

}
