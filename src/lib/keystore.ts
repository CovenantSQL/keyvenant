// import coinstring from 'coinstring'

// import { config } from '../index'

import * as keygen from './keygen'
// import * as secretkey from './secretkey'
// import * as symmetric from './symmetric'

export function createKeystore() {
  let prvKey: string = keygen.createPrivateKey()
  let pubKey: string = keygen.privateKeyToPublicKey(prvKey)
  let address: string = keygen.publicKeyToAddress(
    pubKey,
    0x6f
  )

  console.log(prvKey, pubKey, address)
}

// function marshal(
//   prv: string,
//   ciphertext: string,
//   iv: string
// ): object {
//   // const keystore = {
//   //   address,
//   //   encrypted: '',
//   //   mac: '',
//   //   version: 0x23,
//   //   crypto: {
//   //     cipher: 'aes-256',
//   //     ciphertext,
//   //     iv
//   //   },
//   //   derivation: {
//   //     kdf: 'sha256x2',
//   //     salt: derivedKey.salt
//   //   }
//   // }
//   return {}
// }
