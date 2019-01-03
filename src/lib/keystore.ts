import coinstring from 'coinstring'
import { string2Buffer } from './utils'

import * as keygen from './keygen'
import * as secretkey from './secretkey'
import * as symmetric from './symmetric'

export function createKeystore(
  password: string,
  salt: string,
  addrVersion: number,
  privateKeyVersion: number
) {
  // generate new key pair
  let prvKey: string = keygen.createPrivateKey()
  let pubKey: string = keygen.privateKeyToPublicKey(prvKey)

  // covert to address
  let address: string = keygen.publicKeyToAddress(pubKey, addrVersion)
  console.log('keygen', prvKey, pubKey, address)

  // get derived key from masterPassword
  let secretKey = secretkey.derive(password, salt)
  console.log('derivedKey', secretKey)
  console.log('verify', secretkey.verify(password, salt, secretKey))

  // prepare iv for symmetric encryption
  let iv: string = symmetric.generateIv()
  console.log('iv', iv)
  let ciphertext: string = symmetric.encrypt(prvKey, secretKey, iv)
  console.log('ciphertext', ciphertext)
  console.log('decrypted', symmetric.decrypt(ciphertext, secretKey, iv))

  let keystore = marshal(address, salt, ciphertext, iv, privateKeyVersion)
  console.log(keystore)
}

function marshal(
  address: string,
  salt: string,
  ciphertext: string,
  iv: string,
  privateKeyVersion: number
): object {
  let encrypted: string = constructEncrypted(privateKeyVersion, iv, ciphertext)

  let keystore: object = {
    address,
    encrypted,
    mac: '',
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

  // concat and base58 encode
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
