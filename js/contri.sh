#!/bin/bash

# Variables
start_date="2024-11-10"
end_date="2024-12-26"
repo_path=$(pwd)  # Current directory
file_name="dummy_contribution.txt"
gap_days=2

# Convert start_date and end_date to seconds
start_seconds=$(date -d "$start_date" +%s)
end_seconds=$(date -d "$end_date" +%s)

# Loop over each day with the gap
current_date_seconds=$start_seconds

while [ $current_date_seconds -le $end_seconds ]; do
    # Generate random number of contributions (between 1 and 5)
    contrib_count=$((RANDOM % 5 + 1))

    for ((i = 1; i <= contrib_count; i++)); do
        # Create or modify a file
        echo "Contribution $i on $(date -d @$current_date_seconds '+%Y-%m-%d')" >> $file_name
        git add $file_name

        # Commit with a backdated timestamp
        GIT_AUTHOR_DATE=$(date -d @$current_date_seconds '+%Y-%m-%dT%H:%M:%S') \
        GIT_COMMITTER_DATE=$(date -d @$current_date_seconds '+%Y-%m-%dT%H:%M:%S') \
        git commit -m "Fake contribution on $(date -d @$current_date_seconds '+%Y-%m-%d')"
    done

    # Move to the next contribution date with a gap
    current_date_seconds=$(($current_date_seconds + $gap_days * 86400))
done

# Push changes to GitHub
git push origin master
