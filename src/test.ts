import { decrypt } from './lib/symmetric'

console.log(decrypt(
  '8e8ed1f07e84746ad366ffd9cc589820527d6ee701d0e0183ae8e8bdbdd77264762ff984b5c3df61e250cdb336eb9b77',
  '131cfa042a96a687f561646eefb433998ea5ac23ad10abee8a1bef1c3f31a586',
  'a92e0795087680423afa6e7f18eff89d'
))
