const fs      = require('fs-extra');
const Pokedex = require('./pokedex-api');

const PREFRIX = './data/avg/';
const CACHE_MAX_DAYS = 7;

module.exports = {
  calculateAvgStats: async ({ cached = true, types = [] }) => {
    if (types.length > 1) {
      return await calculateMultiple({ cached, types });
    }

    return await calculateSingle({ cached, types });
  },
}

/**
 * Calculate the average stats and save it to a file.
 */
async function avgStats(params) {
  const { avg, filePath, names, types } = params;

  try {
    const response = await Pokedex.getPokemonByName(names);

    response.map((pokemon) => {
      const { stats } = pokemon;

      stats.map((statistic) => {
        const value = statistic['base_stat'];
        const { name } = statistic.stat;

        avg[name] = parseInt(avg[name], 10) + value;
      });
    });

    for (const [key, val] of Object.entries(avg)) {
      avg[key] = parseInt(val / names.length, 10);
    }

    const meta = {
      lastUpdated: new Date().toISOString()
    }

    const pokemonCount = names.length;

    const data = { avg, meta, pokemonCount, types };

    await fs.outputJSON(filePath, data);

    return normalize(data);

  } catch (error) {

    const exists = await fs.pathExists(filePath);

    return exists ?
      normalize(await fs.readJSON(filePath))
      : undefined;
  }
}

/**
 * Return the average stats for given Pokemon's types.
 * * Use cache if not expired.
 */
async function calculateMultiple({ cached, types = [] }) {
  const type1 = types[0];
  const type2 = types[1];

  const typeName1 = type1.name;
  const typeName2 = type2.name;

  const typesNames = [typeName1, typeName2];

  const avg = {
    'attack'          : 0,
    'defense'         : 0,
    'hp'              : 0,
    'special-attack'  : 0,
    'special-defense' : 0,
    'speed'           : 0,
  };

  const meta = { lastUpdated: undefined };
  const pokemonCount = 0;

  if (typeof type1 !== 'object' || typeof type2 !== 'object') {
    return normalize({ avg, meta, pokemonCount, typesNames });
  }

  const filePath = getFilePath({ typeName1, typeName2 });

  const fileExists = await fs.pathExists(filePath);

  if (fileExists && cached) {
    const savedData = await fs.readJSON(filePath);
    const previousDate = new Date(savedData.meta.lastUpdated);
    const currentDate = new Date();

    if (currentDate.getDay() - previousDate.getDay() < CACHE_MAX_DAYS) {
      return normalize(savedData);
    }
  }

  const names = findPokemonsWithDoubleType(type1, type2);

  if (names.length === 0) { return normalize({ avg, meta, pokemonCount, typesNames }); }

  return await avgStats({ avg, filePath, names, types: typesNames });
}

/**
 * Return the average stats for a given pokemon's type.
 * Use cache if not expired.
 */
async function calculateSingle({ cached, types = [] }) {
  const type = types[0];

  const typeName = type.name;
  const typesNames = [typeName];

  const filePath = `${PREFRIX}${type.name}.json`;

  const fileExists = await fs.pathExists(filePath);

  if (fileExists && cached) {
    const savedData = await fs.readJSON(filePath);
    const previousDate = new Date(savedData.meta.lastUpdated);
    const currentDate = new Date();

    if (currentDate.getDay() - previousDate.getDay() < CACHE_MAX_DAYS) {
      return normalize(savedData);
    }
  }

  const avg = {
    'attack'          : 0,
    'defense'         : 0,
    'hp'              : 0,
    'special-attack'  : 0,
    'special-defense' : 0,
    'speed'           : 0,
  };

  const names = type.pokemon.map((entry) => {
    return entry.pokemon.name;
  });

  return await avgStats({ avg, filePath, names, types: typesNames });
}

/**
 * Return Pokemons having type 1 & 2.
 * @param {Object} type1 Pokemon's type 1.
 * @param {Object} type2 Pokemon's type 2.
 */
function findPokemonsWithDoubleType(type1, type2) {
  const typeA = type1.pokemon.length <= type2.pokemon.length ? type1 : type2;
  const typeB = type2.pokemon.length >= type1.pokemon.length ? type2 : type1;

  const namesWithDoubleType = [];

  const namesTypeA = typeA.pokemon
    .map((entry) => {
      return entry.pokemon.name;
    })
    .reduce((result, name) => {
      result[name] = name;
      return result;
    }, {});

  const namesTypeB = typeB.pokemon.map((entry) => {
    return entry.pokemon.name;
  })
  .reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});

  for (const [key, val] of Object.entries(namesTypeA)) {
    if (namesTypeB[key]) {
      namesWithDoubleType.push(key);
    }
  }

  return namesWithDoubleType;
}

/**
 * Order types and return file path.
 * @param {Object} param0 Types.
 */
function getFilePath({ typeName1, typeName2 }) {
  if (typeName1 < typeName2) {
    return `${PREFRIX}${typeName1}-${typeName2}.json`;
  }

  return `${PREFRIX}${typeName2}-${typeName1}.json`;
}

/**
 * Return string normalized stats
 * (i.e. 'SpecialAttack' instead of 'special-attack')
 * @param {Object} data Pokemon's stats;
 */
function normalize(data) {
  const { attack, defense, hp, speed, } = data.avg;
  const specialAttack = data.avg['special-attack'];
  const specialDefense = data.avg['special-defense'];

  return { ...data, ...{
      avg: {
        attack,
        defense,
        hp,
        specialAttack,
        specialDefense,
        speed,
      }
    }
  };
}
