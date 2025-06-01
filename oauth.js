import { createServer } from 'http'
import open from 'open'
import { eventTypes } from './event_types.js'

export function acquireOAuthToken(clientId, temporaryPort) {
  return new Promise((resolve, reject) => {
    console.log('Starting web server to acquire OAuth token...')
    const server = createServer((req, res) => {
      if (req.url === '/') {
        console.log('Redirecting to capture token...')
        res.write('<html><body><script>location.search = `?${location.hash.slice(1)}`</script></body></html>')
        res.end()
      } else {
        const match = /^\/\?access_token=([^&]+)/.exec(req.url)

        if (match !== null) {
          console.log('Successfully captured OAuth token; closing web browser...')
          res.write('<html><body><script>window.close()</script></body></html>')
          res.end()
          console.log('Shutting down web server...')
          server.close((error) => {
            if (error === undefined) {
              resolve(decodeURIComponent(match[1]))
            } else {
              reject(error)
            }
          })
        } else {
          console.log('Unable to determine the structure of the response.')
          res.end()
        }
      }
    }).on('error', (error) => {
      reject(error)
    }).listen(temporaryPort, () => {
      console.log('Launching web browser...')
      open(`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${encodeURIComponent(clientId)}&redirect_uri=http://localhost:${temporaryPort}&scope=${encodeURIComponent(Array.from(new Set(eventTypes.flatMap(eventType => eventType.scopes))).join(' '))}`)
    })
  })
}
