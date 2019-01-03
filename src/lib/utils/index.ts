import fs from 'fs'
import path from 'path'

export const isBrowser = typeof process === 'undefined' || !process.nextTick

function isHex(str: string): Boolean {
  return str.length % 2 === 0 && str.match(/^[0-9a-f]+$/i)
    ? true
    : false
}

function isBase64(str: string): Boolean {
  if (str.length % 4 > 0 || str.match(/[^0-9a-z+\/=]/i)) {
    return false
  }
  const index = str.indexOf('=')
  return (index === -1 || str.slice(index).match(/={1,2}/))
    ? true
    : false
}

export function string2Buffer(str: string, enc?: string): Buffer {
    if (!enc && isHex(str)) {
      enc = 'hex'
    }
    if (!enc && isBase64(str)) {
      enc = 'base64'
    }

    return Buffer.from(str, enc)
}

function generateKeystoreFilename(
  address: string
): string {
  let date: string = new Date().toISOString()
  // Windows does not support letter ':' in filename
  let filename: string = 'UTC--' + date.replace(/\:/g, '-') + '--' + address

  return filename
}

export function exportToFile(
  keystore: any
): string {
  // if in browser return keystore object as stringify JSON
  if (isBrowser) {
    return JSON.stringify(keystore)
  }

  let filename: string = generateKeystoreFilename(keystore.address)
  // default path is keystore folder
  let outpath: string = path.join(filename)

  fs.writeFileSync(outpath, JSON.stringify(keystore, null, 2))
  return outpath
}
