#!/bin/bash

# Set variables
DBUSER='postgres'
PGPASSWORD='password'
DBHOST='postgres'
DBNAME='app'
QUERY='SELECT * FROM public.order_status;'

# Run the query using psql
docker run -i --rm --network=kafka-workshop_default -e PGPASSWORD=$PGPASSWORD postgres:15 psql -w -h $DBHOST -p 5432 -U $DBUSER -d $DBNAME -c "$QUERY"
