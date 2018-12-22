const { gql } = require('apollo-server');

module.exports = gql`
  "To query data"
  type Query {
    "API version"
    version: String,

    "Get a Pokemon's type average stats"
    averageStats(type1: Type!, type2: Type): StatsResponse,
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
    "Response meta data"
    meta: Meta,

    "Pokemon's average statistics"
    avg: Stats,
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