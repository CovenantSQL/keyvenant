// import coinstring from 'coinstring'

import * as keygen from './keygen'
import * as secretkey from './secretkey'
import * as symmetric from './symmetric'

export function createKeystore(
  password: string,
  salt: string,
  addrVersion: number,
  ivLength: number,
) {
  // generate new key pair
  let prvKey: string = keygen.createPrivateKey()
  let pubKey: string = keygen.privateKeyToPublicKey(prvKey)

  // covert to address
  let address: string = keygen.publicKeyToAddress(pubKey, addrVersion)
  console.log('keygen', prvKey, pubKey, address)

  // get derived key from masterPassword
  let secretKey = secretkey.derive(password, salt)
  console.log('derivedKey', secretKey)
  console.log('verify', secretkey.verify(password, salt, secretKey))

  // prepare iv for symmetric encryption
  let iv: string = symmetric.generateIv(ivLength)
  console.log('iv', iv)
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
