// @flow

import path from 'path'
import url from 'url'

export function getFilePath(...strs) {
    return path.join(__dirname, ...strs);
}

export function getFileUrl(...strs) {
    return url.format({
        pathname: path.join(__dirname, ...strs),
        protocol: 'file:',
        slashes: true
    });
}