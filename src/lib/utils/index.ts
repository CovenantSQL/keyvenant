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
