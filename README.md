![Animation](https://user-images.githubusercontent.com/62974111/174468768-dcacbfaa-3565-4608-bbb3-9a1b81da4ff0.gif)
# 通过 `shift + 鼠标左键` 点击页面元素,快速在 VSCode 中定位代码位置

## 使用

`shift + 鼠标左键` 点击页面元素即可

## 引入

1. 私有云引入

    vue-code-link 已经集成到 @qys/cli 的 vue-code-link 分支，可以通过修改 package.json 中 @qys/cli 的包地址引入
    ```json
    "@qys/cli": "git+https://git.qiyuesuo.me/scm/winf/cli.git#vue-code-link",
    ```  
    目前 beta/4.3.x 分支，已经默认修改，可以通过重装依赖启用该工具。

2. 其他项目引入

    1、安装依赖

    ```cmd
    npm install -D vue-code-link@git+https://git.qiyuesuo.me/scm/winf/vue-code-link.git
    ```

    2、服务注入到 WebpackDevServer

    ```js
    // import
    import { vueCodeLinkServer } from 'vue-code-link';

    // 通过 setupMiddlewares 添加 vue-code-link 服务配置到 devServer
    {
        setupMiddlewares: (middlewares, devServer) => {
            vueCodeLinkServer.devServerMiddleware(devServer);

            return middlewares;
        }
    }
    ```

    3、添加 add-location-loader

    ```js
    // WARNING：只能用在**开发环境**，不要用在生产环境
    // 该 loader 需要在 vue-loader 之前使用
    {
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    exclude: /node_modules(?![/|\\]@qys[/|\\])|src[/|\\]components|src[/|\\]packages/,
                    use: [
                        require.resolve('vue-code-link/add-location-loader'),
                    ],
                }
            ]
        }
    }
    ```
    4、添加 CodeLinkPlugin
    ```js
    import { CodeLinkPlugin } from 'vue-code-link'
    {
        // ... 省略代码
        plugins: [
            ...(isProduction ? [] : [new CodeLinkPlugin(require('html-webpack-plugin'))])     
        ]
        // ... 省略代码
    }
    ```
    
## VSCode 的 code 命令

1. VSCode 的定位功能是基于 VSCode 的 `code 命令`实现的，所以请确认 code 命令是否有效（cmd 或 shell 里直接执行 code）

2. 若 code 命令找不到请如下操作:

    1、方案 1

    使用 command + shift + p (注意 window 下使用 ctrl + shift + p ) 然后搜索 code，选择 install 'code' command in path。

    2、方案 2

    手动将 code 命令的路径添加到环境变量中

## 注意事项

1. 插件在开发环境启用，不会对生产环境造成任何影响
2. 暂时只支持vue + webpack + VSCode
3. 代码定位精确到行
4. 该项目借鉴了一位前端大佬的文章，[文章链接](https://mp.weixin.qq.com/s/AZQTK_lk8BxxWZCDU5P_Yg)。文章里有详细的设计思路和代码片段。
5. qys 的实现基于 @linzhinan/vue-code-link，稍加改造。

### 问题记录

1. scripts 配置了 `prepare`，线上拉取仓库的时候拉不到 index.js。

    原因： npm 出于安全考虑不支持以 root 用户运行，即使用 root 用户身份运行了，npm 会自动转成一个叫 nobody 的用户来运行，而这个用户几乎没有任何权限。这样的话如果你脚本里有一些需要权限的操作，比如写文件（尤其是写 /root/.node-gyp），就会崩掉了。

    解决方法：添加 `.npmrc` 文件，添加 `unsafe-perm = true` 配置

