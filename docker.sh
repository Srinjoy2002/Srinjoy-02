#!/bin/bash

start_date="2025-01-22"
end_date="2025-02-09"

while [ "$start_date" != "$end_date" ]; do
    num_commits=$((RANDOM % 4 + 2))  # Generates a random number between 2 and 5

    for ((i=1; i<=num_commits; i++)); do
        echo "Commit on $start_date - $i" > file.txt
        git add file.txt

        commit_time="$start_date $(shuf -i 8-23 -n 1):$(shuf -i 0-59 -n 1):$(shuf -i 0-59 -n 1)"  
        GIT_AUTHOR_DATE="$commit_time" GIT_COMMITTER_DATE="$commit_time" git commit -m "updated #$i on $start_date"
    done

    start_date=$(date -I -d "$start_date + 1 day")  # Move to the next day
done

git push origin master  # Push to GitHub (ensure remote is set)
