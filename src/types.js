const { gql } = require('apollo-server');

module.exports = gql`
  # ..................
  # GraphQL Operations
  # ..................
  type Query {
    """API version"""
    version: String,

    """Get a Pokemon's type average stats"""
    averageStats(type1: Type!, type2: Type, cached: Boolean = true): StatsResponse,

    """Get a Pokemon's likes and dislikes"""
    controversy(pokemonId: Int!): ControversyResponse,

    """Return a pokemons' list (from a start to an end if specified)."""
    list(start: Int, end: Int): ListResult,

    """Get a Pokemon's data from its id."""
    pokemonById(id: Int!): [Pokemon]!,

    """Get multiple Pokemons' data from their id."""
    pokemonsByIds(ids: [Int!]!): [Pokemon]!,

    """Get a Pokemon's data from its name."""
    pokemonByName(name: String!): [Pokemon]!,

    """Get multiple Pokemons' data from their name."""
    pokemonsByNames(names: [String!]!): [Pokemon]!,

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

  # ..................
  # Custom types
  # ..................

  """API response for controversy"""
  type ControversyResponse {
    """Pokemon's id"""
    id: Int!,

    """Pokemon's name"""
    name: String,

    """Pokemon's amount of likes"""
    likes: Int!,

    """Pokemon's amount of dislikes."""
    dislikes: Int!,
  }

  type ListResult {
    """Number of Pokemons returned in this result."""
    count: Int,

    """Stop the list data to this Pokemon's id."""
    end: Int,

    """List of Pokemons."""
    results: [MinimalPokemon],

    """Stat the list data from this Pokemon's id."""
    start: Int,
  }


  """Meta data (e.g. last updated)."""
  type Meta {
    """Last time the data was updated (and not cached)."""
    lastUpdated: String,
  }

  """Minimal pokemon's data."""
  type MinimalPokemon {
    """Pokemon's id."""
    id: Int,

    """Pokemon's name."""
    name: String,

    """Pokemon's sprites."""
    sprites: Sprites,

    """Pokemon's information URL."""
    url: String,
  }

  type MoveLearnMethod {
    name: String,
    url: String,
  }

  type Pokemon {
    abilities: [PokemonAbilities],
    baseExperience: Int,
    forms: [PokemonForm],
    height: Int,
    gameIndices: [PokemonGameIndice],
    heldItems: [PokemonHeldItem],
    id: Int,
    isDefault: Boolean,
    locationAreaEncounters: String,
    moves: [PokemonMoveEntry],
    name: String,
    order: Int,
    species: [PokemonSpecies],
    sprites: Sprites,
    stats: [PokemonStats],
    types: [PokemonTypeEntry],
    weight: Int,
  }

  type PokemonAbilities {
    ability: PokemonAbilitiesEntry,
    isHidden: Boolean,
    slot: Int,
  }

  type PokemonAbilitiesEntry {
    name: String,
    url: String,
  }

  type PokemonForm {
    name: String,
    url: String,
  }

  type PokemonGameIndice {
    gameIndex: Int,
    version: PokemonVersion,
  }

  type PokemonHeldItem {
    item: PokemonItem,
    versionDetails: PokemonVersionDetails,
  }

  type PokemonItem {
    name: String,
    url: String,
  }

  type PokemonMoveEntry {
    move: PokemonMove,
    versionGroupDetails: [PokemonVersionGroupDetails],
  }

  type PokemonMove {
    name: String,
    url: String,
  }

  type PokemonSpecies {
    name: String,
    url: String,
  }

  type PokemonStats {
    baseStat: Int,
    effort: Int,
    stat: PokemonStat,
  }

  type PokemonStat {
    name: String,
    url: String,
  }

  type PokemonTypeEntry {
    slot: Int,
    type: PokemonType,
  }

  type PokemonType {
    name: String,
    url: String,
  }

  type PokemonVersion {
    name: String,
    url: String,
  }

  type PokemonVersionDetails {
    rarity: Int,
    version: PokemonVersion,
  }

  type PokemonVersionGroupDetails {
    levelLearnedAt: Int,
    moveLearnMethod: MoveLearnMethod,
    versionGroup: PokemonVersion,
  }

  """A Sprites object containing images' URLs"""
  type Sprites {
    """Image's URL of the back of this female Pokemon (if any)."""
    femaleBack: String,

    """Image's URL of the front of this female Pokemon (if any)."""
    femaleFront: String,

    """Image's URL of the back of this female shiny Pokemon (if any)."""
    femaleShinyBack: String,

    """Image's URL of the front of this shiny female Pokemon (if any)."""
    femaleShinyFront: String,

    """Image's URL of the back of this Pokemon."""
    defaultBack: String,

    """Image's URL of the front of this Pokemon."""
    defaultFront: String,

    """Image's URL of the back of this shiny Pokemon (if any)."""
    defaultShinyBack: String,

    """Image's URL of the front of this shiny Pokemon (if any)."""
    defaultShinyFront: String,
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
