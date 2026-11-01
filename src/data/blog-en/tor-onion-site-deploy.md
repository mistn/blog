---
author: miuarc
pubDatetime: 2026-10-28T12:00:00+08:00
modDatetime: 2026-10-28T12:00:00+08:00
title: How to deploy your own onion site
featured: false
draft: false
tags:
  - Tor
  - Onion
  - Nginx
  - Debian
  - Privacy
description: Brute-force a personalized .onion address with mkp224o, then wire up Tor and nginx to put your site on the onion network.
---

## 1. What is a .onion address

`.onion` is a special top-level domain. You cannot buy one from a registrar like a normal domain, and regular browsers such as Chrome cannot open it directly. In practice you reach these sites through Tor Browser.

![](https://s3.2731515.xyz/PicGo/20261028122613kKUcHk.webp)

## 2. How to get a .onion address

A key pair is generated with the Ed25519 algorithm: the private key proves your identity, and the public key becomes the address shown to the world.

Addresses are normally fully random, but I wanted something personal. For example, taking the first 8 characters `satou233` after a character from my favorite story.

Because the address is generated randomly, the prefix you want has to be brute-forced. The longer the prefix, the exponentially longer it takes.

I used a 4-core, 4 GB Debian 13 server for this.

### 2.1 Install the build tools and crypto libraries

```bash
sudo apt-get update
sudo apt-get install gcc libc6-dev libsodium-dev make autoconf git
```

### 2.2 Download and build `mkp224o`

```bash
git clone https://github.com/cathugger/mkp224o.git
cd mkp224o
./autogen.sh
./configure
make
```

### 2.3 Start brute-forcing the prefix you want

```bash
nohup ./mkp224o -d satou_keys -t 3 satou233 &
```

- `nohup`: keep it running after the session disconnects
- `./mkp224o`: the generator
- `-d satou_keys`: directory where generated keys are stored
- `-t 3`: limit it to three threads
- `satou233`: the prefix you want

### 2.4 Leave it running and go to sleep

```bash
cd mkp224o # enter the directory holding the keys
```

```bash
ls satou_keys # list every generated key
```

```bash
pkill mkp224o # stop generating
```

### 2.5 Extract the private key

Here is one of the keys I generated:

```bash
cd satou_keys/satou233smm2npk6qcrzm6jmhtr3jo5cmtirf7el3lbqa5skdx3mqmqd.onion # enter the directory
```

Run `ls` to see the public and private key files.

![](https://s3.2731515.xyz/PicGo/20261028101738U7NASg.webp)

Then copy them to your local Windows machine with SFTP or similar as a backup.

## 3. Deploy and publish your site

I used another idle server for the actual deployment.

### 3.1 Install Tor

```bash
apt update && apt install -y tor nginx
# tor = the onion service
```

### 3.2 Create directories for the keys and the site

```bash
mkdir -p /var/www/satou233          # static site files
mkdir -p /var/lib/tor/satou233      # private key
```

![](https://s3.2731515.xyz/PicGo/20261028103741saQDZH.webp)

![](https://s3.2731515.xyz/PicGo/20261028110300rHu86z.webp)

Fix the permissions:

```bash
chown -R debian-tor:debian-tor /var/lib/tor/satou233
chmod 700 /var/lib/tor/satou233
chmod 600 /var/lib/tor/satou233/hs_ed25519_secret_key
```

### 3.3 Configure Tor

Edit the main Tor config:

```bash
nano /etc/tor/torrc
```

Scroll to the end and paste these two lines:

```bash
HiddenServiceDir /var/lib/tor/satou233/
HiddenServicePort 80 127.0.0.1:8080
```

```bash
# make sure they were written
tail -n 5 /etc/tor/torrc
```

### 3.4 Configure nginx

```bash
nano /etc/nginx/conf.d/satou233.onion.conf
```

A minimal config:

```bash
server {
    listen 127.0.0.1:8080;
    root /var/www/satou233;
    index index.html;
    absolute_redirect off;
}
```

Check it — `syntax is ok` means everything is fine:

```bash
nginx -t
```

Then reload nginx:

```bash
systemctl reload nginx
```

### 3.5 Restart and verify

```bash
systemctl restart tor@default
systemctl status tor@default --no-pager
```

**Site address:**

```
 http://satou233smm2npk6qcrzm6jmhtr3jo5cmtirf7el3lbqa5skdx3mqmqd.onion
```

![Loaded successfully](https://s3.2731515.xyz/PicGo/20261028113828DDO1yv.webp)

It loaded, and the speed is actually not bad.

![](https://s3.2731515.xyz/PicGo/20261028113959lqYJIX.webp)
