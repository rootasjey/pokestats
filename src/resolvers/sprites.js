const fs      = require('fs-extra');
const Pokedex = require('../pokedex-api');

const {
  logFileError,
  toPascalNameSprites,
}  = require('./utils');

const BY_ID_PATH    = './data/sprites/lowResById.json';
const BY_NAME_PATH  = './data/sprites/lowResByName.json';

module.exports = {
  async getSpritesById(id = 1) {
    await checkFile(BY_ID_PATH);

    const data = await tryRead(BY_ID_PATH);
    const result = await findDataId(id, data);

    return [result];
  },

  async getSpritesByIds(ids = []) {
    await checkFile(BY_ID_PATH);

    const data = await tryRead(BY_ID_PATH);

    const promises = ids
      .map(async (id) => {
        return await findDataId(id, data);
      });

    return Promise
      .all(promises)
      .then((spritesEntries) => {
        return spritesEntries;
      });
  },

  async getSpritesByName(name = '') {
    await checkFile(BY_NAME_PATH);

    const data = await tryRead(BY_NAME_PATH);
    const result = await findDataName(name, data);

    return [result];
  },

  async getSpritesByNames(names = []) {
    await checkFile(BY_NAME_PATH);

    const data = await tryRead(BY_NAME_PATH);

    const promises = names
      .map(async (name) => {
        return await findDataName(name, data);
      });

    return Promise
      .all(promises)
      .then((spritesEntries) => {
        return spritesEntries;
      })
  },
};

async function checkFile(path = '') {
  const exists = await fs.pathExists(path);

  if (!exists) {
    await fs.outputJSON(path, {});
  }
}

async function findDataId(id, data) {
  if (data[id]) {
    return data[id];
  }

  try {
    const pokemon = await Pokedex.getPokemonByName(id);
    const { name, sprites } = pokemon;

    const dataEntry = {
      id,
      name,
      sprites: toPascalNameSprites(sprites),
    };

    fs.writeJSON(BY_ID_PATH, {
      ...data, ...{ [id]: dataEntry }
    });

    // Optimisation: share data
    saveForByNameAsWell(dataEntry);

    return dataEntry;

  } catch (error) {
    return {
      id,
      name: null,
      sprites: null,
    };
  }
}

async function findDataName(name, data) {
  if (data[name]) {
    return data[name];
  }

  try {
    const pokemon = await Pokedex.getPokemonByName(name);
    const { id, sprites } = pokemon;

    const dataEntry = {
      id,
      name,
      sprites: toPascalNameSprites(sprites),
    };

    fs.writeJSON(BY_NAME_PATH, {
      ...data, ...{ [name]: dataEntry }
    });

    // Optimisation: share data
    saveForByIdAsWell(dataEntry);

    return dataEntry;

  } catch (error) {
    return {
      id: null,
      name,
      sprites: null,
    };
  }
}

async function saveForByIdAsWell(dataEntry) {
  const path = BY_ID_PATH;
  const { id } = dataEntry;

  await checkFile(path);
  const previousData = await tryRead(path);

  if (previousData[id]) {
    return;
  }

  fs.writeJSON(path, {
    ...previousData, ...{ [id]: dataEntry }
  });
}

async function saveForByNameAsWell(dataEntry) {
  const path = BY_NAME_PATH;
  const { name } = dataEntry;

  await checkFile(path);
  const previousData = await tryRead(path);

  if (previousData[name]) {
    return;
  }

  fs.writeJSON(path, {
    ...previousData, ...{[name]: dataEntry}
  });
}

/**
 * Read with failure.
 * @param {String} path JSON file path.
 */
async function tryRead(path) {
  try {
    return await fs.readJSON(path);

  } catch (error) {
    logFileError({ error });

    await fs.outputJSON(path, {});
    return {};
  }
}
