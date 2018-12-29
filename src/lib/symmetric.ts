import { toBuf } from './utils'
import crypto from './utils/crypto'
import { sha256x2 } from './utils/sha256'
import { constants } from '../index'

type DerivedKey = {
  secretKey: string,
  salt: string
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

  // convert strings to buffers
  const passwordBuffer = toBuf(password, 'utf8')

  // use double sha256 as key derivation function
  // Note(chenxi): why not use pbkdf2?
  const concated = Buffer.concat([passwordBuffer, salt])
  const secretKey = sha256x2(concated)

  return {
    secretKey: secretKey.toString('hex'),
    salt: salt.toString('hex')
  }
}

export function verifyKey(
  password: string,
  derivedKey: DerivedKey
): Boolean {
  const secretKey = toBuf(derivedKey.secretKey, 'hex')
  const salt = toBuf(derivedKey.salt, 'hex')

  // convert strings to buffers
  const passwordBuffer = toBuf(password, 'utf8')
  const concated = Buffer.concat([passwordBuffer, salt])
  const secretKeyToVerify = sha256x2(concated)

  return Buffer.compare(secretKey, secretKeyToVerify) === 0
}
