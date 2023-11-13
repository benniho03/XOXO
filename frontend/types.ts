type Message = {
    type: "message",
    username: string,
    message: string,
  } | {
    type: "join",
    username: string,
  } | {
    type: "leave",
    username: string,
  }