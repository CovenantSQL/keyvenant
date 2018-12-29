import secp256k1 from 'secp256k1/elliptic'
import coinstring from 'coinstring'
import { constants } from '../index'
import THash from './utils/THash'
import crypto from './utils/crypto'

export function verifyPrivateKey(privateKey: Buffer): Boolean {
  return secp256k1.privateKeyVerify(privateKey)
}

export function createPrivateKey(keySize = 32): Buffer {
  const recursiveVerify = (randomBytes: Buffer) => {
    const privateKey = randomBytes.slice(0, keySize)
    if (!verifyPrivateKey(privateKey)) {
      return this.create()
    }
    return privateKey
  }

  const randomBytes = crypto.randomBytes(keySize + keySize)
  return recursiveVerify(randomBytes)
}

export function privateKeyToPublicKey(privateKey: Buffer, compressed = true): Buffer {
  // compressed => 33 bytes compressed public key
  // uncompressed => 65 bytes compressed public key
  return secp256k1.publicKeyCreate(privateKey, compressed)
}

export function publicKeyToAddress(publicKey: Buffer): string {
  // THash to get publicKey hash
  const publicKeyHash = THash(publicKey)
  const version = constants.addressVersion.testNet
  return coinstring.encode(publicKeyHash, version)
}
