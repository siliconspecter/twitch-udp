import websocket from "websocket";
import { encodeString, send, writeString, writeU32, writeU8, writeUuid } from "./udp.js";

export function connectToWebSocket() {
  return new Promise((resolve, reject) => {
    const closure = new Promise((resolveClose) => {
      console.log('Connecting to WebSocket...')

      const client = new websocket.w3cwebsocket('wss://eventsub.wss.twitch.tv/ws')

      let resolved = false

      let timeout = null

      function resetKeepalive() {
        if (timeout !== null) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          timeout = null

          console.log('Keepalive timeout; closing WebSocket...')
          client.close()
        }, 15000)
      }

      resetKeepalive()

      client.onerror = (e) => {
        client.close()

        if (resolved) {
          throw e
        } else {
          reject(e)
        }
      }

      client.onopen = () => {
        console.log('Socket open; waiting for session welcome...')
      }

      client.onclose = () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }

        if (resolved) {
          resolveClose()
        } else {
          reject(new Error('WebSocket closed.'))
        }
      }

      client.onmessage = (e) => {
        resetKeepalive()

        const message = JSON.parse(e.data)

        switch (message.metadata.message_type) {
          case 'session_welcome':
            console.log('Session welcome received.')
            resolved = true
            resolve({ sessionId: message.payload.session.id, closure })

            break

          case 'session_keepalive':
            console.log('Keepalive received.')
            break

          case 'notification':
            switch (message.payload.subscription.type) {
              case 'channel.channel_points_custom_reward_redemption.add': {
                console.log(`${message.payload.event.user_name} redeemed ${message.payload.event.reward.title} (${message.payload.event.reward.id}) for ${message.payload.event.reward.cost} byte(s).`)
                const userName = encodeString(message.payload.event.user_name);
                const rewardTitle = encodeString(message.payload.event.reward.title);
                writeU32(4 + 16 + 4 + 4 + userName.byteLength + 4 + rewardTitle.byteLength)
                writeU32(4)
                writeUuid(message.payload.event.reward.id)
                writeU32(message.payload.event.reward.cost)
                writeString(userName)
                writeString(rewardTitle)
                void send()
                break
              }

              case 'channel.chat.message': {
                const userName = encodeString(message.payload.event.chatter_user_name);
                const combined = encodeString(message.payload.event.message.fragments.map(item => {
                  switch (item.type) {
                    case 'text':
                      return item.text

                    case 'emote':
                      return `:${item.text}:`
                  }
                }).join(''))

                writeU32(4 + 4 + userName.byteLength + 4 + combined.byteLength)
                writeU32(5)
                writeString(userName)
                writeString(combined)
                void send()
                break
              }

              default:
                console.warn(`Received unimplemented subscription type "${message.payload.subscription.type}".`)
            }
            break

          default:
            console.warn(`Received unimplemented message type "${message.metadata.message_type}".`)
        }
      }
    })
  })
}
