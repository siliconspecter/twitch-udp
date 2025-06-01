import { createSocket } from 'dgram'

const socket = createSocket('udp4')

const bytes = []

let configuredAddress = null
let configuredPort = null

export function configureUdp(address, port) {
  configuredAddress = address
  configuredPort = port
}

export function writeU8(u8) {
  bytes.push(u8)
}

export function writeU32(u32) {
  writeU8(u32 & 255)
  writeU8((u32 >> 8) & 255)
  writeU8((u32 >> 16) & 255)
  writeU8(u32 >> 24)
}

export function encodeString(string) {
  const codePoints = Array.from(string)

  const output = new Uint8Array(codePoints.length * 4)

  for (let index = 0; index < codePoints.length; index++) {
    const codePoint = codePoints[index].codePointAt(0)
    output[index * 4] = codePoint & 255
    output[index * 4 + 1] = (codePoint >> 8) & 255
    output[index * 4 + 2] = (codePoint >> 16) & 255
    output[index * 4 + 3] = codePoint >> 24
  }

  return output
}

export function writeString(bytes) {
  writeU32(bytes.byteLength / 4)

  for (const byte of bytes) {
    writeU8(byte)
  }
}

export function writeUuid(uuid) {
  const match = /^([a-fA-F0-9]{8})-([a-fA-F0-9]{4})-([a-fA-F0-9]{4})-([a-fA-F0-9]{4})-([a-fA-F0-9]{12})$/.exec(uuid)

  if (match === null) {
    throw new Error(`Failed to parse "${uuid}" as a UUID.`)
  }

  for (const byte of Buffer.from(Array.from(match).slice(1).join(''), 'hex')) {
    writeU8(byte)
  }
}

export async function send() {
  console.log('Sending...')
  await new Promise((resolve, reject) => {
    const data = new Uint8Array(bytes)
    bytes.length = 0
    socket.send(data, configuredPort, configuredAddress, (error) => {
      if (error === null) {
        console.log('Sent successfully.')
        resolve()
      } else {
        console.error(error)
        reject(error)
      }
    })
  })
}
