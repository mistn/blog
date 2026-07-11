---
author: miuo
pubDatetime: 2026-07-11T00:00:00+08:00
modDatetime: 2026-07-11T00:00:00+08:00
title: Minecraft 最速极简开服指南
featured: false
draft: false
tags:
  - Minecraft
  - 开服
  - MCSManager
  - Paper
  - VPS
description: 基于 MCSManager 面板的 Minecraft 极简开服教程，从面板安装到性能优化与插件配置。
---

## 1. 安装 MCSManager 面板

极简攻略首选面板，推荐 [MCSManager](https://mcsmanager.com/)。

第一步安装 Debian 系统和各种初始化可以参见 [VPS 从零开始](/posts/vps-setup-from-scratch) 这篇文章，不用安装 1Panel 面板以节省性能。

网络允许的话可以用：

```bash
wget -qO- https://script.mcsmanager.com/setup.sh | bash
```

国内网络不允许的话：

```bash
# 1. 回到主目录并临时关闭 wget 证书检查
cd ~
echo "check_certificate = off" > ~/.wgetrc

# 2. 运行国内版一键脚本
wget -qO- https://script.mcsmanager.com/setup_cn.sh | bash

# 3. 安装完成后删除临时规则，保持系统纯净
rm ~/.wgetrc
```

## 2. 放行端口

放行以下端口：

- `23333` — MCSManager 面板 Web 端（访问 `http://你的IP:23333`）
- `24444` — MCSManager 守护进程通信端口（面板与后端之间）
- `25565` — Java 版默认联机端口，玩家连接用

如果配置了 UFW：

```bash
sudo ufw allow 23333/tcp
sudo ufw allow 24444/tcp
sudo ufw allow 25565/tcp
```

查看放行状态确认：

```bash
sudo ufw status
```

如果看到三个端口都显示 `ALLOW Anywhere`，说明系统层面的防火墙已全部放行。

## 3. 创建实例

模板市场直接搜 **Paper**，这个比较轻量。

![](https://s3.2731515.xyz/PicGo/20260711123722h23uPu.webp)
![](https://s3.2731515.xyz/PicGo/202607111238266jy5cJ.webp)

网络允许的话选择需要的版本下载即可。由于我的服务器没有代理，所以手动安装。

举例想玩 26.1.2 版本，先下载对应的 Java 25：

```bash
sudo apt update
sudo apt install openjdk-25-jre-headless -y
```

然后创建实例，选择直接创建。

![](https://s3.2731515.xyz/PicGo/20260711124304vglkNo.webp)

实例名称随意，示例类型选择 **MC Java 版服务器**。

![](https://s3.2731515.xyz/PicGo/20260711124347O01scT.webp)

### 3.1 配置 Java 环境

进入实例信息面板，第一步点 **Java 环境管理**，选择安装好的 Java 25。

![](https://s3.2731515.xyz/PicGo/20260711124545VYMHu2.webp)

名称随意，路径一般是 `/usr/bin/java`，也可以 SSH 输入：

```bash
which java
```

查看 Java 安装路径。

![](https://s3.2731515.xyz/PicGo/20260711124635A0TrHm.webp)

### 3.2 上传 Paper 文件

进入 [Paper 官网](https://papermc.io/)，下载对应版本的 jar 文件。

![](https://s3.2731515.xyz/PicGo/20260711125118qSp7aP.webp)

点击实例信息面板的 **文件管理**，直接把下载好的 paper jar 文件拖入。

接着点击实例信息面板的 **应用示例设置**，启动命令改成：

```bash
java -Xms3500M -Xmx3500M -jar paper-26.1.2-74.jar nogui
```

`Xms` 和 `Xmx` 根据服务器内存自行替换，建议两个设成一样。其他全部不用动。

![](https://s3.2731515.xyz/PicGo/20260711125500E20D8Q.webp)

### 3.3 启动实例

回到控制台点击右上角的 **启动**，会发现刚启动立刻终止。接着点击 **文件管理**，找到 `eula.txt` 文件，把 `eula=false` 改成 `eula=true` 然后保存（Mojang 的最终用户许可协议，改完即表示同意）。

再次点击启动即可。

## 4. 性能优化

### 4.1 修改 `server.properties`

找到并双击打开 `server.properties`，修改以下数值，改完记得点保存：

- `view-distance=6` （视距调低）
- `simulation-distance=6` （模拟距离调低）
- `network-compression-threshold=64` （优化网络包）

### 4.2 修改 `paper-world-defaults.yml`

找到对应字段改成下面的值：

- `hopper.disable-move-event:` `false` → `true`（漏斗优化）
- `collisions.max-entity-collisions:` `8` → `4`（实体碰撞上限）
- `environment.optimize-explosions:` `false` → `true`（爆炸优化）
- `chunks.entity-per-chunk-save-limit.arrow:` `-1` → `16`（限制箭矢堆积）
- `chunks.entity-per-chunk-save-limit.experience_orb:` `-1` → `16`（限制经验球堆积）

> [!note]
> 以上几项均为安全优化，基本不影响普通生存。但对于红石机器、TNT 复制等高精度生电设施可能有影响，生电玩家建议按需保持默认值。

## 5. 插件推荐

### Chunky

<https://modrinth.com/plugin/chunky>

可以预渲染地图存到硬盘，防止跑图卡顿。设置半径 5000 格并开始预生成：

```
chunky radius 5000
chunky start
```

查看进度：

```
chunky progress
```

### AuthMe

<https://github.com/AuthMe/AuthMeReloaded>

负责强制每个人进服时输入密码（`/register` 和 `/login`），防止别人冒充名字进服。

## 6. 常用命令

### 自带白名单

开启白名单功能：

```
whitelist on
```

添加白名单（假设朋友游戏名叫 `steve`）：

```
whitelist add steve
```

查看白名单：

```
whitelist list
```

移除白名单：

```
whitelist remove 名字
```

### 其他

- `server.properties` 里 `online-mode=false` 关闭正版验证，防止朋友进不来
- `op 名字` 设为管理员权限
- 域名加 `25565` 端口进入服务器
