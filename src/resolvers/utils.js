const fs    = require('fs-extra');
const PATHS = require('./paths');

module.exports = utils = {
  toPascalNameSprites(sprites) {
    return {
      "femaleBack"        : sprites.back_female,
      "femaleFront"       : sprites.front_female,
      "femaleShinyBack"   : sprites.back_shiny_female,
      "femaleShinyFront"  : sprites.front_shiny_female,
      "defaultBack"       : sprites.back_default,
      "defaultFront"      : sprites.front_default,
      "defaultShinyBack"  : sprites.back_shiny,
      "defaultShinyFront" : sprites.front_shiny,
    };
  },

  /**
 * Read with failure.
 * @param {String} path JSON file path.
 */
  async tryRead(path) {
    try {
      return await fs.readJSON(path);

    } catch (error) {
      logFileError({ error });

      await fs.outputJSON(path, {});
      return {};
    }
  }
}

/**
 * Save error to file logs.
 * @param {Object} param0 Param containing an Error object.
 */
async function logFileError({ error }) {
  const path = PATHS.LOG_FILE_ERRORS;

  if (! await fs.pathExists(path)) {
    await fs.outputJSON(path, {});
  }

  const now = new Date();
  const data = utils.tryRead(path);

  await fs.writeJSON(path, {
    ...data, ...{
      [now.getTime()]: {
        message: error.message,
        stack: error.stack,
        time: now.getTime(),
        utc: now.toUTCString(),
      }
    }
  });
}
