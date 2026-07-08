---
author: miuo
pubDatetime: 2026-06-29T00:00:00+08:00
title: 为 Artalk 接入 Resend 发信服务与自定义模板方案
featured: false
draft: false
tags:
  - Artalk
  - Resend
  - 邮件
  - SMTP
description: 使用 Resend 为 Artalk 评论系统配置邮件通知，并自定义发信模板的完整方案。
---

目前评论区收到评论之后不会通知，传统的 SMTP（如 QQ 邮箱，网易邮箱）又不个性化，自己的 `noreply@yourdomain.com` 邮箱通知，我认为是一个比较好的个性化方案

## 1. 为什么选择 Resend

> **Resend** 是一个专为开发者打造的现代电子邮件发送平台，主要用于发送验证码、订单通知、重置密码等事务性邮件以及营销邮件。它因极佳的开发者体验、现代化的 API 和高送达率，成为了目前独立开发者和 SaaS 团队的首选工具之一

- 首先配置方便，只需要在 [Resend 官网](https://resend.com/)绑定域名，设置一个 API key 即可

- 其次有免费额度，每日发信 100 封，每月 3000 封，发信额度对个人博客来说完全够用

- 最后送达率很高，个人实测除了 Outlook 有时候 Spam，其他邮件基本都能进收件箱

## 2. Resend 配置

### 2.1 添加域名

按图示，填写域名和选择地区，点击 `Add domain`

![Resend 添加域名页面](https://s3.2731515.xyz/PicGo/20260629105759VODizR.webp)

![域名信息填写](https://s3.2731515.xyz/PicGo/20260629105900LjOY8f.webp)

域名托管在 Cloudflare 的话可以自动配置 DNS 记录

![Cloudflare 自动配置 DNS](https://s3.2731515.xyz/PicGo/20260629110027UYeK9X.webp)

之后直接点击授权，等待 DNS 传播

![DNS 授权页面](https://s3.2731515.xyz/PicGo/20260629110627j19JTL.webp)

### 2.2 发信 API 设置

添加 API key

![Resend API key 创建页面](https://s3.2731515.xyz/PicGo/202606291116481WZ18P.webp)

根据最小权限原则可以选择仅发送权限，Name 随便写，域名选择想发信的域名

![API key 权限选择](https://s3.2731515.xyz/PicGo/20260629111900xi1kDa.webp)

因为 API key 只会出现一次，所以可以记到记事本里，之后还会用到。至此需要 Resend 的步骤全部配置完毕

## 3. Artalk 后台配置

- 勾选启用邮件通知
- 发送方式填 smtp
- 发信人昵称填 `{{reply_nick}}`
- 发信人地址填 `noreply@yourdomain.com`
- 邮件标题填 `[{{site_name}}] 您收到了来自 @{{reply_nick}} 的回复`
- 邮件模板文件可以先填 `./data/custom_email.html`，后面再在服务器里创建`custom_email.html` 模板文件

![Artalk 后台邮件配置界面](https://s3.2731515.xyz/PicGo/20260629112513H2Etgc.webp)

## 4. SMTP 设置

- 发信地址填 `smtp.resend.com`
- 发件端口可以填 `465`，如果要使用加密 / TLS 连接，可以用 `2465`，`587` 和 `2587` 端口
- 用户名必须填 `resend`
- 密码填上面申请保存到记事本的 API key
- **最后记得一定要点应用按钮**

![Artalk SMTP 设置界面](https://s3.2731515.xyz/PicGo/20260629113654cyKoZy.webp)

## 5. 发信模板

在 Artalk 的 data 文件夹里创建 `custom_email.html` 文件

填入以下内容：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮件通知</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            font-size: 18px;
            color: #333333;
            margin-top: 0;
        }
        .content p {
            font-size: 14px;
            color: #555555;
        }
        .content a {
            color: #007bff;
            text-decoration: none;
        }
        .comment {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .comment .author {
            font-weight: bold;
            color: #333333;
        }
        .comment .text {
            margin-top: 10px;
            color: #555555;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f4f4f4;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
            color: #888888;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>您有新的回复</h1>
        </div>
        <div class="content">
            <h2>Hi, {{nick}}!</h2>
            <p>您在 <a href="{{page_url}}" target="_blank">{{page_title}}</a> 上的留言有人回复了。</p>
            <div class="comment">
                <div class="author">您曾经的评论：</div>
                <div class="text">{{content}}</div>
            </div>
            <div class="comment">
                <div class="author">{{reply_nick}} 回复您：</div>
                <div class="text">{{reply_content}}</div>
            </div>
            <p>点击 <a href="{{link_to_reply}}" target="_blank">这里</a> 前往站点查看完整回复。</p>
        </div>
        <div class="footer">
            <p>本邮件为系统自动发送，请勿直接回复。</p>
            <p>Copyright © 2026 <a href="https://miuo.me" target="_blank">miuo</a></p>
        </div>
    </div>
</body>
</html>
```

## 6. 通知效果展示

![邮件通知效果展示](https://s3.2731515.xyz/PicGo/20260629114332FddthA.webp)

配置完收工，之后有人评论就能收到好看的邮件通知了
