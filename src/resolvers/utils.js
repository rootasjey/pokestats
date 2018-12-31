const fs = require('fs-extra');

const LOG_FILE_ERRORS_PATH = './data/logs/fileErrors.json';

module.exports = {
  async logFileError({ error }) {
    if (! await fs.pathExists(LOG_FILE_ERRORS_PATH)) {
      await fs.outputJSON(LOG_FILE_ERRORS_PATH, {});
    }

    const now = new Date();

    let data;

    try {
      data = await fs.readJSON(LOG_FILE_ERRORS_PATH);
    }
    catch (error) {
      data = {};
    }

    await fs.writeJSON(LOG_FILE_ERRORS_PATH, { ...data, ...{
        [now.getTime()]: {
          message : error.message,
          stack   : error.stack,
          time    : now.getTime(),
          utc     : now.toUTCString(),
        }
      }
    });
    // await fs.appendFile(LOG_FILE_ERRORS_PATH, JSON.stringify({
    //   [now.getTime()]: {
    //     message: error.message,
    //     stack: error.stack,
    //     time: now.getTime(),
    //     utc: now.toUTCString(),
    //   }
    // }));
  },

  toPascalNameSprites(sprites) {
    return {
      "femaleBack": sprites.back_female,
      "femaleFront": sprites.front_female,
      "femaleShinyBack": sprites.back_shiny_female,
      "femaleShinyFront": sprites.front_shiny_female,
      "defaultBack": sprites.back_default,
      "defaultFront": sprites.front_default,
      "defaultShinyBack": sprites.back_shiny,
      "defaultShinyFront": sprites.front_shiny,
    };
  },
}
