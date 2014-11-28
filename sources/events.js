module.exports = function(io) {

    io.on('connect', function(socket) {
        console.log('User connected');
        socket.on('disconnect', function() {
           console.log('User disconnected');
        });
    });

};