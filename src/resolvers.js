const { calculateAvgStats } = require('./statsResolver');
const Pokedex               = require('./pokedex-api');

module.exports = {
  Query: {
    version: () => '1.0.0',

    averageStats: async (root, args) => {
      const { type1, type2 } = args;
      let types = type2 ? [type1, type2] : [type1];

      types = types.map((type) => {
        return type.toLowerCase();
      });

      try {
        const response = await Pokedex.getTypeByName(types);
        return await calculateAvgStats(response);

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
  },
};