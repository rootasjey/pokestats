const fs            = require('fs-extra');
const Pokedex       = require('./pokedex-api');

const BY_ID_PATH    = './data/sprites/lowResById.json';
const BY_NAME_PATH  = './data/sprites/lowResByName.json';

module.exports = {
  async getSpritesById(id = 1) {
    await checkFile(BY_ID_PATH);

    const data = await fs.readJSON(BY_ID_PATH);
    const result = await findDataId(id, data);

    return [result];
  },

  async getSpritesByIds(ids = []) {
    await checkFile(BY_ID_PATH);

    const data = await fs.readJSON(BY_ID_PATH);

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

    const data = await fs.readJSON(BY_NAME_PATH);
    const result = await findDataName(name, data);

    return [result];
  },

  async getSpritesByNames(names = []) {
    await checkFile(BY_NAME_PATH);

    const data = await fs.readJSON(BY_NAME_PATH);
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
    throw new Error('Data file for sprites by id is not available.');
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
      sprites: normalizeSprites(sprites),
    };

    fs.writeJSON(BY_ID_PATH, {
      ...data, ...{[id]: dataEntry}
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
      sprites: normalizeSprites(sprites),
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

function normalizeSprites(sprites) {
  return {
    "femaleBack"        : sprites.back_female,
    "femaleFront"       : sprites.front_female,
    "femaleShinyBack"   : sprites.back_shiny_female,
    "femaleShinyFront"  : sprites.front_shiny_female,
    "maleBack"          : sprites.back_default,
    "maleFront"         : sprites.front_default,
    "maleShinyBack"     : sprites.back_shiny,
    "maleShinyFront"    : sprites.front_shiny,
  };
}

async function saveForByIdAsWell(dataEntry) {
  const { id } = dataEntry;

  const previousData = await fs.readJSON(BY_ID_PATH);

  if (previousData[id]) {
    return;
  }

  fs.writeJSON(BY_ID_PATH, {
    ...previousData, ...{ [id]: dataEntry }
  });
}

async function saveForByNameAsWell(dataEntry) {
  const { name } = dataEntry;

  const previousData = await fs.readJSON(BY_NAME_PATH);

  if (previousData[name]) {
    return;
  }

  fs.writeJSON(BY_NAME_PATH, {
    ...previousData, ...{[name]: dataEntry}
  });
}
