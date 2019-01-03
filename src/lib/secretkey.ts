import { string2Buffer } from './utils'
import { sha256x2 } from './utils/sha256'

/**
 * derive secret key from password user typed-in
 * use sha256x2 as key derivation function(kdf)
 * @param  password user's password in utf8
 * @param  salt     default salt in hex
 * @return secretKey string in hex
 */
export function derive(
  password: string,
  salt: string
): string {
  if (typeof password === 'undefined' || password === null) {
    throw new Error('Must provide password and salt to derive a key')
  }

  // convert strings to buffers
  const saltBuf = string2Buffer(salt, 'hex')
  const passwordBuf = string2Buffer(password, 'utf8')

  // use double sha256 as key derivation function
  const concated = Buffer.concat([passwordBuf, saltBuf])
  const secretKey = sha256x2(concated)

  return secretKey.toString('hex')
}

/**
 * verify secret key from password and salt
 * @param  password  old password in utf8
 * @param  salt      default salt in hex
 * @param  secretKey secret key in hex
 * @return boolean of verify success or not
 */
export function verify(
  password: string,
  salt: string,
  secretKey: string
): Boolean {
  const secretKeyBuf = string2Buffer(secretKey, 'hex')

  // convert strings to buffers
  const saltBuf = string2Buffer(salt, 'hex')
  const passwordBuf = string2Buffer(password, 'utf8')

  // prepare secretKeyToVerify
  const concated = Buffer.concat([passwordBuf, saltBuf])
  const secretKeyToVerify = sha256x2(concated)

  return Buffer.compare(secretKeyBuf, secretKeyToVerify) === 0
}
