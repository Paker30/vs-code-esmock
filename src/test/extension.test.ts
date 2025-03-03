import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { importedRegex, splitImportRegex } from '../actions/initTest';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('importedRegex', () => {
		test('import with default and destructuring', () => {
			assert.match("import cheers, { hello, goodbye, greeter, Person } from './other.ts';", importedRegex);
		});

		test('import with destructuring', () => {
			assert.match("import { goodbye, greeter, Person } from './other.ts';", importedRegex);
		});

		test('import default', () => {
			assert.match("import cheers from './other.ts';", importedRegex);
		});
	});

	// suite('splitImportRegex', () => {
		// test('import with default and destructuring', () => {
		// 	assert.ok(new RegExp(splitImportRegex).exec("import cheers, { hello, goodbye, greeter, Person } from './other.ts';"));
		// });

		// test('import with destructuring', () => {
		// 	assert.ok(new RegExp(splitImportRegex).test("import { goodbye, greeter, Person } from './other.ts';"));
		// });

		// test('import default', () => {
		// 	assert.ok(new RegExp(splitImportRegex).test("import cheers from './other.ts';"));
		// });
	// });
});
