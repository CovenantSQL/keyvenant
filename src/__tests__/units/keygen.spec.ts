// tslint:disable:no-expression-statement
import test from 'ava'
import { createPrivateKey } from '../../lib/keygen'

test('create privateKey', async t => {
  let privateKey = createPrivateKey()
  console.log(privateKey)
  t.is(privateKey.length, 32)
})
