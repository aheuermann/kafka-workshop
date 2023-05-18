#!/bin/bash

# get the directory of the script itself
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

num_accounts=10
num_orders_per_account=50
statuses=("IN_PROCESS" "PENDING" "INVOICED" "PAID" "DISPATCHED" "DELIVERED" "CLOSED")

function gen_uuid() {
    local uuid=$(uuidgen)
    echo "$uuid"
}

# remove the output file if it exists, then create it
output_file="$SCRIPT_DIR/../data/order-status-updates.txt"
if [ -f "$output_file" ] ; then
    rm "$output_file"
fi
touch "$output_file"

total_generated_records=0

for (( acct=500; acct<$num_accounts; acct++ )); do
    for (( order=0; order<$num_orders_per_account; order++ )); do
        uuid=$(gen_uuid)

        day=0

        for status in "${statuses[@]}"; do
            timestamp=$(date -u -v-${day}d -j -f "%Y-%m-%dT%H:%M:%S" "2023-05-11T20:05:07" "+%Y-%m-%dT%H:%M:%S.225Z")
            # add the order entry to the file
            echo "{\"id\":\"$uuid\",\"accountId\":\"acct_$acct\",\"status\":\"$status\",\"timestamp\":\"$timestamp\"}" >> "$output_file"
            day=$((day+1))
            total_generated_records=$((total_generated_records+1))
        done
    done
done

echo << EOF
Done.
$total_generated_records total records
file: $output_file
EOF