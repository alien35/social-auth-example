'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _passportOauth = require('passport-oauth');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

/**
 * `TwitterTokenStrategy` constructor.
 *
 * The Twitter authentication strategy authenticates requests by delegating to
 * Twitter using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Twitter
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *
 * @param {Object} options
 * @param {Function} verify
 * @example
 * passport.use(new TwitterTokenStrategy({
 *   consumerKey: '123456789',
 *   consumerSecret: 'shhh-its-a-secret'
 * }), function(token, tokenSecret, profile, done) {
 *   User.findOrCreate({twitterId: profile.id}, function(error, user) {
 *     done(error, user);
 *   });
 * });
 */

var TwitterTokenStrategy = (function (_OAuthStrategy) {
  _inherits(TwitterTokenStrategy, _OAuthStrategy);

  function TwitterTokenStrategy(_options, _verify) {
    _classCallCheck(this, TwitterTokenStrategy);

    var options = _options || {};
    var verify = _verify;

    options.requestTokenURL = options.requestTokenURL || 'https://api.twitter.com/oauth/request_token';
    options.accessTokenURL = options.accessTokenURL || 'https://api.twitter.com/oauth/access_token';
    options.userAuthorizationURL = options.userAuthorizationURL || 'https://api.twitter.com/oauth/authenticate';
    options.sessionKey = options.sessionKey || 'oauth:twitter';

    _get(Object.getPrototypeOf(TwitterTokenStrategy.prototype), 'constructor', this).call(this, options, verify);

    this.name = 'twitter-token';
    this._oauthTokenField = options.oauthTokenField || 'oauth_token';
    this._oauthTokenSecretField = options.oauthTokenSecretField || 'oauth_token_secret';
    this._userIdField = options.userIdField || 'user_id';
    this._includeEmail = options.includeEmail !== undefined ? options.includeEmail : false;
    this._userProfileURL = options.userProfileURL || 'https://api.twitter.com/1.1/account/verify_credentials.json';
    this._includeStatus = options.includeStatus !== undefined ? options.includeStatus : true;
    this._includeEntities = options.includeEntities !== undefined ? options.includeEntities : true;
  }

  /**
   * Authenticate request by delegating to Twitter using OAuth.
   * @param {Object} req
   */

  _createClass(TwitterTokenStrategy, [{
    key: 'authenticate',
    value: function authenticate(req, options) {
      var _this = this;

      // Following the link back to the application is interpreted as an authentication failure
      if (req.query && req.query.denied) return this.fail();

      var token = req.body && req.body[this._oauthTokenField] || req.query && req.query[this._oauthTokenField];
      var tokenSecret = req.body && req.body[this._oauthTokenSecretField] || req.query && req.query[this._oauthTokenSecretField];
      var userId = req.body && req.body[this._userIdField] || req.query && req.query[this._userIdField] || token && token.split('-')[0];

      if (!token) return this.fail({ message: 'You should provide ' + this._oauthTokenField + ' and ' + this._oauthTokenSecretField });

      this._loadUserProfile(token, tokenSecret, { user_id: userId }, function (error, profile) {
        if (error) return _this.error(error);

        var verified = function verified(error, user, info) {
          if (error) return _this.error(error);
          if (!user) return _this.fail(info);

          return _this.success(user, info);
        };

        if (_this._passReqToCallback) {
          _this._verify(req, token, tokenSecret, profile, verified);
        } else {
          _this._verify(token, tokenSecret, profile, verified);
        }
      });
    }

    /**
     * Retrieve user profile from Twitter.
     * @param {String} token
     * @param {String} tokenSecret
     * @param {Object} params
     * @param {Function} done
     */
  }, {
    key: 'userProfile',
    value: function userProfile(token, tokenSecret, params, done) {
      var url = _url2['default'].parse(this._userProfileURL);

      url.query = url.query || {};
      if (url.pathname.indexOf('/users/show.json') == url.pathname.length - '/users/show.json'.length) {
        url.query.user_id = params.user_id;
      }
      if (this._includeEmail == true) {
        url.query.include_email = true;
      }
      if (this._includeStatus == false) {
        url.query.skip_status = true;
      }
      if (this._includeEntities == false) {
        url.query.include_entities = false;
      }

      this._oauth.get(_url2['default'].format(url), token, tokenSecret, function (error, body, res) {
        if (error) return done(new _passportOauth.InternalOAuthError('Failed to fetch user profile', error));

        try {
          var json = JSON.parse(body);
          var profile = {
            provider: 'twitter',
            id: json.id_str ? json.id_str : String(json.id),
            username: json.screen_name,
            displayName: json.name,
            name: {
              familyName: '',
              givenName: '',
              middleName: ''
            },
            emails: [{ value: json.email }],
            photos: [{ value: json.profile_image_url_https }],
            _raw: body,
            _json: json
          };

          done(null, profile);
        } catch (e) {
          done(e);
        }
      });
    }
  }]);

  return TwitterTokenStrategy;
})(_passportOauth.OAuthStrategy);

exports['default'] = TwitterTokenStrategy;
module.exports = exports['default'];