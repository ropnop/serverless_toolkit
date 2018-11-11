# Nmap Scan
This serverless function wraps an Express app around a basic Nmap scan. It listens for a single URL query called `host` and then executes a fast nmap scan against it with the following options:

```
nmap -Pn -F -sT $host
```

The normal nmap output is captured and then returned in the HTTP response.

This is useful for quickly scanning a target IP from an external source. Quicker than SSHing into a VPS to run a quick Nmap scan 

## Deployment 
```
$ now --public
```

If you want to change the arguments of the `nmap` scan (e.g. run a script or look for more ports), you'll need to change the following line in `index.js`:

```
const command = spawn('nmap', ['-Pn', '-F', '-sT', host]);
```

Note: longer nmap scans will probably time out the HTTP connection before they finish

## Usage
The function expects a `host` parameter sent via a GET request:

```
$ curl "https://nmapscan-qijgjnaats.now.sh?host=blog.ropnop.com"

Starting Nmap 7.70 ( https://nmap.org ) at 2018-11-11 16:12 UTC
Nmap scan report for blog.ropnop.com (104.18.43.134)
Host is up (0.0020s latency).
Other addresses for blog.ropnop.com (not scanned): 104.18.42.134 2606:4700:30::6812:2b86 2606:4700:30::6812:2a86
Not shown: 96 filtered ports
PORT     STATE SERVICE
80/tcp   open  http
443/tcp  open  https
8080/tcp open  http-proxy
8443/tcp open  https-alt

Nmap done: 1 IP address (1 host up) scanned in 2.05 seconds
```