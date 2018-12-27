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
  createPrivateKey,
  privateKeyToPublicKey,
  verifyPrivateKey
} from './lib/keygen'

import { THash } from './lib/THash'

export * from './lib/keygen'

export const constants = {
  addressVersion: {
    mainNet: 0x0,
    testNet: 0x6f,
  }
}

// local testing
const key = createPrivateKey()
const pub = privateKeyToPublicKey(key)
console.log(JSON.stringify(key), key.length)
console.log(pub, pub.length)
console.log('\n')

const k = Buffer.from(require('./lib/test_data/privateKeys.json')[1].data)
console.log('// k', k)
console.log('verifyPrivateKey k', verifyPrivateKey(k))
const kPub = privateKeyToPublicKey(k)
console.log(kPub)
console.log(kPub.length)
console.log(THash(kPub))
