# Aggregator for Pryv.io 

Pryv.io is Pryv's software (middleware) for the management of personal data, see [pryv.com](https://pryv.com).

While Pryv.io is designed to store and manage data per-individual / per-consent, it also allows to aggregate data from multiple individuals in a single place. Our aggregator enables you to pool data from multiple sources at once, and to create appropriate and up-to-date datasets with data across multiple accounts. 
A basic use case could be a clinical trial involving data from a cohort of patients from different institutions.

## Aggregator's Features

### Basics

- Holds a set of [pryvApiEndpoints](https://api.pryv.com/guides/app-guidelines/) `https://{token}@{individial storage path}/` which contain the necessary credentials to access a single account. 
- When a new individual's apiEndPoint is registered on the aggregator, the aggregator:
  - Fetches the current streams structure and events
  - Creates and register one [Webhook](https://api.pryv.com/guides/webhooks/) per individual on Pryv.io to be advertised of changes.
- The aggregator then listens for triggers from the webhooks and advertises of changes in the account.

### State Storage

- States (list of pryvApiEndpoints & synchronization statuses) can be stored locally on the server or remotely in a dedicated Pryv.io account. 
- The aggregator offers a framework to design custom state storage.

### Data Storage

- Individual's data can be stored locally in a SQLite database.
- The aggregator offers a framework to design custom data storage.

## Install

### Requirements: 

	- Node.js 12+
	- NPM 
	- An option SSL reverse-proxy (exemple nginx) to secure trigger notices.

### Install:

- run `npm setup`

### Configuration: 

- edit `config.json`
  - **server:** Server configuration
    - **port:** the port to listen
    - **host**: the interface to use. for all:  `0.0.0.0`, for localhost only: `127.0.0.1`
  - **service**: Url to reach the aggregator service, if no SSL termination: **http://{hostname}:{port}/**
  - **state-storage**: Choose **one** stage storage to use, see stage storage below
  - **data-change-listeners**: Array of **data listeners** to use, more information below

#### Configuration, State Storage

A State storage holds the list of webhooks and their status. Currently supported stage storage is SQLITE. 

``` json
 "state-storage": {
    "module": "StateStorageSqlite",
    "params": {
      "dbfile": "./db-states.sqlite",
      "log": false
    }
  }
```

To implement your own State Storage, refer to `src/state-storage`.

#### Configuration, Data Listeners

A Data Listener registers to data change and takes actions. For example, `DataListenerConsole` prints out changes and `DataListenerSQLite` keeps streams and events data in a local database.

```json
"data-change-listeners": [
    {
      "module": "DataListenerConsole",
      "params": {}
    },
    {
      "module": "DataListenerSQLite",
      "params": {
        "dbfile": "./db-data.sqlite",
        "log": false
      }
    }
  ]
```

To implement your own Data Listener, refer to `src/data-change-listeners`.

## Run

`npm run start`

## API

### Register a new "hook"

`POST /hook`

Content:

```json
{
	"pryvApiEndpoint": "https://{token}@{pryvApiEndPoint}"
}
```

Result:

```json
{
	"result": "OK"
}
```





## Test

`npm run test`

# Contribute

Contributions are welcome. 
The architecture has been made modular to facilitate extension.

## Design



# License

BSD-3 Clause
