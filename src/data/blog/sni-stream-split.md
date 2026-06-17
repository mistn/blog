---
author: miuo
pubDatetime: 2026-06-17T00:00:00+08:00
modDatetime: 2026-06-17T00:00:00+08:00
title: SNI 分流与 443 端口冲突解决
featured: false
draft: false
tags:
  - SNI
  - Nginx
  - OpenResty
  - 1Panel
description: OpenResty 443 端口冲突解决与 SNI 分流配置记录。
---
> 系统环境：1Panel + OpenResty (Docker) + 3x-ui + Cloudflare
>
> 目标：通过 Nginx `stream` 模块实现 443 端口复用，根据 SNI 自动分流 Xray 代理流量与建站流量。
>
> 报错：网站访问出现 Cloudflare 525 Error (SSL handshake failed)，OpenResty 容器不断崩溃，陷入 `is restarting` 死循环。面板也随之失联。

## 修复 Docker 网络层转发

OpenResty 运行在容器内，代理流量直接转发至 `127.0.0.1` 无法触达宿主机的 3x-ui。

获取 1Panel 网络网关（通常为 `172.18.0.1`）：

```bash
docker network inspect 1panel-network | grep Gateway
```

## 完善 Stream 分流配置

修改 `/usr/local/openresty/nginx/conf/nginx.conf`，将前端 443 流量分发至后端 4443 (建站) 和宿主机 8443 (代理)：

```nginx
stream {
    map $ssl_preread_server_name $backend_name {
        [www.microsoft.com](https://www.microsoft.com)  xray_backend;   # 代理伪装域名
        default            web_backend;    # 正常建站域名
    }
    upstream xray_backend {
        server 172.18.0.1:8443; # 指向 Docker 网关，穿出容器到达 3x-ui
    }
    upstream web_backend {
        server 127.0.0.1:4443;  # 网站配置与 Nginx 同容器，保留本地回环
    }
    server {
        listen 443;
        listen [::]:443;
        proxy_pass $backend_name;
        ssl_preread on; 
    }
}
```

## 解决 Nginx 443 端口冲突

崩溃原因：Nginx 的 `stream` 监听了 443，但 1Panel 生成的默认兜底站点（`00.default.conf`）以及新建站点的 `http` 模块同样默认监听了 443，导致抢占死锁：`bind() to 0.0.0.0:443 failed`。

宿主机修改内鬼默认配置（将 443 改为 4443）：

```bash
sed -i 's/listen 443 ssl http2;/listen 4443 ssl http2;/g' /opt/1panel/apps/openresty/openresty/conf/conf.d/00.default.conf
```

手动修改所有已建网站（如 wallos）的 Nginx 配置文件，将 `listen 443 ssl http2;` 替换为 `listen 4443 ssl http2;`。

验证配置并重启容器：

```bash
docker exec -it <1Panel-openresty容器名> nginx -t
docker restart <1Panel-openresty容器名>
```

## 获取真实访客 IP

经过 stream 转发后后端收到全是 `127.0.0.1`。在网站 Nginx 配置的 http 块加入 Cloudflare 真实 IP 规则：

```nginx
# ================= 真实 IP 全局配置 =================
    # 1. 信任本地回环和 Docker 网关转发的 Header
    set_real_ip_from 127.0.0.1;
    set_real_ip_from 172.18.0.1;

    # 2. 信任 Cloudflare 的公网 CDN 节点 IP 段
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;

    # 3. 指定从 Cloudflare 专属的 Header 字段中提取用户真实公网 IP
    real_ip_header CF-Connecting-IP;
    # ===================================================
```

保存并使其生效

