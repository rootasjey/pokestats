const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    """API version"""
    version: String,

    """Get a Pokemon's type average stats"""
    averageStats(type1: Type!, type2: Type, cached: Boolean = true): StatsResponse,

    """Get a Pokemon's likes and dislikes"""
    controversy(pokemonId: Int!): ControversyResponse,

    """Get one Pokemons' sprites by its Pokemon's ID.
     If the id is not found, the sprites property will be null."""
    spritesById(id: Int!): [SpritesEntry]!,

    """Get multiple Pokemons' sprites by their Pokemons' ID.
     If the id is not found, the sprites property will be null."""
    spritesByIds(ids: [Int!]!): [SpritesEntry]!,

    """Get one Pokemon's sprites by its Pokemons' names.
     If the name is not found, the sprites property will be null."""
    spritesByName(name: String!): [SpritesEntry]!,

    """Get multiple Pokemons' sprites by their Pokemons' names.
     If the name is not found, the sprites property will be null."""
    spritesByNames(names: [String!]!): [SpritesEntry]!,
  }

  type Mutation {
    """Add +1 to dislikes count"""
    dislike(pokemonId: Int!): ControversyResponse,

    """Add +1 to likes count"""
    like(pokemonId: Int!): ControversyResponse,
  }

  """Meta data (e.g. last updated)"""
  type Meta {
    """Last time the data was updated (and not cached)"""
    lastUpdated: String,
  }

  """A Sprites object containing images' URLs"""
  type Sprites {
    femaleBack: String,
    femaleFront: String,
    femaleShinyBack: String,
    femaleShinyFront: String,
    maleBack: String,
    maleFront: String,
    maleShinyBack: String,
    maleShinyFront: String,
  }

  """A Pokemon's sprites"""
  type SpritesEntry {
    id: String,
    name: String,
    sprites: Sprites,
  }

  """Pokemon statistics"""
  type Stats {
    """Pokemon physical attack value"""
    attack: Int,

    """Pokemon defense value"""
    defense: Int,

    """Pokemon health point value"""
    hp: Int,

    """Pokemon special attack value"""
    specialAttack: Int,

    """Pokemon special defense value"""
    specialDefense: Int,

    """Pokemon speed value"""
    speed: Int,
  }

  """API response for statistics"""
  type StatsResponse {
    """Pokemon's average statistics"""
    avg: Stats,

    """Response meta data"""
    meta: Meta,

    """Number of Pokemons the stats were calculated from"""
    pokemonCount: Int!,

    """Stats for the type(s) required"""
    types: [String!]!,
  }

  """API response for controversy"""
  type ControversyResponse {
    """Pokemon's id"""
    id: Int!,

    """Pokemon's name"""
    name: String,

    """Pokemon's amount of likes"""
    likes: Int!,

    """Pokemon's amount of dislikes"""
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
