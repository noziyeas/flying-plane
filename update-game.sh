#!/bin/bash

# Ensure we're on main branch
git checkout main

# Build the game
npm run build

# Commit changes to main (if any)
git add .
git commit -m "Update game: $1" || echo "No changes to commit on main"
git push origin main

# Switch to gh-pages and update it
git checkout gh-pages
git merge main
git add dist -f
git commit -m "Update game build: $1" || echo "No changes to commit on gh-pages"
git push origin gh-pages

# Switch back to main branch
git checkout main

echo "Game updated and deployed! It may take a few minutes to be live." 