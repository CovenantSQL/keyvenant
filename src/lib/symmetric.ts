import { string2Buffer } from './utils'
import crypto from './utils/crypto'

// prv: dffe3ae00a500e5af754d067242fe7cf831da10e3705d3edbc85fe7fbddcf4aa
// sec: d961a5b5a30bb21c87e81ca6886594db63100b254d4fed9cab406d1617a682eb
// iv:  fff9276c5b350b8750159f0abbaf243f

function isCipherAvailable(algo: string): Boolean {
  return crypto.getCiphers().some(cipher => { return cipher === algo })
}

// return 98b2304229051f3bed0ba2107c2094eaa3fa63a304fd4cdfa9b4261c84a509a38bcc25247ca903963d338909804b91b5
export function encrypt(
  plaintext: string,
  key: string,
  iv: string,
  algo = 'aes256'
): string {
  if (!isCipherAvailable(algo)) {
    throw new Error('crypto cipher ' + algo + ' is not available')
  }

  // AES256 cipher
  const cipher = crypto.createCipheriv(algo, string2Buffer(key), string2Buffer(iv))
  // encrypt plaintext buffer
  const firstHalf = cipher.update(string2Buffer(plaintext))
  const lastHalf = cipher.final()
  const encrypted = Buffer.concat([firstHalf, lastHalf])

  return encrypted.toString('hex')
}

export function decrypt(
  encrypted: string,
  key: string,
  iv: string,
  algo = 'aes256'
): string {
  if (!isCipherAvailable(algo)) {
    throw new Error('crypto cipher ' + algo + ' is not available')
  }

  // AES256 decipher
  const decipher = crypto.createDecipheriv(algo, string2Buffer(key), string2Buffer(iv))
  // decrypted plaintext buffer
  const plaintext = decipher.update(string2Buffer(encrypted))

  // return Buffer or string
  return plaintext.toString('hex')
}
