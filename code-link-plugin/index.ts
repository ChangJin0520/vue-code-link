import * as fs from 'fs'
import * as path from 'path'

export default class CodeLinkPlugin {
    htmlWebpackPlugin: any;

    constructor(htmlWebpackPlugin: any) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
    }

    apply(compiler: any) {
        // 把 client 相关样式、逻辑，注入 html 模板中
        compiler.hooks.compilation.tap('CodeLinkPlugin', (compilation: any) => {
            const initScript = fs.readFileSync(path.join(__dirname, '../client/index.js'), 'utf-8');
            const initCss = fs.readFileSync(path.join(__dirname, '../client/css/index.css'), 'utf-8');

            this.htmlWebpackPlugin
                .getHooks(compilation)
                .afterTemplateExecution.tap('CodeLinkPlugin', (data: any) => {
                    data.html = data.html.replace('</head>', `<script>${initScript}\ninit();</script><style>${initCss}</style></head>`);
                });
        });
    };
}
