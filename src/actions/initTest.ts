import * as vscode from 'vscode';
import { dirname, relative } from 'node:path';

const formatPath = (path: string) => path.includes('/') ? path : `./${path}`;
export const importedRegex = /import\s+(?:{[^{}]+}|.*?)\s*(?:from)?\s*['"].*?['"];?/g;
export const splitImportRegex = /import\s+([\w$]+)?(?:,?\s*{([^}]*)})?\s*from\s*['"]([^'"]+)['"];?/g;
export const typeRegex = /\s*?type\s*(\w*)/gm;
export const importPath = /#\w*/gm;

const identity = <T>(arg: T): T => arg;

export const writeTest = ({
    editor,
    pathTo,
    mockedImports
}: {
    editor: vscode.TextEditor,
    pathTo: string;
    mockedImports: string[] | undefined
}) => (editBuilder: vscode.TextEditorEdit) => {

    editBuilder.insert(editor.selection.active, 'import esmock from \'esmock\';\n');
    editBuilder.insert(editor.selection.active, 'import assert from \'node:assert/strict\';\n');
    editBuilder.insert(editor.selection.active, 'import { describe, mock, test } from \'node:test\';\n');
    editBuilder.insert(editor.selection.active,
        `describe(\'your first describe\',async() =>{
                const f = await esmock.strict('${pathTo}', {${mockedImports?.join(',')}}, {});
                test(\'your first test\', () =>{
                    assert.equal(1, 1);
                });
        });`);

};

export const generateCode = (pathTo: string) => (content: string) => {
    return content.match(importedRegex)
        ?.map((line) => new RegExp(splitImportRegex).exec(line))
        .map((importedContent) => {
            const path = importedContent?.pop();
            const [_, defaultImport, imports = ''] = importedContent!;
            const mockedFunctions = [defaultImport ? 'default' : defaultImport, ...imports.split(',')]
                .filter(identity)
                .map((imp) => new RegExp(typeRegex).test(imp) ? new RegExp(typeRegex).exec(imp)![1] : imp)
                .map((fn) => `${fn}: mock.fn()`);

            const relativePath = new RegExp(importPath).test(path!) ? path! : relative(pathTo, path!);
            return `'${relativePath}': { ${mockedFunctions?.join(',')}}`;
        });
};

export const initTest = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }
    const targetFile = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false
    });
    if (!targetFile || targetFile.length === 0) {
        return;
    }
    const pathTo = relative(dirname(vscode.window.activeTextEditor!.document.uri.fsPath), targetFile[0].fsPath);
    const mockedImports = await vscode.workspace.fs.readFile(targetFile[0])
        .then((readData) => Buffer.from(readData).toString('utf8'))
        .then(generateCode(pathTo));
    editor.edit(writeTest({ editor, pathTo: formatPath(pathTo), mockedImports }));
};
