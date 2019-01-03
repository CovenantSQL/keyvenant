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

import { createKeystore } from './lib/keystore'

// default config
const defaultConfig = {
  isMainNet: false,
  addressVersion: {
    mainNet: 0x0,
    testNet: 0x6f,
  },
  privateKeyVersion: 0x23,
  secretKey: {
    // IV length must equal AES block size, which is 128 bits, 16 bytes
    ivLength: 16,
    privateKeyLength: 32,
    get saltLength():number { return this.privateKeyLength + this.ivLength }
  }
}

export default class Keyvenant {
  config: any

  constructor(props?: any) {
    this.config = (props && props.config) || defaultConfig
  }

  create() {
    let version: number = this.config.isMainNet
      ? this.config.addressVersion.mainNet
      : this.config.addressVersion.testNet

    createKeystore(version)
  }
}

let k = new Keyvenant()
k.create()

// import {
//   // createPrivateKey,
//   privateKeyToPublicKey,
//   // verifyPrivateKey,
//   publicKeyToAddress
// } from './lib/keygen'
// import { deriveKey, verifyKey } from './lib/secretkey'
// import { encrypt, decrypt } from './lib/symmetric'
//
// export * from './lib/keygen'


// // local testing
// // const prv = createPrivateKey().toString('hex')
// const prv = 'f7c0bc718eb0df81e796a11e6f62e23cd2be0a4bdcca30df40d4d915cc3be3ff'
// const pub = privateKeyToPublicKey(Buffer.from(prv, 'hex')).toString('hex')
// const address = publicKeyToAddress(Buffer.from(pub, 'hex'))
// console.log('Public key: ', pub)
//
// const derivedKey = deriveKey('')
// console.log(derivedKey)
// // { secretKey: '', salt: '', iv: '' }
// console.log('verifyKey: ', verifyKey('', derivedKey))
//
// // aes256 test
// // const sec = 'd961a5b5a30bb21c87e81ca6886594db63100b254d4fed9cab406d1617a682eb'
// const ciphertext = encrypt(prv, derivedKey.secretKey, derivedKey.iv)
// console.log(ciphertext)
//
// console.log('============================== keystore begin')
// var keystore = {
//   address,
//   encrypted: '',
//   version: 0x23,
//   crypto: {
//     cipher: 'aes-256',
//     ciphertext,
//     iv: derivedKey.iv
//   },
//   derivation: {
//     kdf: 'sha256x2',
//     salt: derivedKey.salt
//   }
// }
// console.log(JSON.stringify(keystore, null, 2))
// console.log('============================== keystore end')
//
//
// console.log('recover private key:')
// const d_prv = decrypt(ciphertext, derivedKey.secretKey, derivedKey.iv)
// console.log(d_prv)
// console.log(d_prv === prv)
