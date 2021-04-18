#!/bin/bash

setup_color() {
	if [ -t 1 ]; then
		RED=$(printf '\033[31m')
		GREEN=$(printf '\033[32m')
		YELLOW=$(printf '\033[33m')
		BLUE=$(printf '\033[34m')
		RESET=$(printf '\033[m')
	else
		RED=""
		GREEN=""
		YELLOW=""
		BLUE=""
		RESET=""
	fi
}


fetch_changes_and_deploy() {
	echo -e "$BLUE>>>> Local git repo status: <<<<$RESET"
	git status
	echo -e "$BLUE>>>> Fetching info about remote changes... <<<<$RESET"
	git fetch
	echo -e "$BLUE>>>> Local git repo status after git fetch: <<<<$RESET"
	git status
	echo -e "$BLUE>>>> Pulling remote changes to local repo... <<<<$RESET"
	git pull origin main
	echo -e "$BLUE>>>> Building React app... <<<<$RESET"
	npm run build
}

setup_color
fetch_changes_and_deploy
