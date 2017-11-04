const {
    handleExit,
    onError,
    onListening,
    validateServerAndPort,
    validateServer,
    validatePort
} = require('./utils');

module.exports = (server, port) => {

    return {
        /*
         * Delegates errors and error messages to the .onError method
         */
        handleOnError: () => {
            validateServerAndPort(server, port);
            server.on('error', (err) => onError(err, port));
        },

        /*
         * Logs helpful messages
         */
        handleOnListening: () => {
            validateServer(server);
            server.on('listening', () => onListening(server.address()));
        },

        /*
         * Improves graceful server shutdown.
         */
        handleShutDown: (exitActions = [server.close]) => {
            process.on('exit', (options, err) => handleExit({cleanup: true}, err, exitActions));
            process.on('SIGINT', (options, err) => handleExit({exit: true}, err, exitActions));
            process.on('SIGTERM', (options, err) => handleExit({exit: true}, err, exitActions));
            process.on('uncaughtException', (options, err) => handleExit({exit: true}, err, exitActions));
        },

        /*
         * Listen to port
         */
        listen: () => {
            server.listen(port);
        }
    }

};

