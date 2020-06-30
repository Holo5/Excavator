import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';
import { Server } from 'http';
import * as WebSocket from 'ws';
import { singleton } from 'tsyringe';
import { magenta, yellow } from 'colors';
import { Configuration } from '../../../Config';
import { Outgoing } from '../Outgoing/Outgoing';
import { OutgoingHeader } from '../Outgoing/OutgoingHeader';
import { FigureMapListComposer } from '../Outgoing/Figure/FigureMap/FigureMapListComposer';
import { Logger } from '../../App/Logger/Logger';

@singleton()
export class SocketServer {
    private _app: Express;
    private _server: Server;
    private _socketServer: WebSocket.Server;
    private _client: WebSocket | undefined;

    init() {
        Logger.info(`Initializing ${yellow(this.constructor.name)}`);

        this._app = express();
        this._server = http.createServer(this._app);
        this._socketServer = new WebSocket.Server({ server: this._server });
        this._socketServer.on('connection', (ws: WebSocket) => this.onConnection(ws));
        this._client = undefined;

        this._server.listen(Configuration.serverPort, () => {
            Logger.info(`Server started on port ${magenta(Configuration.serverPort.toString())}`);
        });
    }

    private onConnection(ws: WebSocket) {
        this._client = ws;

        this._client.on('message', (message: string) => this.onMessage(message));
        this._client.on('close', () => this.onClose());

        this.send(new FigureMapListComposer());
    }

    private onMessage(message: string) {
        console.log('Message', message);
    }

    private onClose() {
        if (this._client !== undefined) {
            this._client = undefined;
        }
    }

    public send(outgoing: Outgoing<unknown>) {
        if (this._client === undefined) {
            return;
        }

        const data = outgoing.evaluate();
        const message = JSON.stringify(data);

        this._client.send(message);

        Logger.info(`Socket sent ${magenta(OutgoingHeader[data.header])}`);
    }
}
