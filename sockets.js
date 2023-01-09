let readyPlayerCount = 0;

function listen(io) {
	const pongNameSpace = io.of('/pong');
	pongNameSpace.on('connection', (socket) => {
		console.log('A user connected... ', socket.id);
		let room;
		socket.on('ready', () => {
			room = 'room' + Math.floor(readyPlayerCount / 2);
			socket.join(room);
			console.log('Player is ready... ', socket.id);
			readyPlayerCount++;

			if (readyPlayerCount % 2 === 0) {
				pongNameSpace.in(room).emit('startGame', socket.id);
			}
		});

		socket.on('paddleMove', (paddleData) => {
			socket.to(room).emit('paddleMove', paddleData);
		});

		socket.on('paddleMove', (ballData) => {
			socket.to(room).emit('paddleMove', ballData);
		});

		socket.on('disconnect', (reason) => {
			console.log(`Client ${socket.id} disconnected due to: ${reason}`);
			socket.leave(room);
		});
	});
}

module.exports = {
	listen
};
