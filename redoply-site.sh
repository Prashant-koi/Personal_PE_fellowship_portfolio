#!/bin/bash
cd ~/Personal_PE_fellowship_portfolio
git fetch && git reset origin/main --hard
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
