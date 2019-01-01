const fs      = require('fs-extra');
const PATHS   = require('./paths');
const Pokedex = require('../pokedex-api');

const {
  toPascalNameSprites,
  tryRead,
}  = require('./utils');

module.exports = {
  async getSpritesById(id = 1) {
    const path = PATHS.SPRITES_BY_ID;

    await checkFile(path);

    const data = await tryRead(path);
    const result = await findDataId(id, data);

    return [result];
  },

  async getSpritesByIds(ids = []) {
    const path = PATHS.SPRITES_BY_ID;

    await checkFile(path);

    const data = await tryRead(path);

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
    const path = PATHS.SPRITES_BY_NAME;

    await checkFile(path);

    const data = await tryRead(path);
    const result = await findDataName(name, data);

    return [result];
  },

  async getSpritesByNames(names = []) {
    const path = PATHS.SPRITES_BY_NAME;

    await checkFile(path);

    const data = await tryRead(path);

    const promises = names
      .map(async (name) => {
        return await findDataName(name, data);
      });

    return Promise
      .all(promises)
      .then((spritesEntries) => {
        return spritesEntries;
      });
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

    fs.writeJSON(PATHS.SPRITES_BY_ID, {
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

    fs.writeJSON(PATHS.SPRITES_BY_NAME, {
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
  const path = PATHS.SPRITES_BY_ID;

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
  const path = PATHS.SPRITES_BY_NAME;
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
