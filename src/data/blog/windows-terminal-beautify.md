---
author: miuo
pubDatetime: 2026-07-04T00:00:00+08:00
modDatetime: 2026-07-04T00:00:00+08:00
title: Windows 终端美化
featured: false
draft: false
tags:
  - Windows
  - Terminal
  - PowerShell
  - Scoop
  - Fastfetch
description: 基于 YouTube 教程改进，使用 scoop 安装 JetBrainsMono Nerd Font、Fastfetch、chafa 等工具美化 Windows 终端。
---

> 本教程基于 [YouTube: Your Terminal is Boring… Fix It](https://www.youtube.com/watch?v=z3NpVq-y6jU) 改进，所有工具均通过 scoop 安装。

因为有轻量预览 Markdown 文件的需求，准备尝试一下 Neovim，发现默认样式很丑。接着看 Windows 默认的 PowerShell 也不顺眼，顺便一起改了。

![](https://s3.2731515.xyz/PicGo/20260704171443qID1HK.webp)

## 1. 字体基础配置

所有美化前提是拥有一款支持 Nerd Font 的字体，才能正确渲染图标。

```powershell
scoop bucket add nerd-fonts
scoop install JetBrainsMono-NF
```

Windows Terminal 中设置 `JetBrainsMonoNL Nerd Font`，并在 JSON 配置中将 `cellHeight` 设为 `1.2`。

## 2. Windows Terminal 界面美化

`Ctrl + ,` 打开设置，编辑 `settings.json`：

```json
{
    "$help": "https://aka.ms/terminal-documentation",
    "$schema": "https://aka.ms/terminal-profiles-schema",
    "actions": [
        {
            "command": {
                "action": "copy",
                "singleLine": false
            },
            "id": "User.copy.644BA8F2"
        },
        {
            "command": "paste",
            "id": "User.paste"
        },
        {
            "command": "find",
            "id": "User.find"
        },
        {
            "command": {
                "action": "splitPane",
                "split": "auto",
                "splitMode": "duplicate"
            },
            "id": "User.splitPane.A6751878"
        }
    ],
    "alwaysOnTop": false,
    "copyFormatting": "none",
    "copyOnSelect": false,
    "defaultProfile": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
    "keybindings": [
        {
            "id": "User.copy.644BA8F2",
            "keys": "ctrl+c"
        },
        {
            "id": "User.find",
            "keys": "ctrl+shift+f"
        },
        {
            "id": "User.paste",
            "keys": "ctrl+v"
        },
        {
            "id": "User.splitPane.A6751878",
            "keys": "alt+shift+d"
        }
    ],
    "newTabMenu": [
        {
            "type": "remainingProfiles"
        }
    ],
    "profiles": {
        "defaults": {
            "colorScheme": "Catppuccin Mocha",
            "cursorShape": "filledBox",
            "experimental.retroTerminalEffect": false,
            "font": {
                "builtinGlyphs": true,
                "cellHeight": "1.2",
                "colorGlyphs": true,
                "face": "JetBrainsMonoNL Nerd Font",
                "size": 10,
                "weight": "extra-black"
            },
            "intenseTextStyle": "all",
            "opacity": 80,
            "padding": "8",
            "useAcrylic": true
        },
        "list": [
            {
                "commandline": "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
                "hidden": false,
                "name": "Windows PowerShell"
            },
            {
                "commandline": "%SystemRoot%\\System32\\cmd.exe",
                "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
                "hidden": false,
                "name": "Command Prompt"
            },
            {
                "guid": "{b453ae62-4e3d-5e58-b989-0a998ec441b8}",
                "hidden": false,
                "name": "Azure Cloud Shell",
                "source": "Windows.Terminal.Azure"
            }
        ]
    },
    "schemes": [
        {
            "background": "#1E1E2E",
            "black": "#45475A",
            "blue": "#89B4FA",
            "brightBlack": "#585B70",
            "brightBlue": "#89B4FA",
            "brightCyan": "#94E2D5",
            "brightGreen": "#A6E3A1",
            "brightPurple": "#F5C2E7",
            "brightRed": "#F38BA8",
            "brightWhite": "#A6ADC8",
            "brightYellow": "#F9E2AF",
            "cursorColor": "#F5E0DC",
            "cyan": "#94E2D5",
            "foreground": "#CDD6F4",
            "green": "#A6E3A1",
            "name": "Catppuccin Mocha",
            "purple": "#F5C2E7",
            "red": "#F38BA8",
            "selectionBackground": "#585B70",
            "white": "#BAC2DE",
            "yellow": "#F9E2AF"
        },
        {
            "background": "#000000",
            "black": "#0C0C0C",
            "blue": "#0037DA",
            "brightBlack": "#767676",
            "brightBlue": "#3B78FF",
            "brightCyan": "#61D6D6",
            "brightGreen": "#16C60C",
            "brightPurple": "#B4009E",
            "brightRed": "#E74856",
            "brightWhite": "#F2F2F2",
            "brightYellow": "#F9F1A5",
            "cursorColor": "#FFFFFF",
            "cyan": "#3A96DD",
            "foreground": "#FFFFFF",
            "green": "#13A10E",
            "name": "Color Scheme 15",
            "purple": "#881798",
            "red": "#C50F1F",
            "selectionBackground": "#FFFFFF",
            "white": "#CCCCCC",
            "yellow": "#C19C00"
        },
        {
            "background": "#282A36",
            "black": "#21222C",
            "blue": "#BD93F9",
            "brightBlack": "#6272A4",
            "brightBlue": "#D6ACFF",
            "brightCyan": "#A4FFFF",
            "brightGreen": "#69FF94",
            "brightPurple": "#FF92DF",
            "brightRed": "#FF6E6E",
            "brightWhite": "#FFFFFF",
            "brightYellow": "#FFFFA5",
            "cursorColor": "#F8F8F2",
            "cyan": "#8BE9FD",
            "foreground": "#F8F8F2",
            "green": "#50FA7B",
            "name": "Dracula",
            "purple": "#FF79C6",
            "red": "#FF5555",
            "selectionBackground": "#44475A",
            "white": "#F8F8F2",
            "yellow": "#F1FA8C"
        }
    ],
    "tabWidthMode": "titleLength",
    "themes": [],
    "useAcrylicInTabRow": true
}
```

## 3. PowerShell 配置文件

`$PROFILE` 查看 PowerShell 配置文件路径。

如果文件夹为空，执行：

```powershell
New-Item -Path $profile.CurrentUserAllHosts -Type File -Force
```

编辑 `profile.ps1`：

```powershell
# Minimal profile: UTF‑8 + Oh My Posh (if installed) + Fastfetch with explicit config path
try {
    [Console]::InputEncoding  = [System.Text.Encoding]::UTF8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    chcp 65001 > $null
} catch {}

Clear-Host

# Force Fastfetch to use YOUR config every time (bypass path confusion)
if (Get-Command fastfetch -ErrorAction SilentlyContinue) {
    fastfetch -c "C:/Users/Sakura/.config/fastfetch/config.jsonc"
}
```

## 4. [Fastfetch](https://github.com/fastfetch-cli/fastfetch)

系统信息展示工具，类似 Neofetch，每次打开终端时显示系统概览。

```powershell
scoop install fastfetch
```

创建 `C:\Users\Sakura\.config\fastfetch\`，目录下放两个文件。

`config.jsonc`：

```jsonc
{
  "$schema": "https://github.com/fastfetch-cli/fastfetch/raw/dev/doc/json_schema.json",
  "logo": {
    "type": "file",
    "source": "C:/Users/Sakura/.config/fastfetch/ascii.txt",
    "color": {
      "1": "#F5E0DC",
      "2": "#F2CDCD",
      "3": "#F5C2E7",
      "4": "#FAB387",
      "5": "#F9E2AF",
      "6": "#A6E3A1",
      "7": "#94E2D5",
      "8": "#89DCEB",
      "9": "#74C7EC"
    },
    "padding": {
      "top": 1,
      "right": 3
    }
  },
  "display": {
    "separator": " "
  },
  "modules": [
    "break",
    {
      "type": "title",
      "color": {
        "user": "#F5C2E7",
        "at": "#CDD6F4",
        "host": "#89DCEB"
      }
    },
    "break",
    {
      "type": "os",
      "key": "",
      "keyColor": "#89DCEB"
    },
    {
      "type": "cpu",
      "key": "",
      "keyColor": "#F5C2E7"
    },
    {
      "type": "board",
      "key": "󰚗",
      "keyColor": "#FAB387"
    },
    {
      "type": "memory",
      "key": "",
      "keyColor": "#A6E3A1",
      "format": "{used} / {total} ({percentage})"
    },
    {
      "type": "disk",
      "key": "",
      "keyColor": "#94E2D5"
    },
    "break",
    {
      "type": "colors",
      "symbol": "circle"
    }
  ]
}
```

`ascii.txt` 放 ASCII 字符画，我的字符画效果见开头的截图，具体文件在 [dotfiles/fastfetch/ascii.txt](https://github.com/mistn/dotfiles/blob/master/fastfetch/ascii.txt)。

记得把路径里的 `Sakura` 改成你的用户名。

## 5. [chafa](https://github.com/hpjansson/chafa) 字符画

将图片转换为 ANSI 字符画，用来生成 Fastfetch 的 ASCII logo。

```powershell
scoop install chafa
```

将图片转换为 ANSI 字符画：

```powershell
cmd /c 'chafa --size 40x20 --colors full --symbols block "C:\图片路径\xxx.jpg" > "C:\Users\Sakura\.config\fastfetch\ascii.txt"'
```

PowerShell 重定向默认使用 Unicode，会导致 ANSI 字符损坏。用 `cmd /c` 走 cmd 的重定向能保持原始字节不变。

## 6. 完整配置

以上所有配置文件均托管在 [mistn/dotfiles](https://github.com/mistn/dotfiles)。
