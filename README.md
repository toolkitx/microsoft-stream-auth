# @toolkitx/microsoft-stream-auth

![CIStatus](https://github.com/toolkitx/microsoft-stream-auth/workflows/Daily/badge.svg) [![npm version](https://badge.fury.io/js/%40toolkitx%2Fmicrosoft-stream-auth.svg)](https://badge.fury.io/js/%40toolkitx%2Fmicrosoft-stream-auth)

A **temporary**, **light-weight**, **high-performance** solution to get a Microsoft Stream access token without any browser technologies like Chrome/Selenium.

## Why would you need this?

According to the ![Office 365 Roadmap](https://www.microsoft.com/en-us/microsoft-365/roadmap?ms.url=roadmap&rtc=1&filters=), Microsoft doesn't provide any public APIs to access the Stream videos even if you add API permissions to your app. So with the token gathered by `microsoft-stream-auth`, you can access the internal API of Stream like uploading videos, downloading videos, etc.

![Demo](demo.gif)

## How it works

The `microsoft-stream-auth` goes through the login process by sending HTTP requests to `login.microsoftonline.com`

> :warning: **WARNING: By using HTTP Requests, this does not guarantee that this tool will work in the future. If this tool is currently broken please submit an issue.**


## Installation

### Option 1 (Install the Package)

```bash
npm install @toolkitx/microsoft-stream-auth
```

Create a `config.js` file in the same directory as the installed package with the following code

```javascript
module.exports = {
    account: '<insert account email here>',
    pwd: '<insert account password here>'
}
```

Then, create an `index.js` file also in the same directory with the following code

```javascript
const cred = require('./config');
const login = require('@toolkitx/microsoft-stream-auth');

(async () => {
    const token = await login(cred);
    console.log(token);
})();
```

Finally, run the code with

```bash
node index.js
```

### Option 2 (Clone the Repo)

```bash
git clone https://github.com/toolkitx/microsoft-stream-auth.git
cd microsoft-stream-auth
npm install
```

Add your account email and password to `test/config.js`, then run the following command

```bash
npm run test
```


In both installation cases you should get an object similar to the following if successful

```json
{
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dC....",
    "apiGatewayUri": "https://aaea-1.api.microsoftstream.com/api/",
    "apiGatewayVersion": "1.3-private",
    "accessTokenExpiry": "2019-12-09T08:19:25.6166735+00:00"
}
```


### Enjoy!
