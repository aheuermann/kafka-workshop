#!/bin/bash

# Set variables
DBUSER='postgres'
PGPASSWORD='password'
DBHOST='host.docker.internal'
DBNAME='app'
QUERY='truncate public.order_status;'

# Run the query using psql
docker run -i --rm -e PGPASSWORD=$PGPASSWORD postgres:15 psql -w -h $DBHOST -p 5432 -U $DBUSER -d $DBNAME -c "$QUERY"
