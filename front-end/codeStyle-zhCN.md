## 下载Eslint和Prettier

这两个库已经被加入到 `package.json`中，在

```
npm -install
```

时会自动下载。

## 使用Eslint和Prettier进行代码风格管理

在 `front-end/eslint.config.mjs`和 `front-end/.prettierrc.json`中设置了代码风格规范的文件，可以使用

```
npx eslint <filePath/fileName>
```

来检查是否存在错误，如果报错可以使用

```
npx eslint --fix <filePath/FileName>
```

来通过shell命令自动修复错误。

## 使用Eslint和Prettier插件来实现自动保存时进行格式的修改

在 VS Code 扩展商店中下载 `ESLint`和 `Prettier - Code formatter`。

在 VS Code 的设置中启用

![1718856330985](image/codeStyle-zhCN/1718856330985.png)

然后格式化代码中选择`Prettier - Code formatter`，之后保存时就可以自动格式化代码了。

![1718856372740](image/codeStyle-zhCN/1718856372740.png)
