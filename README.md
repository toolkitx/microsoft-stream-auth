## microsoft-stream-auth

A **temporary**, **light-weight**, **high-performance** solution to get access token of Microsoft Stream without any browser technologies like Chrome/Selenium.

Why you need this? Accroading to the Office 365 roadmap, Microsoft doesn't provide any public APIs to access the Stream videos event you add API permissions to your app. So with the token get by `microsoft-stream-auth`, you can access the internal API of Stream.

### How it works

The `microsoft-stream-auth` go through the login flow by sending HTTP requests. It means it might not work in the feature.

### Installation

```bash
npm install microsoft-stream-auth
```

### Simple to use

```javascript
const streamAuth = require('microsoft-stream-auth');
const result = await streamAuth({account: 'User Account', pwd: 'User Password'});
```

Then you will get below object:

```json
{
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dC....",
    "apiGatewayUri": "https://aaea-1.api.microsoftstream.com/api/",
    "apiGatewayVersion": "1.3-private",
    "accessTokenExpiry": "2019-12-09T08:19:25.6166735+00:00"
}
```

### How to run test

1. Set your account and password in test/config.js
2. Run below command:
```bash
npm test
```

Enjoy!