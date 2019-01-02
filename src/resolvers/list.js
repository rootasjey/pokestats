const fs          = require('fs-extra');
const Pokedex     = require('../pokedex-api');
const { tryRead } = require('./utils');

const PATHS = require('./paths');

module.exports = {
  async getList({ start, end }) {
    let _start = typeof start !== 'undefined' ? start : 1;
    start--; // pokedex start at 1 but programming array at 0

    const data = await getListData();

    let results = data.results.slice(start, end);
    results     = await tryAddSprites(results);

    return {
      count   : results.length,
      end     : typeof end !== 'undefined' ? end : results.length,
      results,
      start   : _start,
    };
  },

  /**
   * Return a list of Pokemons wich have their names matching with the string provided.
   * @param {String} name String to find Pokemons with.
   */
  async search(name = '') {
    const data = await getListData();
    const dataWithSprites = await tryAddSprites(data.results);

    const results = dataWithSprites
      .filter((pokemon) => {
        return pokemon.name.indexOf(name) > -1;
      });

    return {
      count   : results.length,
      end     : results.length,
      results,
      start   : 0,
    };
  },
};

async function getListData() {
  const path = PATHS.LIST;

  if (! await fs.pathExists(path)) {
    const list = await Pokedex.getPokemonsList();

    // Add id to Pokemons :)
    list.results = list.results.map((pokemon, index) => {
      return { ...pokemon, ...{ id: index +1}}
    });

    await fs.outputJSON(path, list);
  }

  return fs.readJSON(path);
}

async function tryAddSprites(results = []) {
  const spritesId   = await tryRead(PATHS.SPRITES_BY_ID);
  const spritesName = await tryRead(PATHS.SPRITES_BY_NAME);

  return results
    .map((pokemon) => {
      const { id, name } = pokemon;
      const propsAdded = spritesId[id] || spritesName[name];

      return {
        ...pokemon, ...propsAdded
      };
    });
}
