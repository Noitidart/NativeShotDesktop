import Base from './comm'
import { ipcMain } from 'electron'

import { CONNECT_REQUEST, DISCONNECT_REQUEST, SPLITTER, HANDSHAKE } from './electron-client' // eslint-disable-line no-unused-vars

/*
RULES
* Handshake is multi triggered
* Handshake triggers every time a channel connects. It first triggers server side, then triggers client side.
* Server onHandshake arguments - (channel) so can do in onHandshake, callIn(channel, ...)
* Client onHandshake arguments - nothing
* Earliest time can do callIn
  * Server - after channel connection is made, so onHandshake
  * Client - soon after new Client() - this will trigger before onHandshake obviously
* Can do new ChannelsServer right away in background.js
* Can do new ChannelsClient right away in client
* ChannelsServer should only be done from backgrond.js - i didnt think of the implications of not doing it in background.js
* Individually disconnecting channels
  * Server side - DO NOT do gChannelsComm.channels[blah].disconnect() - it will not trigger the disconnector. So i currently only support disconnecting all channels with gChannelsComm.unregister()
  * Client side - DO NOT do gBgComm.target.disconnect(), instead to gBgComm.unregister() - because the disconnector on client side needs to trigger, same situation on other end - but client side disconnector doesnt really do anything important
* Microsoft Edge - when tab is closed, it is not triggering disconnector! weird howevering doing gBgComm.target.disconnect() from tab is working!
*/

export class Server extends Base {
    // use from backgrond.js
    // base config
    commname = 'Electron.Server'
    cantransfer = false
    multiclient = true
    doSendMessageMethod(aTransfers, payload, channel) { // this defines what `aClientId` should be in crossfile-link183848 - so this defines what "...restargs" should be "a channel OR a channel id"
        // aClientId is aChannelOrChannelId
        // webext channels does not support transfering
        // console.log('doing send on channel:', channel, 'payload:', payload); // this.channels[channel].send
        if (!this.channels[channel]) { // this is custom block, where channel can be webContents. because for me to send message to BrowserWindow I am doing `callInChannel(window.webContents, ...)`
            // console.log('channel was not a channel! maybe it was a "webContents" lets test, channel:', channel);
            channel = this.getChannelFromWebContent(channel);
        }
        this.channels[channel].send(channel, payload);
    }
    getControllerPayload(e, payload) {
        return payload;
    }
    getControllerSendMessageArgs(val, payload, e) { // , ...args
        const { cbid } = payload;
        // console.log('getControllerSendMessageArgs ::', 'val:', val, 'payload:', payload, 'e:', e, 'args:', args);
        const channel = this.getChannelFromWebContent(e.sender);
        return [ channel, cbid, val ];
    }
    getControllerReportProgress(payload, e/*, payload*/) {
        // console.log('getControllerReportProgress ::', 'payload:', payload, 'args:', args);
        const { cbid } = payload;
        const channel = this.getChannelFromWebContent(e.sender);
        return this.reportProgress.bind({ THIS:this, cbid, channel });
    }
    reportProgress(aProgressArg) {
        const { THIS, cbid, channel } = this;
        aProgressArg.__PROGRESS = 1;
        THIS.sendMessage(channel, cbid, aProgressArg);
    }
    unregister() {
        super.unregister();

        extension.runtime.onConnect.removeListener(this.connector);

        for (const channel of Object.keys(this.channels)) {
            this.disconnector({}, channel);
        }
    }
    constructor(aMethods, onHandshake) {
        super(null, aMethods, onHandshake);

        if (onHandshake) this.onHandshake = onHandshake // because can fire multiple times i override what the super does

        ipcMain.on(CONNECT_REQUEST, this.connector);
    }
    // custom config - specific to this class
    channels = {} // key is channel, value is webContent
    broadcastMessage(groupName, method, arg, callback) {
        // callback triggers for each channel
        for (const channel of Object.keys(this.channels)) {
            if (channel.startsWith(groupName + SPLITTER)) {
                this.sendMessage(channel, method, arg, callback);
            }
        }
    }
    getChannelFromWebContent(webContent) {
        const entry = Object.entries(this.channels).find( ([, aWebContent]) => aWebContent === webContent);
        if (!entry) {
            console.error(`could not find channel for e.sender! this should never happen`);
            throw new Error(`could not find channel for e.sender! this should never happen`);
        }
        const [ channel ] = entry;
        return channel;
    }
    getChannel(channel) {
        return this.channels[channel];
    }
    getChannelId(channel) {
        if (channel in this.channels) return channel;
        else throw new Error(`Channel by name of "${channel}" not found!`);
    }
    connector = (e, channel) => {
        // console.log(`Comm.${this.commname} - incoming connect request, channel:`, channel);
        this.channels[channel] = e.sender;
        ipcMain.on(channel, this.controller);
        this.sendMessage(channel, HANDSHAKE); // do this before triggering onHandshake on serverside, because in server side handshake their might be some callInChannel(channel, ...) and we wand handshake to trigger on client side before these callInChannel calls
        if (this.onHandshake) this.onHandshake(channel);
    }
    disconnector = (e, channel) => {
        console.log(`Comm.${this.commname} - incoming disconnect request, static channel:`, channel, 'e:', e);
        ipcMain.removeListener(channel, this.controller);
        delete this.channels[channel];
        for (const handler of this.onDisconnect.handlers) handler(channel, this);
    }
    onDisconnect = { // onChannelDisconnect
        handlers: [],
        addListener: function(handler) {
            // returns true if added, else false if already there
            if (!this.handlers.includes(handler)) {
                this.handlers.push(handler);
                return true;
            }
            return false;
        },
        removeListener: function(handler) {
            // returns true if removed, else false if it was never there
            let ix = this.handlers.indexOf(handler);
            if (ix > -1) {
                this.handlers.splice(ix, 1);
                return true;
            }
            return false;
        }
    }
}