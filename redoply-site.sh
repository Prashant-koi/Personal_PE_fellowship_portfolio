#!/bin/bash
cd ~/Personal_PE_fellowship_portfolio
git fetch && git reset origin/main --hard
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
systemctl daemon-reload
systemctl restart myportfolio
