# Static Example
This example is just to illustrate that serverless doesn't have to be used only for dynamic functions. With one command, it's possible to serve up arbitrary static content on a highly available CDN behind fully trusted TLS certificats with HTTP2 support.

I am often hosting payloads for CSRF or XSS, or needing to put some sort of PoC in a public reachable place, and this is so much easier than copying files to a VPS and having to manage my own infrastructure.

## Deployment
Without a `package.json` or `Dockerfile`, a static deployment will happend automatically. Any files in the current directory will be served up instantly

```
now --public
```

## Usage
Browse or link to any file, e.g. `<script src="https://staticexample-eaguoozryf.now.sh/alert.js"></script>`

