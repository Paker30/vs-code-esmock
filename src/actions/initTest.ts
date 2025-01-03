import * as vscode from 'vscode';

export const initTest = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }
    editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, 'import { strict } from \'esmock\';\n');
        editBuilder.insert(editor.selection.active, 'import assert from \'node:assert/strict\';\n');
        editBuilder.insert(editor.selection.active, 'import { describe, test } from \'node:test\';\n');
        editBuilder.insert(editor.selection.active, 'describe(\'your first describe\', () =>{\ntest(\'your first test\', () =>{\nassert.equal(1, 1);});});');
    });
};
