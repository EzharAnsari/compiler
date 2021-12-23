/**** Prerequisite ****/
First install (npm or yarn) and node

/**** Run ****/
For run SQL Generator
first download SqlGenerator file from github after that
run some command
npm install | yarn
npm run build | yarn build
npm run start | yarn start

/**** Debug ****/
node inspect ./dist/main.js
Now open chrome browser and type chrome://inspect in search bar and enter
after some time (probably 2-3 seconds) in Remote Target there will be one trace available
now click on inspect
It will open new window of chrome where debug will be done.

/**** Testing ****/
for testing use command
npm run test | yarn test
It will run all file which ending with (*.spec.ts)

For getting coverage report use this command
npm run test:coverage | yarn test:coverage
It will make a coverage report in coverage folder