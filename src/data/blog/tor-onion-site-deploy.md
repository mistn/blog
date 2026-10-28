---
author: miuarc
pubDatetime: 2026-10-28T12:00:00+08:00
modDatetime: 2026-10-28T12:00:00+08:00
title: 如何部署一个自己的洋葱网站？
featured: false
draft: false
tags:
  - Tor
  - Onion
  - Nginx
  - Debian
  - 隐私
description: 用 mkp224o 穷举出个性化的 .onion 域名，再配好 tor 与 nginx，把自己的站点挂上洋葱网络。
---

## 1. 什么是 .onion 域名

.onion 是一种特殊的顶级域名，不能和普通域名一样在注册商购买，普通的浏览器如 chrome 也无法直接访问。一般通过 Tor Browser 即洋葱浏览器进行访问。

![](https://s3.2731515.xyz/PicGo/20261028122613kKUcHk.webp)

## 2. 如何拥有 .onion 域名

用特定的 Ed25519 密码算法生成一对私钥和公钥，私钥验证身份，公钥就是对外展示的域名。

一般都是完全随机的，但是我想要域名个性化一点，例如松坂砂糖，取前 8 位 `satou233` 。

因为是随机生成域名所以想要的域名前缀需要穷举出来，自定义的前缀越长，算出前缀的时间呈指数级上升。

我这里使用一个 4c4g debian 13 服务器来算。

### 2.1 安装必要的编译环境和密码学依赖库

```bash
sudo apt-get update
sudo apt-get install gcc libc6-dev libsodium-dev make autoconf git
```

### 2.2 下载并编译 `mkp224o` 

```bash
git clone https://github.com/cathugger/mkp224o.git
cd mkp224o
./autogen.sh
./configure
make
```

### 2.3 开始计算想要的前缀

```bash
nohup ./mkp224o -d satou_keys -t 3 satou233 &
```

- `nohup` ：防断联
- `./mkp224o` ：计算程序
- `-d satou_keys` ：算出的密钥保存在这个文件夹
- `-t 3` ：限制三个线程计算
- `satou233` ：想要的前缀

### 2.4 接下来挂机睡一觉

```bash
cd mkp224o #进入存放密钥的目录
```

```bash
ls satou_keys #列出算出来的所有密钥
```

```bash
pkill mkp224o #停止计算
```

### 2.5 提取私钥文件

以我算出来的其中一个密钥为例：
```bash
cd satou_keys/satou233smm2npk6qcrzm6jmhtr3jo5cmtirf7el3lbqa5skdx3mqmqd.onion #进入文件夹
```

输入 `ls` ，查看公钥和私钥文件

![](https://s3.2731515.xyz/PicGo/20261028101738U7NASg.webp)

然后可以用 SFTP 之类的保存到本地 windows 电脑做一下备份。

## 3. 部署并上线自己的网站

部署网站我换了一个新的闲置服务器

### 3.1 安装 tor 服务

```bash
apt update && apt install -y tor nginx
# tor = 洋葱服务
```

### 3.2 建文件夹放入密钥和网站

```bash
mkdir -p /var/www/satou233          #这个放静态网站
mkdir -p /var/lib/tor/satou233      #放私钥
```


![](https://s3.2731515.xyz/PicGo/20261028103741saQDZH.webp)


![](https://s3.2731515.xyz/PicGo/20261028110300rHu86z.webp)

改一下权限：

```bash
chown -R debian-tor:debian-tor /var/lib/tor/satou233
chmod 700 /var/lib/tor/satou233
chmod 600 /var/lib/tor/satou233/hs_ed25519_secret_key 
```

### 3.3 配置 tor 服务

编辑 tor 主配置：

```bash
nano /etc/tor/torrc
```

拉到末尾，粘贴下面两行：

```bash
HiddenServiceDir /var/lib/tor/satou233/
HiddenServicePort 80 127.0.0.1:8080
```

```bash
# 确认写进去了
tail -n 5 /etc/tor/torrc
```

### 3.4 配置 nginx

```bash
nano /etc/nginx/conf.d/satou233.onion.conf
```

最简配置：

```bash
server {
    listen 127.0.0.1:8080;
    root /var/www/satou233;
    index index.html;
    absolute_redirect off;
}
```

验证一下，没问题会显示 `syntax is ok` 

```bash
nginx -t
```

然后重载 nginx 配置

```bash
systemctl reload nginx
```

### 3.5 重启并验证

```bash
systemctl restart tor@default
systemctl status tor@default --no-pager
```

**网站地址：**

```
 http://satou233smm2npk6qcrzm6jmhtr3jo5cmtirf7el3lbqa5skdx3mqmqd.onion
```

![访问成功](https://s3.2731515.xyz/PicGo/20261028113828DDO1yv.webp)

访问成功了，速度其实还不错

![](https://s3.2731515.xyz/PicGo/20261028113959lqYJIX.webp)
