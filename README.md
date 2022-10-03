# mes-user-service

A serverless microservice responsible for responsible for retrieving user details for driving examiners.
Primarily intended to be used with the [MES mobile app](https://github.com/dvsa/mes-mobile-app).

## Dependencies

DVSA dependencies have been moved from npm to github so in order to install/update any private @DVSA packages
you are required to have an entry in your global `~/.npmrc` file as follows:

```shell
//npm.pkg.github.com/:_authToken=<your auth token here>
```

## Structure

All serverless functions live in dedicated directories in `src/functions`.
Code that is common between multiple functions should reside in `src/common`.

As per the principles of Hexagonal Architecture, each function has the following directories to help us separate concerns:

* `framework` - contains all Inbound and Outbound Adapters, and all use of external/proprietary APIs - depends upon...
* `application` - contains all Inbound and Outbound Ports, doesn't use any external/proprietary APIs - depends upon...
* `domain` - contains all domain objects (Aggregates, Objects, Value classes etc) with all "business logic" (not just anaemic data holders), doesn't use any external/proprietary APIs.

## Bootstrap

The domain model for the journal is maintained as a JSON Schema. In order to compile the project, you need to generate the type information:

```shell
npm run bootstrap
```

## Build

To build a zip file for every function to `build/artifacts`, run:

```shell
npm run package
```

To build a subset of the functions, pass a comma separated list of function names, like so:

```shell
npm run package -- get,set
```

N.b. The build requires [jq](https://github.com/stedolan/jq).

## Test

To run the unit tests, simply run:

```shell
npm test
```

## Offline Testing

To spin up a local database to allow for local testing, run the following command:

```shell
npm run start
```
This will populate a local database populated from test-data/dynamo-seed-users.json and 
can be accessed via http://localhost:3000/dev/users/1234567 
This will require you to have appropreate credentials for aws set in ~/.aws/credentials
