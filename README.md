# pokestats

_A Pokemon specific API service._

This API service's purpose is **not** to be exhaustive about all Pokemon information but rather providing some specific data which don't exist somewhere else (yet).

Under the hood, this service uses [pokedex-promise-v2](https://github.com/PokeAPI/pokedex-promise-v2#readme) library which is based on [PokeAPI](http://pokeapi.co).

## Quickstart

You can use the available URL at the top of [this page](https://github.com/rootasjey/pokestats).

### In the Playground

You can use the API in the browser by navigating on the available link.

It will show a GrapQL playground where you can write a GraphQL request:

Request:

```gql

query {
  averageStats(type1: FIRE) {
    avg {
      attack
      defense
      hp
    }
    types
  }
}

```

You'll receive the following data:

Response:

```json

{
  "data": {
    "averageStats": {
      "avg": {
        "attack": 82,
        "defense": 70,
        "hp": 69
      },
      "types": [
        "fire"
      ]
    }
  }
}

```

### In JavaScript

If you want to use the API in your JavaScript frontend app, you can:

#### Fetch with a 3rd party lib (recommanded)

Install [graphq-requestl](https://github.com/prisma/graphql-request) with

```bash

# yarn
yarn add graphql-request

# npm
npm i --save graphql-request

```

Somewhere in your app, where you want to fetch data:

```JavaScript

import { request } from 'graphql-request';

const query = `{
  averageStats(type1: GROUND) {
    meta { lastUpdated }
    avg {
      attack
      defense
      hp
      specialAttack
      specialDefense
      speed
    }
  }
}`;

const data = await request('URL_on_GitHub_page', query);

```

#### Fetch without any 3rd party lib

```JavaScript

// Somewhere in your code
const headers = new Headers();
headers.append('Content-Type', 'application/json');

fetch('URL_on_GitHub_page', {
  method: 'POST',
  headers,
  data: JSON.stringify({ "query": "averageStats(type1: GROUND) { avg { attack } }" })
});

// If you want to go to next line,
// you've to insert '\n' on th previous line before jumping to the next.
// Which isn't really beautiful :|

```

## Purpose and Features

While building a Pokedex with web technologies, I found myself missing some features from [PokeAPI](http://pokeapi.co) (though I'm very glad this open API exists).

This is my attempt to provide additional features.

*Pokestats* builds is own data for some queries (based on from [PokeAPI](http://pokeapi.co)).

Features:

* GraphQL implementation for data optimizations (get only what you need)
* The `list` endpoint returns a Pokemon `id` and a `Sprites` fields
* A `search` endpoint to query partial Pokemons' names
* Sprites endpoints
* Average Pokemons' statistics endpoint by types
* Like/Dislike endpoint

## Caching

As some queries are expensive, the server caches and saves data (in `JSON` format) for stable information (information which doesn't change frequently) and serves it in subsequent requests.

For example, to get the average Pokemon's battle stats, the server fetchs information about hundreds of Pokemon then calculate the average value for each statistic.

This usually takes some seconds for the server to respond.

The data are automatically updated every few days.

If you don't want to use caching, you can specify `caching: false` for some queries.

```gql

{
  averageStats(type1: GROUND, caching: false) { ... }
}

```

Keep in minde that requesting fresh data uses more data, is slower and uses more computational work.

## API Consumption

You can consume the API in different ways:

* [in the playground](#in-the-playground)
* [JavaScript app with a 3rd-party lib](#Fetch-with-a-3rd-party-lib-(recommanded))
* [JavaScirpt app without any 3rd-party lib](#Fetch-without-any-3rd-party-lib).

## API

* [averageStats](#averageStats)
* [list](#list)
* [pokemonById](#pokemonById)
* [pokemonsByIds](#pokemonsByIds)
* [search](#search)
* [spritesById](#spritesById)
* [spritesByIds](#spritesByIds)
* [spritesByName](#spritesByName)
* [spritesByNames](#spritesByNames)

>NOTE: All examples uses the GraphQL query format in the GrapQL Playground in the browser.

>NOTE: The exmaples requests don't use necessarily all available fields. Hence the example try to show similar requests with different possible fields. To have a full scheme description, visit the GraphQL playground.

### averageStats

You can query the average battle statistics by Pokemon's type.

You can specify 1 or 2 types (the 1st type is mandatory while the second is facultative).

Request (with 1 type):

```gql

query {
  averageStats(type1: FIRE) {
    avg {
      attack
      defense
      hp
    }
    types
  }
}

```

Response:

```json

{
  "data": {
    "averageStats": {
      "avg": {
        "attack": 82,
        "defense": 70,
        "hp": 69
      },
      "types": [
        "fire"
      ]
    }
  }
}

```

Request (with 2 types):

```gql

query {
  averageStats(type1: FIRE, type2: WATER) {
    avg {
      attack
      defense
      hp
    }
    types
  }
}

```

Response:

```json

{
  "data": {
    "averageStats": {
      "avg": {
        "attack": 110,
        "defense": 120,
        "hp": 80
      },
      "types": [
        "water",
        "fire"
      ]
    }
  }
}

```

Only Pokemon's valid types are authorized. Visit the GraphQL playground to have the full available Pokemon's types.

[Back to API](#API)

### list

You can get the list of Pokemons with this endpoint.

If you want to paginate your query, you can specify a `start` and/or and `end` integer parameter.

A query without `start` and `end` parameter will return all Pokemons.

Request:

```gql

query {
  list(start: 1, end: 3) {
    count
    results {
      id,
      name
      url
      sprites {
        defaultFront
      }
    }
  }
}

```

Response:

```json

{
  "data": {
    "list": {
      "count": 3,
      "results": [
        {
          "id": 1,
          "name": "bulbasaur",
          "url": "https://pokeapi.co/api/v2/pokemon/1/",
          "sprites": {
            "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
          }
        },
        {
          "id": 2,
          "name": "ivysaur",
          "url": "https://pokeapi.co/api/v2/pokemon/2/",
          "sprites": null
        },
        {
          "id": 3,
          "name": "venusaur",
          "url": "https://pokeapi.co/api/v2/pokemon/3/",
          "sprites": {
            "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png"
          }
        }
      ]
    }
  }
}

```

[Back to API](#API)

### pokemonById

You can get a pokemon by its id:

Request:

```gql

query {
  pokemonById(id: 151) {
    id
    name
    types {
      type {
        name
      }
    }
    stats {
      baseStat
      stat {
        name
      }
    }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonById": [
      {
        "id": 151,
        "name": "mew",
        "types": [
          {
            "type": {
              "name": "psychic"
            }
          }
        ],
        "stats": [
          {
            "baseStat": 100,
            "stat": {
              "name": "speed"
            }
          },
          {
            "baseStat": 100,
            "stat": {
              "name": "special-defense"
            }
          },
          {
            "baseStat": 100,
            "stat": {
              "name": "special-attack"
            }
          },
          {
            "baseStat": 100,
            "stat": {
              "name": "defense"
            }
          },
          {
            "baseStat": 100,
            "stat": {
              "name": "attack"
            }
          },
          {
            "baseStat": 100,
            "stat": {
              "name": "hp"
            }
          }
        ]
      }
    ]
  }
}

```

If you pass an uknown id (e.g. -1 or 9999), the request will return an object will `null` fields.
Only the `id` field will have the same value has specified in your request.

In the following example, the `ìd` 0 doesn't exists (the first Pokemon's id is 1):

Request:

```gql

query {
  pokemonById(id: 0) {
    id
    name
  }
}

```

Response:

```json

{
  "data": {
    "pokemonById": [
      {
        "id": 0,
        "name": null
      }
    ]
  }
}

```

[Back to API](#API)

### pokemonsByIds

You can use this request to get multiple Pokemons by their ids:

Request:

```gql

query {
  pokemonsByIds(ids: [1, 2]) {
    id
    name
    types {
      type {
        name
      }
    }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonsByIds": [
      {
        "id": 1,
        "name": "bulbasaur",
        "types": [
          {
            "type": {
              "name": "poison"
            }
          },
          {
            "type": {
              "name": "grass"
            }
          }
        ]
      },
      {
        "id": 2,
        "name": "ivysaur",
        "types": [
          {
            "type": {
              "name": "poison"
            }
          },
          {
            "type": {
              "name": "grass"
            }
          }
        ]
      }
    ]
  }
}

```

If you pass an unknown id (e.g. -1 or 9999), the request will return an object will `null` fields.
Only the `id` field will have the same value has specified in your request.

In the following example, the `ìd` 42000 doesn't exists (the first Pokemon's id is 1):

Request:

```gql

query {
  pokemonsByIds(ids: [42000]) {
    id
    name
    abilities { ... }
    types { ... }
    sprites { ... }
    stats { ... }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonsByIds": [
      {
        "id": 42000,
        "name": null,
        "abilities": null,
        "types": null,
        "sprites": null,
        "stats": null
      }
  }
}

```

[Back to API](#API)

#### pokemonByName

You can query a Pokemon by its name:

Request:

```gql

query {
  pokemonByName(name: "charmander") {
    name
    types {
      type {
        name
      }
    }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonByName": [
      {
        "name": "charmander",
        "types": [
          {
            "type": {
              "name": "fire"
            }
          }
        ]
      }
    ]
  }
}

```

If you pass an unknown name (e.g. `"toto"`), the request will return an object will `null` fields.
Only the `name` field will have the same value has specified in your request.

In the following example, Pokemon with the name `"toto"` doesn't exists:

Request:

```gql

query {
  pokemonByName(name: "toto") {
    id
    name
    abilities { ... }
    types { ... }
    sprites { ... }
    stats { ... }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonByName": [
      {
        "id": null,
        "name": "toto",
        "abilities": null,
        "types": null,
        "sprites": null,
        "stats": null
      }
  }
}

```

### pokemonsByNames

You can use the following endpoint to request multiple Pokemons by their names:

```gql

query {
  pokemonsByNames(names: ["mew", "mewtwo"]) {
    id
    name
    types {
      type {
        name
      }
    }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonsByNames": [
      {
        "id": 151,
        "name": "mew",
        "types": [
          {
            "type": {
              "name": "psychic"
            }
          }
        ]
      },
      {
        "id": 150,
        "name": "mewtwo",
        "types": [
          {
            "type": {
              "name": "psychic"
            }
          }
        ]
      }
    ]
  }
}

```

If you pass an unknown name (e.g. `"toto"`), the request will return an object will `null` fields.
Only the `name` field will have the same value has specified in your request.

In the following example, the `name` `"toto"` doesn't exists:

Request:

```gql

query {
  pokemonsByNames(names: ["toto"]) {
    id
    name
    abilities { ... }
    types { ... }
    sprites { ... }
    stats { ... }
  }
}

```

Response:

```json

{
  "data": {
    "pokemonsByNames": [
      {
        "id": null,
        "name": "toto",
        "abilities": null,
        "types": null,
        "sprites": null,
        "stats": null
      }
  }
}

```

### search

You can search for Pokemons containing a specific string in their names.

Unlike the [pokemonsByNames](#pokemonsByNames) query for which you have to provide an exact valid name, the `search` query let you provide partial names.

Request:

```gql

query {
  search(name: "charm") {
    count
    start
    end
    results {
      id
      name
      url
      sprites {
        defaultFront
      }
    }
  }
}

```

Response:

```json

{
  "data": {
    "search": {
      "count": 2,
      "start": 0,
      "end": 2,
      "results": [
        {
          "id": 4,
          "name": "charmander",
          "url": "https://pokeapi.co/api/v2/pokemon/4/",
          "sprites": {
            "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
          }
        },
        {
          "id": 5,
          "name": "charmeleon",
          "url": "https://pokeapi.co/api/v2/pokemon/5/",
          "sprites": {
            "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png"
          }
        }
      ]
    }
  }
}

```

If no match is found, the `count` field will be `0` and the `results` field will be an empty array:

Request:

```gql

query {
  search(name: "bulbi") {
    count
    start
    end
    results {
      id
      name
    }
  }
}

````

Response:

```json

{
  "data": {
    "search": {
      "count": 0,
      "start": 0,
      "end": 0,
      "results": []
    }
  }
}

```

[Back to API](#API)

### spritesById

You can query a single sprite with a Pokemon's id:

Request:

```gql

query {
  spritesById(id: 1) {
    id
    name
    sprites {
      defaultBack
    }
  }
}

```

Response:

```json

{
  "data": {
    "spritesById": [
      {
        "id": "1",
        "name": "bulbasaur",
        "sprites": {
          "defaultBack": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png"
        }
      }
    ]
  }
}

```

If you query an unknown id, the response's fields will be `null` except the `id` one:

```gql

query {
  spritesById(id: 0) {
    id
    name
    sprites {
      defaultBack
    }
  }
}

```

```json

{
  "data": {
    "spritesById": [
      {
        "id": "0",
        "name": null,
        "sprites": null
      }
    ]
  }
}

```

[Back to API](#API)

### spritesByIds

You can request multiple Pokemons' sprites by Pokemons' ids:

Request:

```gql

query {
  spritesByIds(ids: [5, 6, 5]) {
    id
    name
    sprites {
      defaultFront
    }
  }
}

```

Response:

```json

{
  "data": {
    "spritesByIds": [
      {
        "id": "5",
        "name": "charmeleon",
        "sprites": {
          "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png"
        }
      },
      {
        "id": "6",
        "name": "charizard",
        "sprites": {
          "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
        }
      },
      {
        "id": "5",
        "name": "charmeleon",
        "sprites": {
          "defaultFront": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png"
        }
      }
    ]
  }
}

```

If you query unknown ids, the response's fields will be null except the `id` one:

Request:

```gql

query {
  spritesByIds(ids: [-1, 0, 5000]) {
    id
    name
    sprites {
      defaultFront
    }
  }
}

```

Response:

```json

{
  "data": {
    "spritesByIds": [
      {
        "id": "-1",
        "name": null,
        "sprites": null
      },
      {
        "id": "0",
        "name": null,
        "sprites": null
      },
      {
        "id": "5000",
        "name": null,
        "sprites": null
      }
    ]
  }
}

```

[Back to API](#API)

### spritesByName

You can query sprites by a Pokemon's name:

Request:

```gql

query {
  spritesByName(name: "bulbasaur") {
    id
    name
    sprites {
      defaultBack
    }
  }
}

```

Response:

```json

{
  "data": {
    "spritesByName": [
      {
        "id": "1",
        "name": "bulbasaur",
        "sprites": {
          "defaultBack": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png"
        }
      }
    ]
  }
}

```

If the name provided is unknown, the fields response will be `null` except the `name` one:

Request:

```gql

query {
  spritesByName(name: "bulbi") {
    id
    name
    sprites {
      defaultBack
    }
  }
}

````

```json

{
  "data": {
    "spritesByName": [
      {
        "id": null,
        "name": "bulbi",
        "sprites": null
      }
    ]
  }
}

```

[Back to API](#API)

### spritesByNames

You can query sprites by multiple Pokemon's names:

Request:

```gql

query {
  spritesByNames(names: ["bulbasaur", "charmander"]) {
    id
    name
    sprites {
      defaultBack
    }
  }
}

```

Response:

```json

{
  "data": {
    "spritesByNames": [
      {
        "id": "1",
        "name": "bulbasaur",
        "sprites": {
          "defaultBack": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png"
        }
      },
      {
        "id": "4",
        "name": "charmander",
        "sprites": {
          "defaultBack": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png"
        }
      }
    ]
  }
}

```

If the names provided are unknown, the fields response will be `null` except the `name` one:

Request:

```gql

query {
  spritesByNames(names: ["bulbi", "charmi"]) {
    id
    name
    sprites {
      defaultBack
    }
  }
}

```

Response:

```json

{
  "data": {
    "spritesByNames": [
      {
        "id": null,
        "name": "bulbi",
        "sprites": null
      },
      {
        "id": null,
        "name": "charmi",
        "sprites": null
      }
    ]
  }
}

```

[Back to API](#API)

## development

* Clone the repo with `git clone https://github.com/rootasjey/pokestats`
* Go to the cloned repo with `cd pokestats`
* Install dependencies with `yarn` or `npm install`
* Run the app with `yarn run start` or `npm start`

## 3rd party libraries

This project uses:

* [Apollo server](https://apollographql.com)  to create a GraphQL server
* [GraphQL](https://graphql.github.io)
* [node-fs-extra](https://github.com/jprichardson/node-fs-extra) to easily create folders & files and write data
* [pokedex-promise-v2](https://github.com/PokeAPI/pokedex-promise-v2#readme)

## Licence

MIT Licence.
