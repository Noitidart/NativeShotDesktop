import Base from './comm'
import uuid from 'uuid/v4'
import { ipcRenderer } from 'electron'

export const CONNECT_REQUEST = 'CONNECT_REQUEST';
export const DISCONNECT_REQUEST = 'DISCONNECT_REQUEST';
export const SPLITTER = '~~';
export const HANDSHAKE = '__HANDSHAKE__';

export class Client extends Base {
    // use in any non-background.js
    // base config
    commname = 'Electron.Client' // suffix added in constructor
    cantransfer = false
    // target = undefined // set in constructor
    unregister() {
        super.unregister();
        ipcRenderer.removeListener(this.target, this.controller);
    }
    doSendMessageMethod(aTransfers, payload) { // this defines what `aClientId` should be in crossfile-link183848 - so this defines what "...restargs" should be "a channel OR a channel id"
        // aClientId is aChannelOrChannelId
        // webext channels does not support transfering
        console.log('doing send from renderer, this.target:', this.target, 'payload:', payload); // this.channels[channel].send
        ipcRenderer.send(this.target, payload);
    }
    getControllerPayload(e, payload) {
        return payload;
    }
    constructor(aMethods, aChannelGroupName='general', onHandshake=null) {
        // aChannelGroupName is so server can broadcast a message to certain group

        const channelId = uuid();
        const channel = aChannelGroupName + SPLITTER + channelId;
        super(channel, aMethods, onHandshake); // sets this.target = channel

        this.commname += channelId;
        this.groupname = aChannelGroupName;

        ipcRenderer.on(channel, this.controller);
        ipcRenderer.send(CONNECT_REQUEST, channel); // not a regular sendMessage // this.sendMessage(CONNECT_REQUEST, channel);
    }
    // custom config - specific to this class
    // groupname = null // set in constructor
    getChannel() {
        return this.target;
    }
    // disconnector = aChannel => {
    //     console.log(`Comm.${this.commname} - incoming disconnect request, aChannel:`, aChannel);
    //     this.target.onDisconnect.removeListener(this.disconnector);
    //     if(!this.isunregistered) this.unregister(); // if .disconnector triggered by this.unregister being called first, this second call here on this line will fail as in base unregister can only be called once otherwise it throws
    // }
}