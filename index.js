import { acquireOAuthToken } from "./oauth.js";
import { subscribeToEvents } from "./subscriptions.js";
import { configureUdp } from "./udp.js";
import { connectToWebSocket } from "./websocket.js";

if (process.argv.length !== 7) {
  throw new Error(`Expected five arguments (recipient address, recipient port, user ID, client ID, temporary port); actual quantity ${process.argv.length - 2}.`)
}

const recipientAddress = process.argv[2]
const recipientPort = process.argv[3]

if (! /^[1-9][0-9]{0,3}$|^[0-5][0-9]{4}$|^6[0-4][0-9]{3}$|^65[0-4][0-9]{2}$|^655[0-2][0-9]$|^6553[0-5]$/.test(recipientPort)) {
  throw new Error(`Failed to determine recipient port ("${recipientPort}").`)
}

const userId = process.argv[4]
const clientId = process.argv[5]

const temporaryPort = process.argv[6]

if (! /^[1-9][0-9]{0,3}$|^[0-5][0-9]{4}$|^6[0-4][0-9]{3}$|^65[0-4][0-9]{2}$|^655[0-2][0-9]$|^6553[0-5]$/.test(temporaryPort)) {
  throw new Error(`Failed to determine temporary port ("${temporaryPort}").`)
}

configureUdp(recipientAddress, recipientPort)

const oauthToken = await acquireOAuthToken(clientId, temporaryPort)

while (true) {
  let sessionId, closure

  try {
    const copy = await connectToWebSocket()
    sessionId = copy.sessionId
    closure = copy.closure
  } catch (e) {
    console.error(e)
    console.log("Will retry connecting to the WebSocket after a short delay.")
    await new Promise((resolve) => {
      setTimeout(resolve, 5000)
    })
    continue
  }
  await subscribeToEvents(clientId, userId, oauthToken, sessionId)
  await closure
  console.log("Will retry connecting to the WebSocket now.")
}
