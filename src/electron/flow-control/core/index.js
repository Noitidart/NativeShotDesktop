// @flow
import os from  'os'

export type Shape = {
    self: {
        platform: 'win32' | string, // TODO: other strings?
        id: string,
        version: string,
        locales: string[] // TODO: get enum
    }
}

const INITIAL = {
	self: {
        platform: os.platform(),
		id: '~ADDON_ID~',
		version: '~ADDON_VERSION~',
        locales: ['en-us']
        // // startup: string; enum[STARTUP, UPGRADE, DOWNGRADE, INSTALL] - startup_reason
	}
};

const A = ([actionType]: string[]) => 'CORE_' + actionType; // Action type prefixer

//
type Action = {};

export default function reducer(state: Shape = INITIAL, action:Action) {
    switch(action.type) {
        default: return state;
    }
}