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

import { createKeystore, recoverFromKeystore } from './lib/keystore'
import { exportToFile, importFromFile } from './lib/utils'

// default config
const defaultConfig = {
  isMainNet: false,
  versions: {
    address: {
      mainNet: 0x0,
      testNet: 0x6f
    },
    privateKey: 0x23
  },
  secretKey: {
    salt: Buffer.from('auxten-key-salt-auxten', 'utf8').toString('hex')
    // salt: 'c04ea47149654131794b6a702f394543'
  }
}

export default class Keyvenant {
  config: any

  constructor(props?: any) {
    this.config = (props && props.config) || defaultConfig
  }

  /**
   * create keystore & return
   * @param  password
   * @return keystore object
   */
  create(password: string): object {
    let addrVersion: number = this.config.isMainNet
      ? this.config.versions.address.mainNet
      : this.config.versions.address.testNet

    let privateKeyVersion: number = this.config.versions.privateKey
    let salt: string = this.config.secretKey.salt

    return createKeystore(
      password,
      salt,
      addrVersion,
      privateKeyVersion
    )
  }

  /**
   * dump to keystore file
   * @param  password
   */
  dump(password: string) {
    let keystore = this.create(password)
    let name: string = exportToFile(keystore)
    console.log('Keystore exported: ', name)
  }

  /**
   * recover private key from keystore and password
   * only in Node env
   * @param  password
   * @param  filepath keystore filepath
   * @return private key string in hex
   */
  recover(password: string, filepath: string): string {
    let keystore = importFromFile(filepath)
    let salt: string = this.config.secretKey.salt
    console.log('// keystore from file', keystore)

    let privateKey: string = recoverFromKeystore(password, salt, keystore)

    console.log('// private key', privateKey)
    return privateKey
  }
}

let k = new Keyvenant()
// k.dump('foo')
k.recover('foo', 'src/lib/tests/UTC--2019-01-03T14-58-12.083Z--4k1iCM4a3D3FVmEQ4DokcsZt3ikRu6fJHbwaDrEdPVuRbQBDnC5')
