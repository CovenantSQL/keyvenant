/**
 * Copyright 2018 The CovenantSQL Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  // createPrivateKey,
  privateKeyToPublicKey,
  // verifyPrivateKey,
  publicKeyToAddress
} from './lib/keygen'
import { deriveKey, verifyKey } from './lib/secretkey'
import { encrypt, decrypt } from './lib/symmetric'

export * from './lib/keygen'

export const constants = {
  addressVersion: {
    mainNet: 0x0,
    testNet: 0x6f,
  },
  secretKey: {
    // IV length must equal AES block size, which is 128 bits, 16 bytes
    ivLength: 16,
    privateKeyLength: 32,
    get saltLength():number { return this.privateKeyLength + this.ivLength }
  }
}

// local testing
// const prv = createPrivateKey().toString('hex')
const prv = 'dffe3ae00a500e5af754d067242fe7cf831da10e3705d3edbc85fe7fbddcf4aa'
const pub = privateKeyToPublicKey(Buffer.from(prv, 'hex')).toString('hex')
const address = publicKeyToAddress(Buffer.from(pub, 'hex'))

const derivedKey = deriveKey('password')
console.log(derivedKey)
// { secretKey: '', salt: '', iv: '' }
console.log('verifyKey: ', verifyKey('password', derivedKey))

// aes256 test
// const sec = 'd961a5b5a30bb21c87e81ca6886594db63100b254d4fed9cab406d1617a682eb'
const ciphertext = encrypt(prv, derivedKey.secretKey, derivedKey.iv)
console.log(ciphertext)

console.log('============================== keystore begin')
var keystore = {
  address,
  Crypto: {
    cipher: 'aes-256',
    ciphertext,
    cipherparams: {
      iv: derivedKey.iv
    }
  },
  kdf: 'sha256x2',
  kdfparams: {
    salt: derivedKey.salt
  },
  version: 1
}
console.log(JSON.stringify(keystore, null, 2))
console.log('============================== keystore end')


console.log('recover private key:')
const d_prv = decrypt(ciphertext, derivedKey.secretKey, derivedKey.iv)
console.log(d_prv)
console.log(d_prv === prv)
