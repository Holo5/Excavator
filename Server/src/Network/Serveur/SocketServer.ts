import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {Express} from "express";
import {Server} from "http";
import {singleton} from "tsyringe";
import {blue, cyan, green, magenta, yellow} from 'colors';
import {Configuration} from '../../../Config';
import {Outgoing} from '../Outgoing/Outgoing';
import {OutgoingHeader} from '../Outgoing/OutgoingHeader';

@singleton()
export class SocketServer {
  private _app: Express;
  private _server: Server;
  private _socketServer: WebSocket.Server;
  private _client: WebSocket | false;

  init() {
    console.log(cyan("Initing ") + yellow("SockerServer"));

    this._app = express();
    this._server = http.createServer(this._app);
    this._socketServer = new WebSocket.Server({server: this._server});
    this._socketServer.on('connection', (ws: WebSocket) => { this.onConnection(ws) });
    this._client = false;

    this._server.listen(Configuration.serverPort, () => {
      console.log(blue("Server started on port ") + magenta(Configuration.serverPort.toString()));
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

  public send(outgoing: Outgoing<any>) {
    if(this._client !== false) {
      console.log(blue("Socket send => ") + magenta(OutgoingHeader[outgoing.getOutgoingData().header]))
      this._client.send(outgoing.getOutgoingData());
    }
  }
}
