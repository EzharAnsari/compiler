/**** Prerequisite ****/
First install (npm or yarn) and node

/**** Run ****/
For run SQL Generator
first download SqlGenerator file from github after that
run some command
npm install | yarn
npm run start

/**** Debug ****/
In VS code on SqlGenerator folder type ( [ctrl] + [shift] + B ) and select the below option
tsc build : SqlGenerator/src/tsconfig.json
after success goto src folder and run this command (in terminal)
node inspect main.js

Now open chrome browser and type chrome://inspect in search bar and enter
after some time (probably 2-3 seconds) in Remote Target there will be one trace available
now click on inspect
It will open new window of chrome where debug will be done.