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

import * as keystore from './lib/keystore'
import { exportToFile } from './lib/utils'

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

  create(password: string): object {
    let addrVersion: number = this.config.isMainNet
      ? this.config.versions.address.mainNet
      : this.config.versions.address.testNet

    let privateKeyVersion: number = this.config.versions.privateKey
    let salt: string = this.config.secretKey.salt

    return keystore.createKeystore(
      password,
      salt,
      addrVersion,
      privateKeyVersion
    )
  }

  dump(password: string) {
    let keystore = this.create(password)
    exportToFile(keystore)
  }

  recover(encrypted: string) {
    console.log(keystore.deconstructEncrypted(encrypted))
  }
}

let k = new Keyvenant()
k.dump('foo')
