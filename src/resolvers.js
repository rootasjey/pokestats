const { ApolloError }       = require('apollo-server');
const { calculateAvgStats } = require('./statsResolver');
const Pokedex               = require('./pokedex-api');

const {
  dislike,
  getControversy,
  like,
} = require('./controversyResolvers');

const {
  getSpritesById,
  getSpritesByIds,
  getSpritesByName,
  getSpritesByNames,
} = require('./spritesResolvers');

module.exports = {
  Query: {
    version: () => '1.1.0',

    averageStats: async (root, args) => {
      const { cached, type1, type2 } = args;
      let typesNames = type2 ? [type1, type2] : [type1];

      if (type1 === type2) {
        typesNames = [type1];
      }

      typesNames = typesNames.map((type) => {
        return type.toLowerCase();
      });


      try {
        const types = await Pokedex.getTypeByName(typesNames);
        return await calculateAvgStats({ cached, types });

      } catch (error) {
        return {
          error,
          meta: { lastUpdated: '' },
          stats: {
            'attack'          : 0,
            'defense'         : 0,
            'hp'              : 0,
            'special-attack'  : 0,
            'special-defense' : 0,
            'speed'           : 0,
          }
        };
      }
    },

    controversy: async (root, args) => {
      const { pokemonId } = args;

      if (pokemonId < 1 || pokemonId > 949) {
        return new ApolloError("Pokemon's id must be between 1 and 949", '404');
      }

      return await getControversy({ pokemonId });
    },

    spritesById: async(root, args) => {
      const { id } = args;
      return await getSpritesById(id);
    },

    spritesByIds: async (root, args) => {
      const { ids } = args;
      return await getSpritesByIds(ids);
    },

    spritesByName: async(root, args) => {
      const { name } = args;
      return await getSpritesByName(name);
    },

    spritesByNames: async(root, args) => {
      const { names } = args;
      return await getSpritesByNames(names);
    }
  },

  Mutation: {
    dislike: async (root, args) => {
      const { pokemonId } = args;

      if (pokemonId < 1 || pokemonId > 949) {
        return new ApolloError("Pokemon's id must be between 1 and 949", '404');
      }

      return await dislike({ pokemonId });
    },

    like: async (root, args) => {
      const { pokemonId } = args;

      if (pokemonId < 1 || pokemonId > 949) {
        return new ApolloError("Pokemon's id must be between 1 and 949", '404');
      }

      return await like({ pokemonId });
    }
  }
};
