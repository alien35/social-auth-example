# express-server-utils

----
## What does it do?

> This library facilitates handling listening, enables graceful shutdown, and creates friendly errors for express servers.

### Quick Start

Several options to get up and running:

* Clone the repo: `git clone https://github.com/alien35/express-server-utils`
* Install with [npm](https://www.npmjs.com/package/express-server-utils): `npm install express-server-utils`
----
## example usage
    const express = require('express');
    const app = express();
    const port = process.env.PORT || '3000';
    app.set('port', port);
    const server = http.createServer(app);

    expressServerUtils = require('express-server-utils')(server, port);
    expressServerUtils.listen();
    expressServerUtils.handleOnError();
    expressServerUtils.handleOnListening();

    const exitActions = [server.close, db.destroy];
    expressServerUtils.handleShutDown(exitActions);


----
# Methods

#### listen `Function`
Configures the server to listen to the port.

#### handleOnError `Function`
Logs a friendly error depending on the error code and sends a process.exit(1) at the end. If error type is unknown, throws the error.

#### handleOnListening `Function`
Logs the port the server is listening to.

#### handleShutDown([Function]) `Function`
Before terminating the server, this function enables general cleanup by running a number of user-given commands. Example commands include

* server.close

* db.destroy

----
## thanks
* [express-server-utils](https://github.com/alien35/express-server-utils)
