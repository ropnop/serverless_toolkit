# Request Dump
This function simply echos information about the request it receives back in a JSON response. This is useful for troubleshooting or seeing custom headers or other info that might not be readily apparent.

Note: now.sh does a lot of header manipulation to get the request to our serverless function, so even the most basic of requests will have several headers added. I blacklisted the following headers from appearing in the response since I *usually* don't care about them:

```
"x-forwarded-host",
"x-real-ip",
"x-forwarded-for",
"x-forwarded-proto",
"x-now-id",
"x-now-log-id",
"x-zeit-co-forwarded-for",
"cf-ipcountry",
"cf-ray",
"cf-visitor",
"cf-connecting-ip",
"true-client-ip"
```

However, these can be toggled to be displayed by setting the environment variable `ALL_HEADERS` to true.

## Deployment
```
$ now --public
```

If you want to see *all* headers:

```
$ now -e ALL_HEADERS=true --public
```

## Usage
Simply make a request to the server and it will dump the request info in JSON format:

```
$ curl -s "https://req-dump-jjpxwbljvf.now.sh/randompath?foobar=helloworld" | jq .
{
  "url": "/randompath?foobar=helloworld",
  "method": "GET",
  "headers": {
    "host": "req-dump-jjpxwbljvf.now.sh",
    "connection": "close",
    "accept-encoding": "gzip",
    "user-agent": "curl/7.54.0",
    "accept": "*/*"
  },
  "body": "",
  "ip": "24.1.256.256"
}
```