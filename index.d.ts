import * as vueCodeLinkServer from './dist/server';
export { vueCodeLinkServer, };

export default class CodeLinkPlugin {
  htmlWebpackPlugin: any;
  constructor(htmlWebpackPlugin: any);
  apply (compiler: any): void;
}

export default function addLocationLoader (source: string): string;

export declare function devServerMiddleware (devServer: any): void;
