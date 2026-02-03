const chalk = {
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
  blue: (msg) => `\x1b[34m${msg}\x1b[0m`,
  gray: (msg) => `\x1b[90m${msg}\x1b[0m`,
  bold: (msg) => `\x1b[1m${msg}\x1b[0m`,
};

class Logger {
  static info(msg) {
    console.log(chalk.blue('ℹ'), msg);
  }
  
  static success(msg) {
    console.log(chalk.green('✔'), msg);
  }

  static warn(msg) {
    console.log(chalk.yellow('⚠'), msg);
  }

  static error(msg) {
    console.error(chalk.red('✖'), msg);
  }
  
  static header(msg) {
    console.log('\n' + chalk.bold(msg));
    console.log(chalk.gray('─'.repeat(50)));
  }
}

module.exports = Logger;