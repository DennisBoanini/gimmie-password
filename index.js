#! /usr/bin/env node

'use strict';

const { DEFAULT_ALPHABET } = require('./utils/constants');
const chalk = require('chalk');

const options = require('yargs')
    .scriptName('generate-password')
    .usage('Usage: $0 -l 10')
    .example(
        '$0 -l 10',
        'Generate a password of length 10'
    )
    .option("l", {
        alias:"length",
        describe: "The length of the password that you want generate",
        type: "number",
        default: 15,
        nargs: 1
    })
    .help()
    .argv;

const generatePassword = (length) => {
    if (length < 8) {
        console.error(chalk.bold.red('The minimum length of the password must be 8'));
        process.exit(1)
    }

    const joinedAlphabet = DEFAULT_ALPHABET.join('');
    const regExp = generateAlphabetRegExp(DEFAULT_ALPHABET, length);

    let generatedPassword = '';
    do {
        generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const character = joinedAlphabet.charAt(Math.floor(Math.random() * joinedAlphabet.length));
            generatedPassword += character;
        }
    } while (!checkValidity(generatedPassword, regExp));

    return generatedPassword;
}

const generateAlphabetRegExp = (alphabet, length) => {
    let conditions = "", totalAlphabet = "";
    for (let i = 0; i < alphabet.length; i++) {
        alphabet[i] = alphabet[i].toString().replace(/[\-\[\]\\]/g, "\\$&")
        conditions += `(?!.*([${alphabet[i]}])\\${i + 1}{1})`
        totalAlphabet += alphabet[i]
    }

    const pattern = `^${conditions}[${totalAlphabet}]{${length},}\$`;
    return new RegExp(pattern, 'i');
}

const checkValidity = (generatedPassword, regExp) => {
    return regExp.test(generatedPassword)
}

console.log(chalk.bold.green(generatePassword(options.length)));
