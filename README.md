# Organization Service

## Responsibilities
1. API to create new organization
2. Save and Update Trust Registry
3. Update organization config
3. Call Agent Service to send any message on Verity

## Installation Step

```bash
$ npm install
```

## Postgres Installation
[Postgres](https://hub.docker.com/_/postgres) docker pull postgres.

# start a postgres instance
docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
# create new database
docker exec -it <docker-container-name> psql -U postgres

# postgres GUI 
https://dbeaver.io/download/

## run nats server
docker run -p 4222:4222 -ti nats:latest

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

## For windows use below command line

npm install -g win-node-env
