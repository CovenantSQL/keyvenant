import secp256k1 from 'secp256k1/elliptic'

// Env boolean to support both node and web
const isBrowser = typeof process === 'undefined' || !process.nextTick
const crypto = isBrowser ? require('crypto-browserify') : require('crypto')

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

// function publicKeyHash(publicKey: Buffer): Buffer {
// }
// export function publicKeyToAddress(publicKey: Buffer): Buffer {
// }
