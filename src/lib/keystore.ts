import coinstring from 'coinstring'
import { string2Buffer } from './utils'
import THash from './utils/THash'

import * as keygen from './keygen'
import * as secretkey from './secretkey'
import * as symmetric from './symmetric'

/**
 * create CovenantSQL keystore
 * @param  password          master password user typed-in
 * @param  salt              kdf salt
 * @param  addrVersion       address version
 * @param  privateKeyVersion private key encode version
 * @return keystore object
 */
export function createKeystore(
  password: string,
  salt: string,
  addrVersion: number,
  privateKeyVersion: number
): object {
  // generate new key pair
  let prvKey: string = keygen.createPrivateKey()
  let pubKey: string = keygen.privateKeyToPublicKey(prvKey)
  console.log('Print out private key for test',  prvKey)

  // covert to address
  let address: string = keygen.publicKeyToAddress(pubKey, addrVersion)

  // get derived key from password
  let secretKey: string = secretkey.derive(password, salt)

  // prepare iv for symmetric encryption
  let iv: string = symmetric.generateIv()
  let ciphertext: string = symmetric.encrypt(prvKey, secretKey, iv)

  let mac: string = constructMac(secretKey, ciphertext)
  let keystore = marshal(address, salt, mac, ciphertext, iv, privateKeyVersion)

  return keystore
}

/**
 * recover private key from keystore and password
 * @param  password
 * @param  keystore
 * @return private key string in hex
 */
export function recoverFromKeystore(
  password: string,
  salt: string,
  keystore: any
): string {
  // get derived key from password
  let secretKey: string = secretkey.derive(password, salt)

  // prepare iv for symmetric encryption
  let iv: string = keystore.crypto.iv
  let ciphertext: string = keystore.crypto.ciphertext

  // check mac
  let macToVerify: string = constructMac(secretKey, ciphertext)
  if (macToVerify !== keystore.mac) {
    throw new Error('Input password is not valid for the keystore')
  }

  // decrypt private key
  let prvKey: string = symmetric.decrypt(ciphertext, secretKey, iv)

  return prvKey
}

/**
 * construct keystore json
 * @param  address           wallet address
 * @param  salt              kdf salt
 * @param  mac               mac value
 * @param  ciphertext        encrypted text
 * @param  iv                symmetric iv
 * @param  privateKeyVersion version hex
 * @return keystore object
 */
function marshal(
  address: string,
  salt: string,
  mac: string,
  ciphertext: string,
  iv: string,
  privateKeyVersion: number
): object {
  let encrypted: string = constructEncrypted(privateKeyVersion, iv, ciphertext)

  let keystore: object = {
    address,
    encrypted,
    mac,
    crypto: {
      cipher: 'aes-256',
      ciphertext,
      iv
    },
    derivation: {
      kdf: 'sha256x2',
      salt
    },
    version: privateKeyVersion,
  }
  return keystore
}

/**
 * construct Mac for password pre-check
 * secretKey + ciphertext as mac input
 * then THash convert to Mac hex string and return
 * @param  secretKey  derived key hex string
 * @param  ciphertext encrypted hex string
 * @return mac as hex string
 */
function constructMac(
  secretKey: string,
  ciphertext: string
): string {
  let secretKeyBuf: Buffer = string2Buffer(secretKey)
  let ciphertextBuf: Buffer = string2Buffer(ciphertext)

  // concat buffer & THash
  let concated: Buffer = Buffer.concat([secretKeyBuf, ciphertextBuf])
  let hashedMac: Buffer = THash(concated)

  return hashedMac.toString('hex')
}

/**
 * construct base58 encoded string for CovenantSQL chain recover
 * privateKeyVersion(1B) + iv(16B) + ciphertext(48B) as concated hex
 * then base58 encoded the concated and return
 * @param  privateKeyVersion 1 btye version
 * @param  iv                generated iv
 * @param  ciphertext        encrypted ciphertext
 * @return base58Encoded concated
 */
function constructEncrypted(
  privateKeyVersion: number,
  iv: string,
  ciphertext: string
): string {
  let versionBuf: Buffer = Buffer.from([privateKeyVersion])
  let ivBuf: Buffer = string2Buffer(iv)
  let ciphertextBuf: Buffer = string2Buffer(ciphertext)

  // concat buffer & base58 encode
  let concated: Buffer = Buffer.concat([versionBuf, ivBuf, ciphertextBuf])
  let base58Encoded: string = coinstring.encode(concated)

  return base58Encoded
}

/**
 * deconstruct base58 encoded string for CovenantSQL chain recover
 * @param  encrypted base58Encoded concated
 * @return {
 *   privateKeyVersion 1 btye version
 *   iv                generated iv
 *   ciphertext        encrypted ciphertext
 * }
 */
export function deconstructEncrypted(
  encrypted: string
): object {
  let encBuf: Buffer = coinstring.decode(encrypted)

  // 1st byte as privateKeyVersion
  let versionBuf: Buffer = encBuf.slice(0, 1)
  // next 16 bytes as iv
  let ivBuf: Buffer = encBuf.slice(1, 17)
  // next 48 bytes as cipher
  let ciphertextBuf: Buffer = encBuf.slice(17, 65)

  return {
    privateKeyVersion: versionBuf.toString('hex'),
    iv: ivBuf.toString('hex'),
    ciphertext: ciphertextBuf.toString('hex')
  }
}
