## Getting started

```bash
# 1. Clone the repository.
# 2. Enter your newly-cloned folder.
# 3. Create Environment variables file.
cp .env.example .env

# 3. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install)
yarn
```
### Development
```bash
# 4. Run development server and open http://localhost:3000
yarn start:dev

# 5. Read the documentation linked below for "Setup and development".
```

### Build

To build the App, run

```bash
yarn build:prod
```
## Run test
```bash
yarn test
```

## Migration
```bash
yarn typeorm migration:generate -d <path your DataSource instance> <Path of the migration file><The migration file name>
```
# Example
```bash
yarn typeorm migration:generate -d src/database/default/ormconfig.ts src/database/default/migrations/intdb
```
# Run Migration 
```bash
yarn typeorm migration:run -d <path your DataSource instance>
```
# Example
```bash
yarn typeorm migration:run -d src/database/default/ormconfig.ts
```
# Migration Revert 
```bash
yarn typeorm migration:revert -d src/database/default/ormconfig.ts
```
# Schema Sync
```bash
yarn typeorm schema:sync -d src/database/default/ormconfig.ts
```
# Schema Drop
```bash
yarn typeorm schema:drop -d src/database/default/ormconfig.ts
```

## Seed create
```bash
yarn seed:create <path seed file>
```
# Example
```bash
yarn seed:create src/database/default/seeds/user
```
## Seed run
```bash
yarn seed:run <path data dataSource>
```
# Example
```bash
yarn seed:run  -d src/database/default/ormconfig.ts
```
## Seed run specific file
```bash
yarn seed:run <path data dataSource> --name <path seed file>
```
# Example
```bash
yarn seed:run  -d src/database/default/ormconfig.ts --name src/database/default/seeds/1724034017576-user.ts
```

## Kafka run local
```bash
docker-compose -f kafka.yml up -d
```
- Kafka UI
```bash
http://localhost:19000/
```