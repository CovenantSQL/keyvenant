import { string2Buffer } from './utils'
import crypto from './utils/crypto'

/**
 * symmetric encryption
 * @param  plaintext     input text to be encrypted
 * @param  key           serectKey string in hex (16 btyes)
 * @param  iv            iv string in hex (16 btyes because of AES 128bit blocksize)
 * @param  algo='aes256' symmetric encryption algo, defualt is AES256
 * @return encrypted ciphertext in hex (48 btyes)
 */
export function encrypt(
  plaintext: string,
  key: string,
  iv: string,
  algo = 'aes256'
): string {
  if (!isCipherAvailable(algo)) {
    throw new Error('crypto cipher ' + algo + ' is not available')
  }
  // cipher, default as AES256
  const cipher = crypto.createCipheriv(algo, string2Buffer(key), string2Buffer(iv))

  // encrypt plaintext buffer
  const firstHalf = cipher.update(string2Buffer(plaintext))
  const lastHalf = cipher.final()
  const encrypted = Buffer.concat([firstHalf, lastHalf])

  return encrypted.toString('hex')
}

/**
 * symmetric decryption
 * @param  encrypted     encrypted ciphertext in hex (48 btyes)
 * @param  key           serectKey string in hex (16 btyes)
 * @param  iv            iv string in hex (16 btyes because of AES 128bit blocksize)
 * @param  algo='aes256' symmetric encryption algo, defualt is AES256
 * @return decrypted text in hex
 */
export function decrypt(
  encrypted: string, // 48 bytes
  key: string, // derivedKey 16 bytes
  iv: string, // 16 btyes
  algo = 'aes256'
): string {
  if (!isCipherAvailable(algo)) {
    throw new Error('crypto cipher ' + algo + ' is not available')
  }

  // decipher
  const decipher = crypto.createDecipheriv(algo, string2Buffer(key), string2Buffer(iv))
  // decrypted plaintext buffer
  const plaintext = decipher.update(string2Buffer(encrypted))

  // return Buffer or string
  return plaintext.toString('hex')
}

/**
 * randomly generate iv
 * @param  length default length is 16 btyes because of AES 128bit blocksize
 * @return iv in hex
 */
export function generateIv(
  length = 16
): string {
  let iv: Buffer = crypto.randomBytes(length)

  return iv.toString('hex')
}

/**
 * check cipher availablility
 * @param  algo [description]
 * @return boolean of cipher availablility
 */
function isCipherAvailable(
  algo: string
): Boolean {
  return crypto.getCiphers().some(cipher => { return cipher === algo })
}
