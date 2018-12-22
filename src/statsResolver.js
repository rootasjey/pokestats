const fs      = require('fs-extra');
const Pokedex = require('./pokedex-api');

const PREFRIX = './data/';

module.exports = {
  calculateAvgStats: async (types = []) => {
    if (types.length > 1) {
      return await calculateMultiple(types);
    }

    return await calculateSingle(types);
  },
}
async function calculateMultiple(types = []) {
  const type1 = types[0];
  const type2 = types[1];

  const avg = {
    'attack'          : 0,
    'defense'         : 0,
    'hp'              : 0,
    'special-attack'  : 0,
    'special-defense' : 0,
    'speed'           : 0,
  };

  const meta = { lastUpdated: undefined };

  if (typeof type1 !== 'string' || typeof type2 !== 'string' ||
      type1.length === 0 || type2.length === 0) {

      return normalize({ avg, meta });
  }
}

async function calculateSingle(types = []) {
  const type = types[0];

  const filePath = `${PREFRIX}${type.name}.json`;

  const fileExists = await fs.pathExists(filePath);

  if (fileExists) {
    const savedData     = await fs.readJSON(filePath);
    const previousDate  = new Date(savedData.meta.lastUpdated);
    const currentDate   = new Date();

    if (currentDate.getDay() - previousDate.getDay() < 2) {
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

    const data = { avg, meta };

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
