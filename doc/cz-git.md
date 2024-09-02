# [cz-git](https://cz-git.qbb.sh/zh/guide/)
**目的**
规范化 git 提交
**定位**
工程性更强，轻量级，高度自定义，输出标准格式的 commitizen 适配器和 CLI

## 特点
💪 友好型命令行工具，“懒字优先” ！支持在命令行搜索和选择，减少拼写错误
⚡️ 轻量级，高度自定义, 但输出格式遵循标准的 Angular commit 规范
🔨 更好维护 monorepo 等工程化项目 与 commitlint 配合给予命令行的相关校验信息
✅ 支持在 commit 中添加 emoji ｜ 更好的与issue链接，尤其 gitee
## 使用
- **下载依赖**
```shell
npm install -D cz-git
```
- **修改 package.json 添加 config 指定使用的适配器**
``` json
{
  "scripts": {

  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```
- **添加自定义配置**