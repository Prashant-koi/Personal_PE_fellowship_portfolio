#!/bin/bash
tmux kill-server
cd ~/Personal_PE_fellowship_portfolio
git fetch && git reset origin/main --hard
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
tmux new-session -d -s flask "cd ~/Personal_PE_fellowship_portfolio && source .venv/bin/activate && flask run --host=0.0.0.0 --port=5000"
