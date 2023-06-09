#!/bin/bash  
  
# Check if the commit message follows the correct format  
if ! [[ $* == *"[Merge branch 'dev']"* ]]; then  
  echo "Commit message must follow the '[Merge branch 'dev']' format"  
  exit 1  
fi  
  
# Get the commit SHA and destination branch from the environment variables  
source_branch=$1  
destination_branch=$2  
  
# Check if the commit SHA and destination branch are valid  
if [ -z "$source_branch" ] || [ -z "$destination_branch" ]; then  
  echo "Invalid arguments or environment variables"  
  exit 1  
fi  
  
# Create the merge request  
echo "Creating merge request from $source_branch to $destination_branch..."  
git checkout $destination_branch  
git merge $source_branch -m "$*"