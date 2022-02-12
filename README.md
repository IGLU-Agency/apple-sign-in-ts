#  Sign in with Apple for Node.js

An easy-to-use Node.js library for Signing in with Apple!

⚠️ Important note: Apple will only provide you with the name and email _ONCE_ which is when the user taps "Sign in with Apple" on your app the first time. Keep in mind that you have to store this in your database at this time! For every login after that, Apple will provide you with a unique ID that you can use to lookup the username in your database.

## Setup

Begin by installing the library:
`npm install apple-sign-in-ts`

## Usage

Initialize it using the following code:

```
import * as fs from "fs"
import AppleSignIn from "apple-sign-in-ts"

const config = fs.readFileSync("./config/config");
const auth = new AppleSignIn(config, './config/AuthKey.p8');
```

Methods:

- `auth.accessToken(grantCode)` - Gets the access token from the grant code received
- `auth.refreshToken(refreshToken)` - Gets the access token from a refresh token

#### ⚠️ Disclaimer

This repository is NOT developed, endorsed by Apple Inc. or even related at all to Apple Inc. The library is a helper library for anyone trying to implement Apple's Sign in with Apple.
