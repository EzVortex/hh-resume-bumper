# HH Resume Bumper

HH Resume Bumper is a simple node console tool made for auto checking and bumping resumes on hh.ru.

## Setup config
Go to the **config** folder and edit **defaults.json** config in following way:

In ``token`` set your hhtoken from browser storage/cookies

In ``checkInterval`` set desired resume check interval in MS (Higher is better but default value is fine)

In ``bumpInterval`` set desired resume bump interval in MS, useful if you have multiple resumes

## Install && Launch
```sh
yarn install
node main.js
```
A little advice: run program through **pm2** on VPS to forget about it and don't care about restarts on crash.

**Or just use included docker container. (docker-compose up -d)**


> Note: The program is made for fun, personal use, without any obligation and mandatory in further support
