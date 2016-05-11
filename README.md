### Acheron

Acheron is a WebSocket proxy built for the purpose for forwarding events triggered through HTTP requests. Currently, it only supports forwarding pings to [GTFO](https://github.com/Nase00/gtfo).

```
         External service
                +
                |
                | <-HTTP requests
   Acheron<-----+
      ^
      | <-WebSocket connection
      |
======== Firewall of woe ========
      |
      |
      v
   Intranet application
```

### Getting started
Deploy Acheron somewhere where it can accept HTTP requests, such as AWS, Heroku, etc. Then, add the WebSocket path to GTFO's `environment/config.json` as `"proxyHost": "ws://name-of-host"`.
