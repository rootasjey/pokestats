# pokestats

A Pokemon specific API service.

This API service's purpose is **not** to be exhaustive about all Pokemon information but rather some specific data which don't exist somewhere else (yet).

## Quickstart

You can use the available URL at the top of [this page](https://github.com/rootasjey/pokestats).

### In the Playground

You can use the API in the browser by navigating on the available link.

It will show a GrapQL playground where you can write a GraphQL request:

```gql
{
  averageStats(type1: GROUND) {
    meta { lastUpdated }
    avg {
      attack
    }
  }
}
```

You'll receive data similar to:

```json
{
  "data": {
    "averageStats": {
      "meta": {
        "lastUpdated": "2018-12-22T12:57:10.583Z"
      },
      "avg": {
        "attack": 92
      }
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

Know that requesting fresh data uses more data, is slower and uses more computational work.

## API Consumption

You can consume the API in different ways:

* [in the playground](#in-the-playground)
* [JavaScript app with a 3rd-party lib](#Fetch-with-a-3rd-party-lib-(recommanded))
* [JavaScirpt app without any 3rd-party lib](#Fetch-without-any-3rd-party-lib).

## API

>NOTE: All examples uses the GraphQL query format used in the GrapQL Playground in the browser.

* [average stats](#average-stats)

### Average Stats

You can query the average battle statistics by Pokemon's type.

You can specify 1 or 2 types (the 1st type is mandatory).

Request (with 1 type):

```gql

{
  averageStats(type1: GROUND) {
    avg {
      specialAttack
      specialDefense
      speed
    }
  }
}

```

Response:

```json

{
  "data": {
    "averageStats": {
      "avg": {
        "specialAttack": 61,
        "specialDefense": 65,
        "speed": 60
      }
    }
  }
}

```

Request (with 2 types):

```gql

{
  averageStats(type1: BUG, type2: POISON) {
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
      "avg": {
        "attack": 92,
        "defense": 87,
        "hp": 76
      },
      "types": ["bug", "poison"]
    }
  }
}

```

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