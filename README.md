# HH Resume Bumper

HH Resume Bumper is a simple node console tool made for auto checking and bumping resume on hh.ru.

(Currently it bumps only the first resume on your resumes page)

## Setup config
Go to the **config** folder and edit **defaults.json** config in following way:

In ``token`` set your hhtoken from browser storage/cookies

In ``interval`` set desired resume check interval in MS (Higher is better but default value is fine)

## Install && Launch
```sh
yarn install
node main.js
```

A little advice: run program through **pm2** on VPS to forget about it and don't care about restarts on crash.


> Note: The program is made for fun, personal use, without any obligation and mandatory in further support
