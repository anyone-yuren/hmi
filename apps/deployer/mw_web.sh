#!/bin/bash

# 判断 ~/Download 目录是否存在
if [ -d ~/Download ]; then
  echo "目录 ~/Download 存在，继续执行..."

  # 复制 dist.zip 文件到 /var/www/html
  echo mw123 | sudo -S cp ~/Download/dist.zip /var/www/html

  # 切换到目标目录
  cd /var/www/html || { echo "切换目录失败"; exit 1; }

  # 解压 dist.zip 文件
  echo mw123 | sudo -S unzip -o dist.zip

  echo "解压&更新成功！"
else
  echo "错误：目录 ~/Download 不存在，请检查路径！"
  exit 1
fi