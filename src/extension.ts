// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var mdContents = require(__dirname + '/md-contents.js')
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	let addNoNav = vscode.commands.registerCommand('md-contents.add-noNav', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;		
		
		if (editor) {
			let document = editor.document;
			let contents = document.getText();
			try {
				var newDocument = mdContents.add(contents);
			} catch (err) {
				vscode.window.showErrorMessage(err.message);
			}
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(contents.length)
			);
			editor.edit(editBuilder => {
				editBuilder.replace(fullRange, newDocument);
			});
			
			contents = ""
			
		}		
	});

	context.subscriptions.push(addNoNav);

	let addNav = vscode.commands.registerCommand('md-contents.add-nav', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;		
		
		if (editor) {
			let document = editor.document;
			let contents = document.getText();
			try {
				var newDocument = mdContents.add(contents, true);
			} catch (err) {
				vscode.window.showErrorMessage(err.message);
			}
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(contents.length)
			);
			editor.edit(editBuilder => {
				editBuilder.replace(fullRange, newDocument);
			});

		}		
	});

	context.subscriptions.push(addNav);

	let removeNoNav = vscode.commands.registerCommand('md-contents.remove-noNav', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;		
		
		if (editor) {
			let document = editor.document;
			let contents = document.getText();
			try {
				var newDocument = mdContents.remove(contents);
			} catch (err) {
				vscode.window.showErrorMessage(err.message);
			}
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(contents.length)
			);
			editor.edit(editBuilder => {
				editBuilder.replace(fullRange, newDocument);
			});

		}		
	});

	context.subscriptions.push(removeNoNav);

	let removeNav = vscode.commands.registerCommand('md-contents.remove-nav', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;		
		
		if (editor) {
			let document = editor.document;
			let contents = document.getText();
			try {
				var newDocument = mdContents.remove(contents, true);
			} catch (err) {
				vscode.window.showErrorMessage(err.message);
				return
			}
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(contents.length)
			);
			editor.edit(editBuilder => {
				editBuilder.replace(fullRange, newDocument);
			});

		}		
	});

	context.subscriptions.push(removeNav);
}

// this method is called when your extension is deactivated
export function deactivate() {}
