import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {Express} from "express";
import {Server} from "http";
import {singleton} from "tsyringe";
import {green} from "colors";

@singleton()
export class SocketServer {
  private _app: Express;
  private _server: Server;
  private _socketServer: WebSocket.Server;
  private _client: WebSocket | false;

  init() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._socketServer = new WebSocket.Server({server: this._server});
    this._socketServer.on('connection', (ws: WebSocket) => { this.onConnection(ws) });

    this._server.listen(6691, () => {
      console.log(green("Server started on port 6691 !"));
    });
  }

  private onConnection(ws: WebSocket) {
    this._client = ws;
    this._client.on('message', (message: string) => { console.log(message) });
    this._client.on('close', () => { this.onClose() });
  }

  private onMessage(message: string) {
    console.log("Message", message);
  }

  private onClose() {
    if(this._client !== false) {
      this._client = false;
    }
  }

  public send() {
    if(this._client !== false) {

    }
  }
}
