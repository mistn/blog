---
author: miuo
pubDatetime: 2026-04-03T00:00:00+08:00
modDatetime: 2026-04-03T00:00:00+08:00
title: Obsidian LiveSync 部署和插件推荐
featured: false
draft: false
tags:
  - Obsidian
  - LiveSync
  - CouchDB
  - 插件推荐
description: Obsidian LiveSync 部署教程，涵盖 CouchDB 配置、跨设备同步与实用插件推荐。
---

插件在精不在多，所以移动端只有 [Self-hosted LiveSync](https://github.com/vrtmrz/obsidian-livesync) 插件，其余插件均在 Windows 平台

Obsidian LiveSync 可实现跨设备秒级同步

## 1. 安装 LiveSync

- 1panel 面板应用商店直接安装即可
- [反向代理](/posts/1panel-reverse-proxy) SSL证书参考之前文章

## 2. CouchDB 数据库

- 访问 `http://ob.yourdomain.com/_utils`
- 点击 [Create Database]创建数据库即可
![](https://s3.2731515.xyz/PicGo/20260403200715brheQu.webp)

## 3. Obsidian 配置

### 3.1 安装插件

![](https://s3.2731515.xyz/PicGo/20260403201800dLKPsC.webp)

### 3.2 配置

1. 跟随引导
![](https://s3.2731515.xyz/PicGo/20260403202442Xa8Wye.webp)
2. 手动填写服务器信息
![](https://s3.2731515.xyz/PicGo/20260403202715WVb6yw.webp)
3. 开启E2EE加密
![](https://s3.2731515.xyz/PicGo/20260403202937d9Vc23.webp)
4. 选择CouchDB
![](https://s3.2731515.xyz/PicGo/20260403202959iPdqy0.webp)
5. 依次填写
![](https://s3.2731515.xyz/PicGo/20260403203042jqSxAv.webp)
6. 其他设备扫描QR码即可
![](https://s3.2731515.xyz/PicGo/20260403204104lgLV2b.webp)
7. 开启 LiveSync，核心功能实时同步
![](https://s3.2731515.xyz/PicGo/20260403204847H7ISLL.webp)

## 4. 插件推荐

1. Git
备份到私有仓库防止数据丢失

2. Image auto upload
粘贴自动上传图片到图床

3. Quiet Outline
专业导航栏

4. Self-hosted LiveSync
实时跨设备同步
