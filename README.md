# RandomChat
Simple chat app that allows 2 random users to chat
Users can also enter commands:
- /delay [time in ms] [msg]: delays the transfer of a msg by a given time
- /hop: pairs current user with another user

Frontend code is in /src
Backend code is in /api

I used a customized create-react-app as the base repo

# Get started
You'll need Node installed.

Install all the things
```
$ npm install
```

Start WebpackDevServer to serve frontend bundle
```
$ npm start
```

Start api server to serve backend bundle
```
$ npm run start:server
```

Tests
```
$ npm run test
```
