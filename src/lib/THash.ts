import blake from 'blakejs'
import { sha256 } from './sha256'

// return n-byte Uint8Array
const blake2b = blake.blake2b

export function blake2b512(input: Buffer, key?: Uint8Array): Uint8Array {
  return blake2b(input, key, 64)
}

// THash calculates sha256(blake2b-512(b)) and returns the resulting bytes as a Hash
export function THash(input: Buffer): string {
  const first = blake2b512(input)
  return sha256(first)
}
