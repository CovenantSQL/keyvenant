# keyvenant

Keyvenant is a JavaScript tool to generate and export CovenantSQL keys to facilitate key management locally and in web extensions.

## Usage
- `npm install keyvenant`

```javascript
import Keyvenant from 'keyvenant'

const keystore = new Keyvenant() // with default config
keystore.create('$password') // create keystore
keystore.dump('$password') // dump keystore file to current path
keystore.recover('$password_of_the_keystore', '$keystore_path') // recover parivate key
```

## keystore
example:
```
keystore:
{
  "address": "4k1iCM4a3D3FVmEQ4DokcsZt3ikRu6fJHbwaDrEdPVuRbQBDnC5",
  "encrypted": "MZdus3mQcfCTr448CNUgzVTyDZrDQC3UARTdJvKkh8ZGNVHEQakjZ8y4vFsbYL9gzSw9tA42ip3Ay9H9PKwQ367C2hvZ8k",
  "mac": "5e8e7c4f010e4e4681c77cdbc1a2c310048b4516a606278c32126f9d7780b88e",
  "crypto": {
    "cipher": "aes-256",
    "ciphertext": "39d028d77290ddf857e693655c11b399c24d8dd07e2a6b5b4ba0f28898687ffa8df3dcd096625ad5335c2a033607781b",
    "iv": "9c07efc4250fd585369b0de7e9783f32"
  },
  "derivation": {
    "kdf": "sha256x2",
    "salt": "61757874656e2d6b65792d73616c742d61757874656e"
  },
  "version": 35
}

private key:
61dcd9f332a39f47f71434306d82e7f04dc04271170fd5902f357770085d6e48
```

- try create & recover with `yarn dev`

## Docs
[Keyvenant TypeDoc](https://covenantsql.github.io/keyvenant/)
