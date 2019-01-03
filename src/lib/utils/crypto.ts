// Env boolean to support both node and web
import { isBrowser } from './'

const crypto = isBrowser ? require('crypto-browserify') : require('crypto')
export default crypto
