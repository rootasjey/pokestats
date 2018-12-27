const { gql } = require('apollo-server');

module.exports = gql`
  "Query data"
  type Query {
    "API version"
    version: String,

    "Get a Pokemon's type average stats"
    averageStats(type1: Type!, type2: Type, cached: Boolean = true): StatsResponse,

    "Get a Pokemon's likes and dislikes"
    controversy(pokemonId: Int!): ControversyResponse,
  }

  "Update data"
  type Mutation {
    "Add +1 to dislikes count"
    dislike(pokemonId: Int!): ControversyResponse,

    "Add +1 to likes count"
    like(pokemonId: Int!): ControversyResponse,
  }

  "Meta data (e.g. last updated)"
  type Meta {
    "Last time the data was updated (and not cached)"
    lastUpdated: String,
  }

  "Pokemon statistics"
  type Stats {
    "Pokemon physical attack value"
    attack: Int,

    "Pokemon defense value"
    defense: Int,

    "Pokemon health point value"
    hp: Int,

    "Pokemon special attack value"
    specialAttack: Int,

    "Pokemon special defense value"
    specialDefense: Int,

    "Pokemon speed value"
    speed: Int,
  }

  "API response for statistics"
  type StatsResponse {
    "Pokemon's average statistics"
    avg: Stats,

    "Response meta data"
    meta: Meta,

    "Number of Pokemons the stats were calculated from"
    pokemonCount: Int!,

    "Stats for the type(s) required"
    types: [String!]!,
  }

  "API response for controversy"
  type ControversyResponse {
    "Pokemon's id"
    id: Int!,

    "Pokemon's name"
    name: String,

    "Pokemon's amount of likes"
    likes: Int!,

    "Pokemon's amount of dislikes"
    dislikes: Int!,
  }

  """Pokemon's type"""
  enum Type {
    BUG,
    DARK,
    DRAGON,
    GROUND,
    GHOST,
    GRASS,
    ELECTRIC,
    FAIRY,
    FIGHTING,
    FIRE,
    FLYING,
    ICE,
    INSECT,
    NORMAL,
    POISON,
    PSYCHIC,
    ROCK,
    SHADOW,
    STEEL,
    UNKNOWN,
    WATER,
  }
`;
