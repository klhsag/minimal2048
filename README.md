# Minimal 2048

2048 running in your browser console

## 极简版2048

###### 在浏览器控制台上运行的2048！
###### *2048* running in browser console！

####极简运行

- 使用桌面端浏览器（推荐Chrome），F12打开控制台，粘贴源代码，按回车键运行

####兼容性

- Chrome
- Microsoft Edge (recommended)
- otherwise : unknown

####使用帮助

    按键盘方向键(←↑→↓)控制滑动
	按退格键(backspace)可撤销滑动（不能恢复，可无限撤销）
	（注意：编辑状态下并无法响应键盘操作，需要点击浏览器主窗口空白部分来取消）

	高级指令：
	> helpMe()
	 - 显示帮助
	> go2048(X, Y)
     - 开始一局新的2048，大小为X*Y（注意：严重超出常规不保证游戏可靠）
	> back()
	 - 指令方法撤销上一步（不推荐）


#### 其他注意事项

Edge浏览器的新空白标签页并不是一个真正的页面，因此无法运行程序；
360浏览器的默认首页则可能大量往控制台抛垃圾数据；chrome默认没有真正的空白页

建议在搜索引擎等空白较多的简单页面使用（~~或者自己制作一个UI网页？~~）
