import * as vscode from 'vscode';
import { dirname, relative } from 'node:path';

const formatPath = (path: string) => path.includes('/') ? path : `./${path}`;
export const importedRegex = /import\s+(?:{[^{}]+}|.*?)\s*(?:from)?\s*['"].*?['"];/g;
export const splitImportRegex = /import\s+(?:(\w+)\s*,?\s*)?(?:{([^}]+)})?\s+from\s+['"]([^'"]+)['"]/g;

const identity = <T>(arg: T): T => arg;

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
        .then((content) => {
            return content.match(importedRegex)
                ?.map((line) => new RegExp(splitImportRegex).exec(line))
                .map((importedContent) => {
                    const path = importedContent?.pop();
                    const [defaultImport, imports] = importedContent?.slice(1)!;
                    const mockedFunctions = [defaultImport ? 'default' : defaultImport, ...imports.split(',')]
                        .filter(identity)
                        .map((fn) => `${fn}: () => {}`);
                    return `'${path}': { ${mockedFunctions?.join(',')}}`;
                });
        });
    editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, 'import esmock from \'esmock\';\n');
        editBuilder.insert(editor.selection.active, 'import assert from \'node:assert/strict\';\n');
        editBuilder.insert(editor.selection.active, 'import { describe, mock, test } from \'node:test\';\n');
        editBuilder.insert(editor.selection.active,
            `describe(\'your first describe\',async() =>{
                    const f = await esmock.strict('${formatPath(pathTo)}', {${mockedImports?.join(',')}}, {});
                    test(\'your first test\', () =>{
                        assert.equal(1, 1);
                    });
            });`);
    });
};
