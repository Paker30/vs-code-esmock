import * as vscode from 'vscode';
import { dirname, relative } from 'node:path';

const formatPath = (path: string) => path.includes('/') ? path : `./${path}`;

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
    editor.edit(editBuilder => {
        const pathTo = relative(dirname(vscode.window.activeTextEditor!.document.uri.fsPath), targetFile[0].fsPath);
        editBuilder.insert(editor.selection.active, 'import esmock from \'esmock\';\n');
        editBuilder.insert(editor.selection.active, 'import assert from \'node:assert/strict\';\n');
        editBuilder.insert(editor.selection.active, 'import { describe, test } from \'node:test\';\n');
        editBuilder.insert(editor.selection.active, `describe(\'your first describe\', async() =>{\nconst f = await esmock.strict('${formatPath(pathTo)}', {}, {});\ntest(\'your first test\', () =>{\nassert.equal(1, 1);});});`);
    });
};
