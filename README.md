# keyvenant

Keyvenant is a JavaScript tool to generate and export CovenantSQL keys to facilitate key management locally and in web extensions.

## Keystore
example:
```
{
  "address": "4jZbvzwmhbA6kKv8WEREoWgaWZ4izjXUNo1PJHun8pscaYTh52c",
  "Crypto": {
    "cipher": "aes-256",
    "ciphertext": "947b90f85c55c906bc4289e9c008348379fc2cbd77d3f552ad6ed1fd15bb34b8e7174c5f65fdeab67f15b696470e62c1",
    "cipherparams": {
      "iv": "3b29964875f1cddd9dbb2d7c7966b18b"
    }
  },
  "kdf": "sha256x2",
  "kdfparams": {
    "salt": "7dbe62009d240d1729f1b0f3d0f41bb0ad35c2d40679ed0dc968a60d172a2402629cac477ebe36b9e1469c60ec1f0f65"
  },
  "version": 1
}
```
