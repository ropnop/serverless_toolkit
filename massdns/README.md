# Massdns Serverless
This example compiles and installs [massdns](https://github.com/blechschmidt/massdns) inside a Docker container running the Micro webserver. The webserver reads data from POST request bodies, writes it to a temp file, and executes `massdns` against it like so:

`massdns -r /massdns-master/lists/resolvers.txt -o J ${tmpdir}/domains.txt`

Stdout from the process is massaged a little bit to make well-formed JSON, and then the response is returned in an HTTP response.

This is more of a PoC of what is possible with serverless container execution. I'd probably rather just rather run massdns in a container locally, but if you ever find yourself needing to resolve a lot of domain names and only have the ability to make HTTP requests, this might be useful

## Deployment
```
$ now --public
```
Select `[2] Dockerfile` for deployment type

## Usage
You must POST a file with domain names on each line. The easiest way is with curl:

```
$ curl -s -X POST --data-binary "@domains.txt" https://massdns-gingahvmrz.now.sh
```
This will return JSON that can be parsed with `jq` or your tool of choice.