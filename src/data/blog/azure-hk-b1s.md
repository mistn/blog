---
author: miuo
pubDatetime: 2026-06-14T00:00:00+08:00
title: Azure HK B1s 1C1G Benchmark
featured: false
draft: false
tags:
  - VPS
  - Azure
  - Benchmark
description: Azure 香港 B1s 1 核 1G 性能基准测试：硬件、IP、网络与回程路由一览。
---

:::: tabs
::: tab-item 💻基本信息
```ansi
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                           硬件质量体检报告：20.2.*.*
                     https://github.com/xykt/HardwareQuality
                     bash <(curl -sL https://Check.Place) -H
             报告时间：2026-06-14 13:29:02 CST  脚本版本：v2026-05-21
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
一、操作系统信息
容器/虚拟化：          Hyper-V 虚拟机
架构：                 x86_64
操作系统/内核：        Debian GNU/Linux 12 (bookworm) 6.1.0-49-cloud-amd64
运行时间：             2 天 17 小时 7 分钟
负载：                 0.36, 0.17, 0.06
进程：                 3 用户，127 进程，20/136 活跃/总服务
区域设置：             C, UTF-8, Etc/UTC UTC +0000
二、主板信息
主板：    Microsoft Corporation, Virtual Machine, 版本Hyper-V UEFI Release v4.1, SN:0000-0011-6033-8894-2975-3313-39
BIOS：    Microsoft Corporation, 版本Hyper-V UEFI Release v4.1
网卡：    02.0 Ethernet controller: Mellanox Technologies MT27710 Family [ConnectX-4 Lx Virtual Function]
三、CPU测评
CPU：     AMD EPYC 7763 64-Core Processor 步进1 (25代) 32/64-bit
            ╚═ 1核心, 2线程, 3243.350MHz, 利用率3%
缓存：    L1d 32 KiB, L1i 32 KiB, L2 512 KiB, L3 32 MiB
指令集：  VT-x/AMD-V  AES-NI  AVX2  BMI1/2  EPT/NPT
Sysbench：单线程 3639.21     多线程 4087.17
GB5基准： J1900 N5105 N100 6700K 9900K 5900X 12900K 14900K 7713 7995WX
GB5单核： |1176
GB5多核： |1423
详细结果：https://browser.geekbench.com/v5/cpu/24378927
五、内存测评
内存：    总容量 853 MB,  已用 328 MB(38%),  可用 526 MB(62%)
交换：    总容量 2.0 GB,  已用 0.4 GB(20%),  可用 1.6 GB(80%)
Sysbench：读取 50028.6 MB/s    写入 28545.5 MB/s    延迟 145 ns
六、硬盘测评
硬盘：    数量 1,  总容量 63G,  已用容量 6.6G(10%),  可用容量 54G(90%)
测试设备：sda1(/r**t) -> DISK
Fio测试： RND4K/Q1    IOPS||RND4K/Q32   IOPS||SEQ1M/Q1    IOPS||SEQ1M/Q8    IOPS
读取：    27.0MB/s    6.9k||36.4MB/s    9.3k||127MB/s       126||126MB/s       126
写入：    11.3MB/s    2.9k||11.6MB/s    3.0k||126MB/s       126||127MB/s       126
七、HQ硬件加权评分
项目：      总 分          CPU           GPU          内 存         硬 盘
分数：      32671     =    18796     +    N/A      +    11398     +    2477
排名：      7.6%          15.2%          N/A          6.4%          8.7%
================================================================================
今日硬件检测量：188；总检测量：93243。感谢使用xy系列脚本！
报告链接：https://Report.Check.Place/hardware/2FBORU7BH.svg
```
:::
::: tab-item 🎬IP质量
```ansi
########################################################################
                        IP质量体检报告：20.2.*.*
                   https://github.com/xykt/IPQuality
                bash <(curl -sL https://Check.Place) -I
        报告时间：2026-06-14 13:34:21 CST  脚本版本：v2026-03-29
########################################################################
一、基础信息（Maxmind 数据库）
自治系统号：            AS8075
组织：                  Microsoft Corporation
坐标：                  114°10′33″E, 22°17′3″N
地图：                  https://check.place/22.2842,114.1759,15,cn
城市：                  N/A, 香港
使用地：                [HK]香港, [AS]亚洲
注册地：                [US]美国
时区：                  Asia/Hong_Kong
IP类型：                 广播IP
二、IP类型属性
数据库：    IPinfo    ipregistry    ipapi    IP2Location   AbuseIPDB
使用类型：    机房       机房       机房       机房       机房
公司类型：    机房       机房       机房       机房
三、风险评分
风险等级：      极低         低      中等     高         极高
IP2Location：   3|低风险
Scamalytics：  0|低风险
ipapi：      0.13%|低风险
AbuseIPDB：    0|低风险
DB-IP：         |低风险
四、风险因子
库： IP2Location ipapi ipregistry IPQS Scamalytics ipdata IPinfo DB-IP
地区：   [HK]    [HK]    [CN]     无    [HK]    [HK]    [HK]    [HK]
代理：    否      否      否      无      否      否      否      否
Tor：     否      否      否      无      否      否      否      无
VPN：     否      否      否      无      否      无      否      无
服务器：  是      是      是      无      是      是      是      无
滥用：    否      否      否      无      否      否      无      否
机器人：  否      否      无      无      否      无      无      否
五、流媒体及AI服务解锁检测
服务商：  TikTok   Disney+  Netflix Youtube  AmazonPV  Reddit   ChatGPT
状态：     解锁     屏蔽     解锁     解锁     解锁     屏蔽     仅APP
地区：    [ALISG]            [HK]     [HK]     [HK]              [HK]
方式：     原生              原生     原生     原生              原生
六、邮局连通性及黑名单检测
本地25端口出站：阻断
通信：远端25端口不可达
IP地址黑名单数据库：  有效 439   正常 401   已标记 38   黑名单 0
========================================================================
今日IP检测量：947；总检测量：1483409。感谢使用xy系列脚本！
报告链接：https://Report.Check.Place/ip/1LTRR2IKH.svg
```
:::
::: tab-item 🌐网络质量
![image](https://img.miuo.me/file/s/VJrPzBpW.webp)
:::
::: tab-item 📍回程路由
![image](https://img.miuo.me/file/s/zVpRmoeX.webp)
:::
::::
