module.exports = {
    /*
     *
     */
    handleExit: (options, err, actions) => {
        if (options.cleanup) {
            // const actions = [ server.close, db.destroy ];
            actions.forEach((close, i) => {
                try {
                    close(() => {
                        if (i === actions.length - 1) process.exit();
                    });
                } catch (err) {
                    if (i === actions.length - 1) process.exit();
                }
            });
        }
        if (err) console.log(err.stack);
        if (options.exit) process.exit();
    },

    /**
     * Event listener for HTTP server "error" event.
     */
    onError: (error, port) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        /*
         * Handle specific listen errors with friendly messages
         */
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    },

    /**
     * Event listener for HTTP server "listening" event.
     */
    onListening: (address) => {
        const bind = typeof address === 'string'
            ? 'pipe ' + address
            : 'port ' + address.port;
        console.log('Listening on ' + bind);
    },

    validateServerAndPort: (server, port) => {
        if (!port) {
            throw 'ERROR: Missing port number. \n Please refer to the documentation for proper formatting.'
        }
        if (!server) {
            throw 'ERROR: Missing server. \n Please refer to the documentation for proper formatting.'
        }
    },

    validateServer: (server) => {
        if (!server) {
            throw 'ERROR: Missing server. \n Please refer to the documentation for proper formatting.'
        }
    },

    validatePort: (port) => {
        if (!port) {
            throw 'ERROR: Missing port number. \n Please refer to the documentation for proper formatting.'
        }
    },


};

