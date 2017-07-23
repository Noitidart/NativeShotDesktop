const initial = {
	self: {
		id: '~ADDON_ID~',
		version: '~ADDON_VERSION~',
        locales: ['en-us']
        // // startup: string; enum[STARTUP, UPGRADE, DOWNGRADE, INSTALL] - startup_reason
	}
}

export default function core(state=initial, action) {
    let type;
    ({type, ...action} = action);
    switch(type) {
        default: return state;
    }
}