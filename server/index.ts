import * as child_process from 'child_process';

// 打开文件
function openCodeFile(path: string) {
    const projectPath = __dirname.substring(0, __dirname.search('node_modules'));
    let filePath = projectPath + path;

    child_process.exec(`code -r -g ${filePath}`)
}

export function devServerMiddleware(devServer: any) {
    // 如果是webpack4，第一个参数是app
    if(devServer.app) {
        devServer = devServer.app
    }

    devServer.get('/vue-code-link', (req: any, res: any) => {
        res.send('successfully receive request');

        // 执行vscode定位代码行命令
        if (req.query.filePath) openCodeFile(req.query.filePath);
    });
};
