import secp256k1 from 'secp256k1/elliptic'
import coinstring from 'coinstring'

import { string2Buffer } from './utils'
import THash from './utils/THash'
import crypto from './utils/crypto'

/**
 * create CovenantSQL private key
 * use ECDS(secp256k1) for private key generation
 * @param  keySize=32 default keysize is 32 bytes
 * @return privateKey hex string
 */
export function createPrivateKey(
  keySize = 32
): string {
  // recursively try random bytes until has a valid private key
  let recursiveVerify = (randomBytes: Buffer) => {
    let privateKey: Buffer = randomBytes.slice(0, keySize)
    if (!isPrivateKeyValid(privateKey)) {
      return this.createPrivateKey()
    }
    return privateKey.toString('hex')
  }

  let randomBytes: Buffer = crypto.randomBytes(keySize + keySize)
  return recursiveVerify(randomBytes)
}

/**
 * create public key from private key
 * use secp256k1 public key generation with compress enabled
 * @param  privateKey      private key hex string
 * @param  compressed=true default compress public key
 * @return publicKey hex string
 */
export function privateKeyToPublicKey(
  privateKey: string,
  compressed = true
): string {
  let prvBuf: Buffer = string2Buffer(privateKey)
  // compressed => 33 bytes compressed public key
  // uncompressed => 65 bytes compressed public key
  let pubBuf: Buffer = secp256k1.publicKeyCreate(prvBuf, compressed)

  return pubBuf.toString('hex')
}

/**
 * convert address from public key
 * 1. hash public key by THash
 * 2. base58 encode hasedPubKey to filter out O 0, I i, + /
 * @param  publicKey public key hex string
 * @param  version   version hex string to differ MainNet & TestNet
 * @return address hex string
 */
export function publicKeyToAddress(
  publicKey: string,
  version: number
): string {
  let pubBuf: Buffer = string2Buffer(publicKey)
  // hash public key by THash
  let hasedPubKey: Buffer = THash(pubBuf)
  // base58 encode hasedPubKey to filter out O 0, I i, + /
  let addressBuf: Buffer = coinstring.encode(hasedPubKey, version)

  return addressBuf.toString('hex')
}

/**
 * check private key validity
 * @param  privateKey private key hex string
 * @return boolean of private key validity
 */
function isPrivateKeyValid(
  privateKey: Buffer
): Boolean {
  return secp256k1.privateKeyVerify(privateKey)
}
