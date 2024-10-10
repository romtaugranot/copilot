const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', ws => {
    clients.push(ws);

    ws.on('message', message => {
        // Broadcast message to all clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

console.log('Server started on port 8080');

let gameState = {
    paddle1Y: 0,
    paddle2Y: 0,
    ballX: 400,
    ballY: 200,
    ballSpeedX: 4,
    ballSpeedY: 4
};

function updateGameState() {
    // Update ball position and handle collisions
    gameState.ballX += gameState.ballSpeedX;
    gameState.ballY += gameState.ballSpeedY;

    // Check for collisions and update game state
    // ... (your collision logic here)

    // Broadcast updated game state to clients
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', state: gameState }));
        }
    });

    setTimeout(updateGameState, 1000 / 60); // 60 FPS
}

// Start the game loop
updateGameState();
