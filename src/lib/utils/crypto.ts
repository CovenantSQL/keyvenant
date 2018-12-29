// Env boolean to support both node and web
const isBrowser = typeof process === 'undefined' || !process.nextTick
const crypto = isBrowser ? require('crypto-browserify') : require('crypto')

export default crypto
