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

| Byte | Description                                       |
| ---- | ------------------------------------------------- |
| 56   | Length of command.                                |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 4    | Magic number.                                     |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 3    | Redeem UUID.                                      |
| 52   |                                                   |
| 102  |                                                   |
| 94   |                                                   |
| 7    |                                                   |
| 14   |                                                   |
| 43   |                                                   |
| 221  |                                                   |
| 184  |                                                   |
| 55   |                                                   |
| 21   |                                                   |
| 27   |                                                   |
| 101  |                                                   |
| 109  |                                                   |
| 244  |                                                   |
| 70   |                                                   |
| 3    | Length of redeemer's name.                        |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 74   | UTF-32-encoded string containing redeemer's name. |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 111  |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 101  |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 4    | Length of redeem's name.                          |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 84   | UTF-32-encoded string containing redeem's name.   |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 101  |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 115  |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 116  |                                                   |
| 0    |                                                   |
| 0    |                                                   |
| 0    |                                                   |

### Chat Message

Emotes are not currently well-supported.  Text will be displayed in their place,
e.g. `:emotename:`.

| Byte | Description                                        |
| ---- | -------------------------------------------------- |
| 36   | Length of command.                                 |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 5    | Magic number.                                      |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 3    | Length of commenter's name.                        |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 74   | UTF-32-encoded string containing commenter's name. |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 111  |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 101  |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 3    | Length of message.                                 |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 72   | UTF-32-encoded string containing message.          |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 105  |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 33   |                                                    |
| 0    |                                                    |
| 0    |                                                    |
| 0    |                                                    |
