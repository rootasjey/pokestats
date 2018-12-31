const Pokedex = require('../pokedex-api');

const {
  toPascalNameSprites,
} = require('./utils');

module.exports = {
  async getPokemonById(id = 1) {
    const data = await fetchPokemon({ pokeId: id });
    return [data];
  },

  async getPokemonsByIds(ids = []) {
    const promises = ids
      .map(async (id) => {
        return await fetchPokemon({ pokeId: id });
      });

    return Promise
      .all(promises)
      .then((data) => {
        return data;
      });
  },

  async getPokemonByName(name = '') {
    const data = await fetchPokemon({ pokeName: name });
    return [data];
  },

  async getPokemonsByNames(names = []) {
    const promises = names
      .map(async (name) => {
        return await fetchPokemon({ pokeName: name });
      });

    return Promise
      .all(promises)
      .then((data) => {
        return data;
      });
  },
}

async function fetchPokemon({ pokeId, pokeName }) {
  const idOrName = pokeId ? pokeId : pokeName;

  try {
    const pokemon = await Pokedex.getPokemonByName(idOrName);

    const {
      abilities,
      base_experience: baseExperience,
      forms,
      height,
      game_indices: gameIndices,
      held_items: heldItems,
      id,
      is_default: isDefault,
      location_area_encounters: locationAreaEncounters,
      moves,
      name,
      order,
      species,
      sprites,
      stats,
      types,
      weight,
    } = pokemon;

    const normalizedPokemon = {
      abilities: toPascalName('abilities')(abilities),
      baseExperience,
      forms,
      height,
      gameIndices: toPascalName('gameIndices')(gameIndices),
      heldItems: toPascalName('heldItems')(heldItems),
      id,
      isDefault,
      locationAreaEncounters,
      moves: toPascalName('moves')(moves),
      name,
      order,
      species,
      sprites: toPascalName('sprites')(sprites),
      stats: toPascalName('stats')(stats),
      types,
      weight,
    }

    return normalizedPokemon;

  } catch (error) {
    return {
      id: typeof pokeId !== 'undefined' ? pokeId : null,
      name: typeof pokeName !== 'undefined' ? pokeName : null,
    }
  }
}

function toPascalName(name = '') {
  const defaultFun = (data) => data;

  const fun = {
    abilities: toAbilities,
    gameIndices: toGameIndices,
    heldItems: toHeldItems,
    moves: toMoves,
    sprites: toPascalNameSprites,
    stats: toStats,
    versionGroupDetails: toVersionGroupDetails,
  };

  return fun[name] ? fun[name] : defaultFun;
}

function toAbilities(abilities = []) {
  return abilities
    .map((abilityEntry) => {
      const { ability, is_hidden: isHidden, slot } = abilityEntry;

      return {
        ability,
        isHidden,
        slot,
      };
    });
}

function toGameIndices(gameIndices = []) {
  return gameIndices
    .map((gameIndice) => {
      const { game_index: gameIndex, version } = gameIndice;

      return {
        gameIndex,
        version,
      };
    });
}

function toHeldItems(heldItems = []) {
  return heldItems
    .map((heldItem) => {
      const { item, version_details: versionDetails } = heldItem;

      return {
        item,
        versionDetails,
      };
    });
}

function toMoves(moveEntries = []) {
  return moveEntries
    .map((moveEntry) => {
      const {
        move,
        version_group_details: versionGroupDetails
      } = moveEntry;

      return {
        move,
        versionGroupDetails: toPascalName('versionGroupDetails')(versionGroupDetails),
      };
    });
}

function toStats(stats = []) {
  return stats
    .map((statEntry) => {
      const {
        base_stat: baseStat,
        effort,
        stat,
      } = statEntry;

      return {
        baseStat,
        effort,
        stat,
      };
    });
}

function toVersionGroupDetails(versionGroupDetails = []) {
  return versionGroupDetails
    .map((vGroupDetails) => {
      const {
        level_learned_at: levelLearnedAt,
        move_learn_method: moveLearnMethod,
        version_group: versionGroup,
      } = vGroupDetails;

      return {
        levelLearnedAt,
        moveLearnMethod,
        versionGroup,
      }
    });
}
