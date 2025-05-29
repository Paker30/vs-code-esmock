import * as assert from 'assert';
import sinon from 'sinon';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { importedRegex, splitImportRegex, generateCode, writeTest } from '../actions/initTest';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('importedRegex', () => {
		test('import with default and destructuring', () => {
			assert.match("import cheers, { hello, goodbye, greeter, Person } from './other.ts';", new RegExp(importedRegex));
		});

		test('import with destructuring', () => {
			assert.match("import { goodbye, greeter, Person } from './other.ts';", new RegExp(importedRegex));
		});

		test('import default', () => {
			assert.match("import cheers from './other.ts';", new RegExp(importedRegex));
		});
	});

	suite('splitImportRegex', () => {
		test('import with default and destructuring', () => {
			assert.match(("import cheers, { hello, goodbye, greeter, Person } from './other.ts';"), new RegExp(splitImportRegex));
		});

		test('import with destructuring', () => {
			assert.match(("import { goodbye, greeter, Person } from './other.ts';"), new RegExp(splitImportRegex));
		});

		test('import default', () => {
			assert.match(("import cheers from './other.ts';"), new RegExp(splitImportRegex));
		});
	});

	suite('generateCode', () => {
		const fakePath = 'utils';
		test('import default', () => {
			const [createdCode] = generateCode(fakePath)('import cheers from \'./utils.ts\';')!;
			assert.equal(createdCode.replace('\\', '/'), "'../utils.ts': { default: mock.fn()}");
		});
		test('import with destructuring', () => {
			const [createdCode] = generateCode(fakePath)("import { goodbye, greeter, Person } from './utils.ts';")!;
			assert.equal(createdCode.replace('\\', '/'), "'../utils.ts': {  goodbye: mock.fn(), greeter: mock.fn(), Person : mock.fn()}");
		});
		test('import with default and destructuring', () => {
			const [createdCode] = generateCode(fakePath)("import cheers, { hello, goodbye, greeter, Person } from './utils.ts';")!;
			assert.equal(createdCode.replace('\\', '/'), "'../utils.ts': { default: mock.fn(), hello: mock.fn(), goodbye: mock.fn(), greeter: mock.fn(), Person : mock.fn()}");
		});
		test('import with relative path (#src/...)', () => {
			const [createdCode] = generateCode(fakePath)("import cheers, { hello, goodbye, greeter, Person } from '#src/utils.ts';")!;
			assert.equal(createdCode.replace('\\', '/'), "'#src/utils.ts': { default: mock.fn(), hello: mock.fn(), goodbye: mock.fn(), greeter: mock.fn(), Person : mock.fn()}");
		});
	});

	suite('writeTest', () => {
		const fakeInsert = sinon.stub();
		const fakeEditBuilder = {
			insert: fakeInsert
		} as unknown as vscode.TextEditorEdit;

		const fakeEditor = {
			selection: {
				active: {
					line: 0,
					character: 0
				}
			}
		} as unknown as vscode.TextEditor;

		test('check inserted code', () => {
			writeTest({ editor: fakeEditor as any, pathTo: '', mockedImports: [] })(fakeEditBuilder);
			sinon.assert.callCount(fakeInsert, 4);
		});

	});
});
