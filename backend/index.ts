type Message =
  |  {
      type: "join";
    }
  | {
      type: "message";
      message: string;
    };

const server = Bun.serve<{ username: string }>({
  fetch(req, server) {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    const success = server.upgrade(req, {
      data: {
        username,
      },
    });
    if (success) return;

    return new Response("Could not upgrade to websocket", { status: 400 });
  },
  websocket: {
    async open(ws) {
      ws.subscribe("game");
      server.publish("game", JSON.stringify({ type: "join", username: ws.data.username }));
    },
    async message(ws, message) {
      const clientMessage: Message = JSON.parse(message.toString());
      if (clientMessage.type === "join") {
        console.log(`${ws.data.username} joined`)
        server.publish(
          "game",
          JSON.stringify({
            type: "join",
            username: ws.data.username,
          })
        );
      }
      if (clientMessage.type === "message") {
        const msg = JSON.stringify({
          type: "message",
          message: clientMessage.message,
          username: ws.data.username,
        });
        server.publish("game", msg);
      }
    },
    async close(ws) {
      server.publish(
        "game",
        JSON.stringify({
          type: "leave",
          username: ws.data.username,
        })
      );
      console.log(`${ws.data.username} left`)
    }
  },
  port: 8080,
});

console.log(`Listening on localhost: ${server.port}`);
