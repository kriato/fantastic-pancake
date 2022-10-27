import * as vscode from 'vscode';

const DEBUG = true;
const PRINT_LABEL = 'p';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('fantastic-pancake.run', () => {
		
    vscode.window.showInputBox({prompt: 'Method to use', placeHolder: 'Insert desired method here'}).then(value => {
      let desiredCommandStart = '';
      let desiredCommandEnd = '';

      if (value === undefined)
      {
        return;
      }

      if (value === PRINT_LABEL)
      {
        let language = vscode.window.activeTextEditor?.document.languageId;

        if (language === 'c' || language === 'cpp')
        {
          desiredCommandStart = 'std::cout << ';
          desiredCommandEnd = ' << std::endl;' + '\n';
        }
        else if (language === 'python')
        {
          desiredCommandStart = 'print(';
          desiredCommandEnd = ')\n';
        }
        else
        {
          vscode.window.showErrorMessage('Language not supported: ' + language);
        }
      }
      else
      {
        ;
      }
      
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor)
      {
        let cursorRow = activeEditor.selection.active.line;
        let cursorCol = activeEditor.selection.active.character;
        let lineContent = activeEditor.document.lineAt(cursorRow).text;

        if (lineContent.trim().length === 0)
        {
          vscode.window.showErrorMessage('Empty line');
        }

        if ((activeEditor.document.lineCount - 1) === cursorRow)
        {
          vscode.window.showErrorMessage("Don't work on the last line");
        }
        
        // TODO(mpiccinelli): Only call this if you are not on the last line
        let nextLineContent = activeEditor.document.lineAt(cursorRow + 1).text;
        
        let nextLineCursor = nextLineContent.length - nextLineContent.trimStart().length;
        let nextLineOffset = ' '.repeat(nextLineCursor);
        let initialOffset = ' '.repeat(cursorCol - nextLineCursor);
        var splitted = lineContent.split(' ');
        let word = '';
        
        if (DEBUG)
        {
          console.log('Split is is: ' + splitted);
          console.log('Word is: ' + word);
        }

        let currLength = 0;
        let beginCol = 0;
        for (let i = 0; i < splitted.length; i++)
        {
          currLength += splitted[i].length + 1;
          if (currLength > cursorCol) {
            word = splitted[i];
            beginCol = currLength - splitted[i].length - 1;
            break;
          } 
        }
    
        activeEditor.edit(editBuilder => {

          if (value === PRINT_LABEL)
          {
            editBuilder.insert(new vscode.Position(cursorRow + 1, nextLineCursor), initialOffset + desiredCommandStart + word + desiredCommandEnd + nextLineOffset);
          }
          else
          {
            editBuilder.replace(new vscode.Selection(new vscode.Position(cursorRow, beginCol), new vscode.Position(cursorRow, currLength - 1)), value + '(' + word + ')');
          }
        });
      }
  
    });
  
  
  });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
