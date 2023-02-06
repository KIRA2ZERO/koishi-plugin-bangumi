# koishi-plugin-bangumi

[![npm](https://img.shields.io/npm/v/koishi-plugin-bangumi?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-bangumi)

获取bangumi的排行榜信息

# 指令：bangumi

+ 基本语法：`bangumi <category:string>`
+ 别名： `番组计划`
+ 选项列表：
    + `page -p <page:posint> 设置检索页数,默认值:第1页 `
    + `time -t <time:posint> 设置检索时间,默认值:''`
+ 用法：`category 的可选参数有(动画、书籍、音乐、游戏、三次元)`
+ 注意事项：`确保输入的参数在参数列表中且已知在返回图片模式下使用【bangumi 动画】会失败`
+ 示例：`bangumi 动画 -t 2011 -p 1`
