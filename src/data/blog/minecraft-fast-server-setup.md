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

放行 `23333` 和 `24444` 端口，`25565` 是 Java 默认联机端口。如果配置了 UFW 也要放行：

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

网络允许的话选择需要的版本下载即可。由于我是服务器没有代理，所以手动安装。

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

`Xms` 和 `Xmx` 根据服务器内存自行替换，建议两者设相同。其他全部不用动。

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

### 4.2 修改 `paper-global.yml`

**漏斗优化** — 找到 `hopper:` 这一大类，把 `false` 改成 `true`：

```yaml
hopper:
  cooldown-when-full: true
  disable-move-event: true
  ignore-occluding-blocks: false
```

> [!note]
> `disable-move-event: true` 会影响依赖漏斗物品检测的 redstone 机器，生电玩家建议保持 `false`，普通生存无影响。

**实体碰撞上限** — 找到 `collisions:` 这一大类，把 `8` 改成 `4`：

```yaml
collisions:
  allow-player-cramming-damage: false
  allow-vehicle-collisions: true
  fix-climbing-bypassing-cramming-rule: false
  max-entity-collisions: 4
  only-players-collide: false
```

**爆炸优化** — 找到 `environment:` 这一大类，开启优化：

```yaml
environment:
  nether-ceiling-void-damage-height: disabled
  optimize-explosions: true
  portal-create-radius: 16
```

**限制掉落物** — 找到 `chunks:` 类，`-1` 代表无限制，改成 `16`：

```yaml
chunks:
  auto-save-interval: default
  delay-chunk-unloads-by: 10s
  entity-per-chunk-save-limit:
    arrow: 16
    ender_pearl: -1
    experience_orb: 16
    fireball: -1
```

## 5. 插件推荐

### Chunky

<https://modrinth.com/plugin/chunky>

可以预渲染地图存到硬盘，防止跑图卡顿。

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
