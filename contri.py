import os
import subprocess
from datetime import datetime, timedelta
import random

# Configuration
start_date = datetime(2024, 11, 10)
end_date = datetime(2024, 12, 26)
file_name = "dummy_contribution.txt"
gap_days = 2

# Get repository path
repo_path = "D:\\clg\\website\\portfolio_web"
os.chdir(repo_path)

# Loop through dates
current_date = start_date
while current_date <= end_date:
    contrib_count = random.randint(1, 5)
    for i in range(contrib_count):
        with open(file_name, "a") as file:
            file.write(f"Contribution {i + 1} on {current_date.strftime('%Y-%m-%d')}\n")
        subprocess.run(["git", "add", file_name])
        date_str = current_date.strftime('%Y-%m-%dT%H:%M:%S')
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = date_str
        env["GIT_COMMITTER_DATE"] = date_str
        subprocess.run(["git", "commit", "-m", f"contribution on {current_date.strftime('%Y-%m-%d')}"], env=env)
    current_date += timedelta(days=gap_days)

# Push changes
subprocess.run(["git", "push", "origin", "master"])
