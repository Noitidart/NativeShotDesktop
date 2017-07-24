import React, { Component } from 'react'
import { render } from 'react-dom'

import shallowEqual from 'recompose/shallowEqual'
import { isObject } from 'cmn/all'

import './theme-a.default.css'
import './index.css'

console.error('ENTER');

class App extends Component {
    state = {
        theme: undefined
    }
    useThemeB = () => this.setState(()=>({theme:'./theme-b'}));
    useThemeDefault = () => this.setState(()=>({theme:undefined}));
    render() {
        let { theme } = this.state;
        let arr = [<span>1</span>, <span>2</span>, <span>3</span>];
        return (
            <div>
                {theme && <link href={theme+'.css'} rel="stylesheet" /> }
                {arr}
                <button onClick={this.useThemeB}>Use Theme B</button>
                <button onClick={this.useThemeDefault}>Use Theme Defeault</button>
            </div>
        );
    }
}

export function deepEqual(arrobj1, arrobj2, maxDepth=0) {
    const els1 = [arrobj1];
    const els2 = [arrobj2];

    const nextEls1 = [];
    const nextEls2 = [];

    let depth = 0;
    while (els1.length) {
        if (els1.length !== els2.length) return false;

        const el1 = els1.shift();
        const el2 = els2.shift();

        console.log('will now compare el1:', el1, 'el2:', el2);

        if (depth === maxDepth) {
            if (!shallowEqual(el1, el2)) {
                console.log('depth has reached max depth, and shallowEqual is false', 'el1:', el1, 'el2:', el2);
                return false;
            }
        } else {
            if (Array.isArray(el1) && Array.isArray(el2)) {
                if (!shallowify(el1, el2, nextEls1, nextEls2)) {
                    console.log('shallowify arr reutnred false');
                    return false;
                }
            } else if (isObject(el1) && isObject(el2)) {
                const kels1 = flattenDepth1(Object.entries(el1).sort(sortEntriesByKey));
                const kels2 = flattenDepth1(Object.entries(el2).sort(sortEntriesByKey));
                console.log('kels1:', kels1, 'kels2:', kels2);
                if (!shallowify(kels1, kels2, nextEls1, nextEls2)) {
                    console.log('shallowify obj reutnred false');
                    return false;
                }
            } else {
                if (!shallowEqual(el1, el2)) {
                    console.log('el1 !== el2', el1, el2);
                    return false;
                }
            }
        }

        if (!els1.length || !els2.length) {
            if (depth === maxDepth) {
                console.log('return true as max depth done');
                return true;
            } else {
                depth++;
                console.log('increasing depth, pushing in', 'nextEls1:', nextEls1, 'nextEls2:', nextEls2);
                els1.push(...nextEls1);
                els2.push(...nextEls2);
                nextEls1.length = 0;
                nextEls2.length = 0;
            }
        }
    }

    console.log('out of while so return');
    return true;
}

function shallowify(arr1, arr2, next1, next2) {
    // shallow compares non-array, non-obj elements, and pushes the array/obj elements ot the next depth
    if (arr1.length !== arr2.length) return false;
    const l = arr1.length;
    for (let i=0; i<l; i++) {
        const subel1 = arr1[i];
        const subel2 = arr2[i];
        if (Array.isArray(subel1) && Array.isArray(subel2)) {
            next1.push(subel1);
            next2.push(subel2);
        } else if (isObject(subel1) && isObject(subel2)) {
            next1.push(subel1);
            next2.push(subel2);
        } else {
            console.log('comparing', 'subel1:', subel1, 'subel2:', subel2);
            if (!shallowEqual(subel1, subel2)) return false;
            console.log('ok same');
        }
    }
    return true;
}

function sortEntriesByKey([a], [b]) {
    return a.localeCompare(b);
}

// https://gist.github.com/Integralist/749153aa53fea7168e7e#gistcomment-1997822
function flattenDepth1(arr) {
    // flattens 1 level deep, like a Object.entries
    return Array.prototype.concat(...arr);
}

window.shallowEqual = shallowEqual;
window.deepEqual = deepEqual;

render(<App/>, document.getElementById('root'))
