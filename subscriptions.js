import { eventTypes } from "./event_types.js"

export async function subscribeToEvents(clientId, userId, oauthToken, sessionId) {
  for (const eventType of eventTypes) {
    console.log(`Subscribing to event "${eventType.type}"...`)

    const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
        'Client-Id': clientId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "type": eventType.type,
        "version": eventType.version,
        "condition": {
          "broadcaster_user_id": userId,
          "user_id": userId,
        },
        "transport": {
          "method": "websocket",
          "session_id": sessionId,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to subscribe to "${eventType.type}" (${await response.text()}).`)
    }
  }

  console.log('All events have been subscribed successfully.')
}
