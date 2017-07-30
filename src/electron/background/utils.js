// @flow

import path from 'path'
import url from 'url'

const ROOT_PATH = path.dirname(__dirname);

export function getFilePath(...strs) {
    return path.join(ROOT_PATH, ...strs);
}

export function getFileUrl(...strs) {
    return url.format({
        pathname: path.join(ROOT_PATH, ...strs),
        protocol: 'file:',
        slashes: true
    });
}