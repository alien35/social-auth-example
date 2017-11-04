# passport-twitter-token

[![Build Status](https://travis-ci.org/drudge/passport-twitter-token.svg)](https://travis-ci.org/drudge/passport-twitter-token)
[![Coverage Status](https://coveralls.io/repos/drudge/passport-twitter-token/badge.svg?branch=master&service=github)](https://coveralls.io/github/drudge/passport-twitter-token?branch=master)
![Downloads](https://img.shields.io/npm/dm/passport-twitter-token.svg)
![Downloads](https://img.shields.io/npm/dt/passport-twitter-token.svg)
![npm version](https://img.shields.io/npm/v/passport-twitter-token.svg)
![dependencies](https://img.shields.io/david/drudge/passport-twitter-token.svg)
![dev dependencies](https://img.shields.io/david/dev/drudge/passport-twitter-token.svg)
![License](https://img.shields.io/npm/l/passport-twitter-token.svg)

[Passport](http://passportjs.org/) strategy for authenticating with [Twitter](http://twitter.com/) tokens using the OAuth 1.0a API.

This module lets you authenticate using Twitter in your Node.js applications.
By plugging into Passport, Twitter authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

### Installation

#### Using npm

    $ npm install passport-twitter-token

#### Using yarn

    $ yarn add passport-twitter-token

## Usage

### Configure Strategy

The Twitter authentication strategy authenticates users using a Twitter account and OAuth tokens.
The strategy requires a `verify` callback, which receives the access token and corresponding secret as arguments, as well as `profile` which contains the authenticated user's Twitter profile.
The `verify` callback must call `done` providing a user to complete authentication.

In order to identify your application to Twitter, specify the consumer key, consumer secret, and callback URL within `options`.
The consumer key and secret are obtained by [creating an application](https://dev.twitter.com/apps) at Twitter's [developer](https://dev.twitter.com/) site.

Optional fields:
 - `includeEmail` - Boolean 
 - `includeStatus` - Boolean
 - `includeEntities` - Boolean
 - `userProfileURL` - Default `https://api.twitter.com/1.1/account/verify_credentials.json`
 
```javascript
var TwitterTokenStrategy = require('passport-twitter-token');

passport.use(new TwitterTokenStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET
  }, function(token, tokenSecret, profile, done) {
    User.findOrCreate({ twitterId: profile.id }, function (error, user) {
      return done(error, user);
    });
  }
));
```

### Authenticate Requests

Use `passport.authenticate()`, specifying the `'twitter-token'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.post('/auth/twitter/token',
  passport.authenticate('twitter-token'),
  function (req, res) {
    // do something with req.user
    res.send(req.user ? 200 : 401);
  }
);
```

Or as action in Sails framework:

```javascript
// api/controllers/AuthController.js
module.exports = {
  twitter: function(req, res) {
    passport.authenticate('twitter-token', function(error, user, info) {
      // do your stuff with user
    })(req, res);
  }
};
```

Execute a request (GET or POST) to created route with the following data:

```
GET /auth/twitter/token?oauth_token=<TOKEN>&oauth_token_secret=<TOKEN_SECRET>&user_id=<USER_ID>
```

### Performing Twitter Reverse Auth Step 1 Server-Side

To remove the need to embed the consumer secret in your client application, you can setup a route to perform step 1 on the server-side.

For example, as route in an [Express](http://expressjs.com/) application using the [request](https://github.com/mikeal/request) module:

```javascript
var request = require('request');

app.post('/auth/twitter/reverse', function(req, res) {
  var self = this;

  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      consumer_key: app.set('twitter client key'),
      consumer_secret: app.set('twitter client secret')
    },
    form: { x_auth_mode: 'reverse_auth' }
  }, function (err, r, body) {
    if (err) {
      return res.send(500, { message: e.message });
    }

    if (body.indexOf('OAuth') !== 0) {
      return res.send(500, { message: 'Malformed response from Twitter' });
    }

    res.send({ x_reverse_auth_parameters: body });
  });
};
```

## Credits

  - [Nicholas Penree](http://github.com/drudge)
  - [Jared Hanson](http://github.com/jaredhanson)
  - [Eugene Obrezkov](http://github.com/ghaiklor)

## License

The MIT License (MIT)

Copyright (c) 2012-2015 Nicholas Penree

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
