const chalk = {
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  cyan: (msg) => `\x1b[36m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
  blue: (msg) => `\x1b[34m${msg}\x1b[0m`,
  gray: (msg) => `\x1b[90m${msg}\x1b[0m`,
  magenta: (msg) => `\x1b[35m${msg}\x1b[0m`,
  bold: (msg) => `\x1b[1m${msg}\x1b[0m`,
};

class Logger {
  static logo() {
    console.log(chalk.cyan(`
    █████╗  ██████╗  █████╗  ██████╗
   ██╔══██╗ ██╔══██╗██╔══██╗██╔════╝
   ███████║ ██║  ██║███████║██║     
   ██╔══██║ ██║  ██║██╔══██║██║     
   ██║  ██║ ██████╔╝██║  ██║╚██████╗
   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
    AGENT DEVELOPER AUTONOMY COUNCIL
    `));
  }

  static info(msg) {
    console.log(chalk.blue('  [INFO] '), msg);
  }
  
  static success(msg) {
    console.log('\n' + chalk.green('  ✔ [PASSED] '), chalk.bold(msg));
  }

  static warn(msg) {
    console.log(chalk.yellow('  ⚠ [WARN] '), msg);
  }

  static error(msg) {
    console.error(chalk.red('  ✖ [FAIL] '), msg);
  }
  
  static header(msg) {
    console.log('\n' + chalk.magenta(' ❯ ') + chalk.bold(msg));
    console.log(chalk.gray(' ──────────────────────────────────────────────────'));
  }

  static fileHeader(filePath) {
    console.log('\n' + chalk.cyan(' 📄 File: ') + chalk.bold(filePath));
  }

  static summary(stats) {
    console.log(chalk.gray('\n ────────────────── SUMMARY ──────────────────────'));
    console.log(`    Files Scanned: ${chalk.bold(stats.files)}`);
    console.log(`    Errors Found:  ${stats.errors > 0 ? chalk.red(stats.errors) : chalk.green('0')}`);
    console.log(`    Warnings:      ${stats.warnings > 0 ? chalk.yellow(stats.warnings) : chalk.green('0')}`);
    console.log(chalk.gray(' ──────────────────────────────────────────────────'));
  }
}

module.exports = Logger;
