# netlify-build-reproductions

## Issue reproduction (https://github.com/netlify/cli/issues/890#issuecomment-670989422)

```bash
node server.js
netlify dev

# This works
curl http://localhost:8888/api/hello
curl -d "param1=value1" http://localhost:5000/api/hello

# This gets stuck
curl -d "param1=value1" http://localhost:8888/api/hello
```
