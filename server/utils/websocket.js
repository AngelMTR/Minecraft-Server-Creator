const fastify = require("fastify")();
const fastifyWebsocket = require("@fastify/websocket");

fastify.register(fastifyWebsocket);

fastify.get("/ws", { websocket: true }, (connection, req) => {
    connection.socket.on("message", (message) => {
        console.log("Received:", message.toString());
        connection.socket.send("Message received!");
    });
});

fastify.listen({ port: 3000 }, () => {
    console.log("WebSocket Server is running on ws://localhost:3000");
});