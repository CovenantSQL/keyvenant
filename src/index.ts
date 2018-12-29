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
// import {
//   createPrivateKey,
//   privateKeyToPublicKey,
//   verifyPrivateKey,
//   publicKeyToAddress
// } from './lib/keygen'
// import {
//   deriveKey,
//   verifyKey
// } from './lib/secretkey'
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
// const key = createPrivateKey()
// const pub = privateKeyToPublicKey(key)
// console.log(JSON.stringify(key), key.length)
// console.log(pub, pub.length)
// console.log('\n')

// const k = Buffer.from(require('./lib/test_data/privateKeys.json')[0].data)
// console.log('// k', k)
// console.log('verifyPrivateKey k', verifyPrivateKey(k))
// const kPub = privateKeyToPublicKey(k)
// console.log(kPub)
// console.log(kPub.length)
// console.log(publicKeyToAddress(kPub))

console.log('---------')
// console.log(deriveKey('foo'))

// console.log(verifyKey('foo', {
//   secretKey: 'd961a5b5a30bb21c87e81ca6886594db63100b254d4fed9cab406d1617a682eb',
//   salt: '951dcfb80c7b7e0c033e5e1fbc2c0c0053455b92a087580a7be9d093e286fc018f207ca6f356af9c9aa23862f5be8b9e',
//   iv: ''
// }))

const prv = 'dffe3ae00a500e5af754d067242fe7cf831da10e3705d3edbc85fe7fbddcf4aa'
const sec = 'd961a5b5a30bb21c87e81ca6886594db63100b254d4fed9cab406d1617a682eb'
const iv = 'fff9276c5b350b8750159f0abbaf243f'

const ciphertext = encrypt(prv, sec, iv, true)
console.log(ciphertext)
const d_prv = decrypt(ciphertext, sec, iv, true)
console.log(d_prv)
console.log(d_prv === prv)
