let templateIndex = 0; // template 标识，用于判断代码是否在template内，限制只处理tempalte下的代码
let isTemplateEnd = false;
let isInComment = false; // 是否处于注释中

/** RegExps */
const REGEXP_COMMENT_BEGIN = /<\![-]{2,}/;
const REGEXP_COMMENT_END = /[-]{2,}>/;
const REGEXP_TAG_AND_TEMPLATE_END = /(<[\w-]+)|(<\/template)|(template\s+\/>)/g;
const REGEXP_TEMPLATE_END = /(<\/template)|(template\s+\/>)/;

function sourceCodeChange(source: any, resourcePath: string) {
    const projectPath = __dirname.substring(0, __dirname.search('node_modules'));

    resourcePath = resourcePath && resourcePath.substring(projectPath.length); // vue代码相对路径

    return codeLineTrack(source, resourcePath);
}

function codeLineTrack(str: string, resourcePath: string) {
    let lineList = str.split("\n");

    for (let [index, line] of lineList.entries()) {
        if (isTemplateEnd) break;
        lineList[index] = addLineAttr(line, index + 1, resourcePath); // 添加位置属性，index+1为具体的代码行号
    }

    /** 变量重置 */
    templateIndex = 0;
    isTemplateEnd = false;
    isInComment = false;

    return lineList.join("\n");
}

function addLineAttr(lineStr: string, lineNo: number, resourcePath: string) {
    /** 处理注释 */
    const isCommentBegin = REGEXP_COMMENT_BEGIN.test(lineStr);
    const isCommentEnd = REGEXP_COMMENT_END.test(lineStr)
    if (isCommentBegin) isInComment = true;
    if (isCommentEnd) isInComment = false;

    if (isInComment || (isCommentBegin && isCommentEnd)) return lineStr;

    let leftTagList = lineStr.match(REGEXP_TAG_AND_TEMPLATE_END);

    if (leftTagList) {
        leftTagList = Array.from(new Set(leftTagList));
        leftTagList.forEach((item) => {
            if (item && '<template' === item) {
                templateIndex += 1;
            }

            if (item && REGEXP_TEMPLATE_END.test(item)) {
                templateIndex -= 1;

                if (templateIndex <= 0) isTemplateEnd = true; // 只处理 template
            }

            if (templateIndex > 0 && item && item.indexOf("template") === -1) {
                let regx = new RegExp(`${item}`, "g");
                let location = `${item} c-loc="${resourcePath}:${lineNo}"`;

                lineStr = lineStr.replace(regx, location);
            }
        });
    }

    return lineStr;
}

// 移除自定义块
function removeCustomBlock(source: string, blocks: string[]) {
    for (const block of blocks) {
        source = source.replace(new RegExp(`<${block}>`, 'g'), `<!-- <${block}>`)
            .replace(new RegExp(`</${block}>`, 'g'), `</${block}> -->`);
    }

    return source;
}

export default function addLocationLoader(source: string) {
    // @ts-ignore
    const { getOptions, resourcePath } = this as any;

    // 根据 getOptions 来判断是否是 webpack5
    // 如果是 webpack5 则执行下面的 if
    if(getOptions) {
        const { stopIgnore, ignoreReg, removeBlockReg } = getOptions();

        // 有些自定义块需要移除，否则会影响代码解析
        if (removeBlockReg.test(resourcePath)) {
            source = removeCustomBlock(source, ['name', 'doc']);
        }

        if (!stopIgnore && ignoreReg.test(resourcePath)) return source;
    }

    // webpack4 则直接返回
    return sourceCodeChange(source, resourcePath);
};
