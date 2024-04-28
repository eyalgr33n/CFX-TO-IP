const axios = require('axios');
const readline = require('readline');
const chalk = require('chalk');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ques = promisify(rl.question).bind(rl);

const resolve = async (url) => {
    try {
        const response = await axios.get(url, {
            validateStatus: (status) => status >= 200 && status < 300
        });

        return response.headers["x-citizenfx-url"].replace("http://", "").replace("/", "");
    } catch (e) {
        throw new Error(e.message);
    }
};

const ask = async () => {
    const input = await ques(chalk.green.bold('Write your CFX URL: '));

    let format = input.trim();
    if (!format.startsWith('http')) format = `https://${format}`;

    try {
        const ip = await resolve(format);
        console.log(chalk.yellow.bold(`${format} => ${ip}`));
    } catch (e) {
        console.log(chalk.red.bold(e.message));
    } finally {
        rl.close();
    }
};

const run = async () => {
    try {
        await ask();
    } catch (e) {
        console.log(chalk.red.bold(e.message));
    }
};

run();
