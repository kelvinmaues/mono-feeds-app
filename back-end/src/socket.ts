import socketio from "socket.io";
import HttpException from "./common/http-exception";
let io: socketio.Server;

export default {
  init: (httpServer: Express.Application) => {
    io = socketio(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new HttpException(500, "Socket.io not initialized!");
    }
    return io;
  },
};
