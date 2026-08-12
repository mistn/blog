---
author: miuarc
pubDatetime: 2026-08-12T22:30:00+08:00
title: Bitwarden 6 款内置邮箱别名服务整理与对比
featured: false
draft: false
tags:
  - Bitwarden
  - 密码管理器
  - 邮箱别名
  - 临时邮箱
  - 邮箱马甲
  - 反垃圾邮件
description: 梳理 Bitwarden 生成器中可配置的 6 款邮箱别名服务（Addy.io、DuckDuckGo、Fastmail、Forward Email、Firefox Relay、SimpleLogin）的配置流程与限制对比。
---

平时经常会遇到一些临时网站需要注册，或者某些注册一次后就再也不会打开的网站，此时肯定不能用自己的常用邮箱进行注册。不说隐私风险，后续还有可能遭遇垃圾邮件轰炸。刚好 Bitwarden 集成了几个别名邮箱 API，下面我依次配置一遍。

![全部可配置的电子邮箱别名服务](https://s3.2731515.xyz/PicGo/20260812202543xkojfA.webp)

## 1. [Addy.io](https://addy.io/)

注意免费版月流量只有 10MB

![](https://s3.2731515.xyz/PicGo/20260812220039SSWEej.webp)

用邮箱注册 addy.io ，之后转发的邮件会到注册邮箱。

第一步进入首页后点左下角的 Settings

![](https://s3.2731515.xyz/PicGo/20260812204349ypCpTr.webp)

第二步在 Settings 的 General 选项卡往下滑找到 `Update Default Alias Domain` ,选择一个自己喜欢的邮箱域名

![](https://s3.2731515.xyz/PicGo/20260812204744HBXSSU.webp)

接着在 Settings 里创建 API keys ，创建的时候名字随便填，最后一行输入注册时候的密码

![](https://s3.2731515.xyz/PicGo/20260812205001IbkZdy.webp)

下一步转到 Bitwarden，进入生成器 -> 用户名，选择转发的电子邮箱别名，服务选择 Addy.io，电子邮箱域名填第二步自己选择的域名，API 密钥则填上一步申请的。

![](https://s3.2731515.xyz/PicGo/20260812205132tr9xna.webp)

接下来就可以随意生成电子邮箱进行测试

![](https://s3.2731515.xyz/PicGo/20260812205419pgYwI7.webp)

实测邮件会转发到注册的邮箱

![](https://s3.2731515.xyz/PicGo/20260812205541twSXNO.webp)

## 2. [DuckDuckGo（推荐）](https://duckduckgo.com/email/)

DuckDuckGo 无限别名，无流量限制，首选推荐。

首先进入此网址 https://duckduckgo.com/email ，然后按页面要求安装浏览器扩展

![](https://s3.2731515.xyz/PicGo/20260812205733VMOrxf.webp)

![](https://s3.2731515.xyz/PicGo/20260812205901MsICC5.webp)

完成后第一个页面会变成下图

![](https://s3.2731515.xyz/PicGo/20260812205927PUI5oH.webp)

填写邮件地址和需要转发到的邮箱

![](https://s3.2731515.xyz/PicGo/202608122100133vJn5O.webp)

之后会进入此页面，网址是 https://duckduckgo.com/email/settings/autofill

![](https://s3.2731515.xyz/PicGo/20260812210216Zlo3Bt.webp)

再在这个页面打开 F12 开发者页面，按序号依次点击，在 Network 里找到 `authorization Bearer` 字样，对应的就是需要填到 Bitwarden 里的 API Key

![](https://s3.2731515.xyz/PicGo/20260812210458eUFK0v.webp)

测试收信转发完全正常

![](https://s3.2731515.xyz/PicGo/20260812210920AP3OnQ.webp)

## 3. [Fastmail](https://www.fastmail.com/)

Fastmail 因为没有免费服务必须订阅，注册还必须验证手机号，给我劝退了，暂时不写。

![](https://s3.2731515.xyz/PicGo/20260812211337b0hmWQ.webp)

![](https://s3.2731515.xyz/PicGo/20260812211641lUOSOc.webp)

## 4. [Forward Email](https://forwardemail.net/en/my-account/domains/new)

问题是只支持托管自己的域名邮箱，没有免费邮箱后缀可用，不推荐。

![](https://s3.2731515.xyz/PicGo/20260812212718b2gNMx.webp)

## 5. [Firefox Relay](https://relay.firefox.com/accounts/profile)

值得注意的是免费版最多 50 个邮件马甲

![](https://s3.2731515.xyz/PicGo/20260812214208tiBxwy.webp)

下面是具体操作流程：

- 此域名登录自己的 firefox 账号 https://relay.firefox.com/accounts/profile
- 注意邮件会转发到注册 firefox 账号的邮箱
- 点击右上角的头像然后点设置

![](https://s3.2731515.xyz/PicGo/20260812213402PREvAp.webp)

复制 API Key 填到 Bitwarden 里

![](https://s3.2731515.xyz/PicGo/20260812213455SLPegJ.webp)

测试收信正常

![](https://s3.2731515.xyz/PicGo/20260812213736hUejrX.webp)

## 6. [SimpleLogin](https://simplelogin.io)

需要注意的是免费版只能注册十个别名

![](https://s3.2731515.xyz/PicGo/20260812215554ZaIwYc.webp)

注册账号之后点击主页面右上角的邮箱，再点击弹出的 API Keys

![](https://s3.2731515.xyz/PicGo/20260812214600cG87T8.webp)

随意填写名称比如 bitwarden，直接创建 API Key

![](https://s3.2731515.xyz/PicGo/20260812214754opB8sC.webp)

Bitwarden 生成器页面的电子邮箱域名可以不用填写

![](https://s3.2731515.xyz/PicGo/202608122149129n8swk.webp)

测试收信正常

![](https://s3.2731515.xyz/PicGo/20260812215121rT4PJv.webp)

## 7. 总结

| 服务 | 免费限制 | 推荐度 |
| --- | --- | --- |
| Addy.io | 月流量 10MB | 一般 |
| DuckDuckGo | 无限别名、无流量限制 | 首选推荐 |
| Fastmail | 无免费版 | 不推荐 |
| Forward Email | 只支持自有域名 | 不推荐 |
| Firefox Relay | 最多 50 个马甲 | 可选 |
| SimpleLogin | 免费版 10 个别名 | 一般 |

省流：直接用 DuckDuckGo 邮箱最方便