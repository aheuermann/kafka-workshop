#!/bin/bash

# Set variables
DBUSER='postgres'
PGPASSWORD='password'
DBNAME='app'

# psql prompt into running postgres instance
docker exec -it -e PGPASSWORD=$PGPASSWORD kafka-workshop-postgres-1 psql -U $DBUSER -d $DBNAME
