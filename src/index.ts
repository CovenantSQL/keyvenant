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
import {
  // deriveKey,
  verifyKey
} from './lib/symmetric'

export * from './lib/keygen'

export const constants = {
  addressVersion: {
    mainNet: 0x0,
    testNet: 0x6f,
  },
  secretKey: {
    privateKeyLength: 32,
    ivLength: 16,
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

console.log(verifyKey('foo', {
  secretKey: 'd961a5b5a30bb21c87e81ca6886594db63100b254d4fed9cab406d1617a682eb',
  salt: '951dcfb80c7b7e0c033e5e1fbc2c0c0053455b92a087580a7be9d093e286fc018f207ca6f356af9c9aa23862f5be8b9e'
}))
