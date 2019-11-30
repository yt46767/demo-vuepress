<div align=center><img src="./projectLogo.jpg" width="300" height="300"/></div>

#  开始使用
## 开发
```
npm run dev
```

## 打包
```
npm run build
```

<br/>

# 实现自动化
+ Gh-pages部署自动化
    + 发布到gh-pages
    ```
    npm run publish
    ```
    注：window系统，请使用git-bash执行。如果你是使用vscode，可以参考[设置terminal运行程序](https://yt46767.github.io/my-blog-vuepress/1_%E5%89%8D%E7%AB%AF/4_%E5%B7%A5%E5%85%B7%E9%93%BE/1_GIT/)

<br/>

+ Git提交自动化
    + 命令说明：
    命令|描述
    -|-|        
    --l|提交日志内容           
    --b|创建分支 
    + 示例：
        + 创建分支feature/log，并提交代码到这个分支，提交内容是完善git.sh
        ```
        npm run git --b "feature/log" --l "完善git.sh"
        ```
        + 提交代码到当前分支，提交内容是完善git.sh
        ```
        npm run git --l "完善git.sh"
        ```

# 参考
+ Git常见操作
    + 切换分支
    ```
    git checkout master
    ```
    + 把分支feature/log合并当前分支
    ```
    git merge feature/log
    ```
    + 缓存区取消
    ```
    git reset HEAD
    ```
    + 把全部更改的文件都取消
    ```
    git reset --hard HEAD
    ```