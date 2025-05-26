# Twitch UDP

Command-line utility to forward Twitch events to a UDP listener.

## Dependencies

- NodeJS.

## Usage

Before the first run, `npm install`.

Execute `node . 127.0.0.1 6772 123456789 w7i8a7neoiawo8aow7eaef87oweh8i 6773` to
forward the below events regarding user `123456789` to port 6772 on localhost,
connecting as client ID `w7i8a7neoiawo8aow7eaef87oweh8i`, temporarily using port
6773 to acquire a token.

### Redeem

| Byte | Description                               |
| ---- | ----------------------------------------- |
| 24   | Length of command.                        |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 4    | Magic number.                             |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 72   | Redeem UUID.                              |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 105  |                                           |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 33   |                                           |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 33   |                                           |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |

### Chat Message

Emotes are not currently well-supported.  Text will be displayed in their place,
e.g. `:emotename:`.

| Byte | Description                               |
| ---- | ----------------------------------------- |
| 20   | Length of command.                        |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 5    | Magic number.                             |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 72   | UTF-32-encoded string containing message. |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 105  |                                           |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
| 33   |                                           |
| 0    |                                           |
| 0    |                                           |
| 0    |                                           |
