import { string2Buffer } from './utils'
import crypto from './utils/crypto'
import { sha256x2 } from './utils/sha256'
import { constants } from '../index'

type DerivedKey = {
  secretKey: string, // 256 bits key for AES256 symmetric encription
  salt: string, // 256 + 128 bits salt for kdf
  iv: string // 128 bits iv as AES block size
}

/**
 * Derived secret key from key derivation function(kdf)
 * @param  password [description]
 * @param  options  [description]
 * @return          [description]
 */
export function deriveKey(
  password: string,
  // options?: object
): DerivedKey {
  if (typeof password === 'undefined' || password === null) {
    throw new Error('Must provide password and salt to derive a key')
  }

  // prepare salt & iv
  const salt = crypto.randomBytes(constants.secretKey.saltLength)
  const iv = crypto.randomBytes(constants.secretKey.ivLength)

  // convert strings to buffers
  const passwordBuffer = string2Buffer(password, 'utf8')

  // use double sha256 as key derivation function
  // Note(chenxi): why not use pbkdf2?
  const concated = Buffer.concat([passwordBuffer, salt])
  const secretKey = sha256x2(concated)

  return {
    secretKey: secretKey.toString('hex'),
    salt: salt.toString('hex'),
    iv: iv.toString('hex')
  }
}

export function verifyKey(
  password: string,
  derivedKey: DerivedKey
): Boolean {
  const secretKey = string2Buffer(derivedKey.secretKey, 'hex')
  const salt = string2Buffer(derivedKey.salt, 'hex')

  // convert strings to buffers
  const passwordBuffer = string2Buffer(password, 'utf8')
  const concated = Buffer.concat([passwordBuffer, salt])
  const secretKeyToVerify = sha256x2(concated)

  return Buffer.compare(secretKey, secretKeyToVerify) === 0
}
