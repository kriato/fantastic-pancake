import * as vscode from "vscode";

const DEBUG = true;
const PRINT_LABEL = "p";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "fantastic-pancake.run",
    () => {
      vscode.window
        .showInputBox({
          prompt: "Method to use",
          placeHolder: "Insert desired method here",
        })
        .then((value) => {
          let desiredCommandStart = "";
          let desiredCommandEnd = "";
          let i = 0; // Used to understand if we are in the last line or not

          if (value === undefined) {
            return;
          }

          if (value === PRINT_LABEL) {
            let language = vscode.window.activeTextEditor?.document.languageId;

            if (language === "c" || language === "cpp") {
              desiredCommandStart = "std::cout << ";
              desiredCommandEnd = " << std::endl;" + "\n";
            } else if (language === "python") {
              desiredCommandStart = "print(";
              desiredCommandEnd = ")\n";
            } else {
              vscode.window.showErrorMessage(
                "Language not supported: " + language
              );
              return;
            }
          } else {
          }

          const activeEditor = vscode.window.activeTextEditor;
          if (activeEditor) {
            let cursorRow = activeEditor.selection.active.line;
            let cursorCol = activeEditor.selection.active.character;
            let lineContent = activeEditor.document.lineAt(cursorRow).text;

            if (lineContent.trim().length === 0) {
              vscode.window.showErrorMessage("Empty line");
            }

            if (activeEditor.document.lineCount - 1 !== cursorRow) {
              i = 1;
            }

            let nextLineContent = activeEditor.document.lineAt(
              cursorRow + i
            ).text;
            let currentLineCursor =
              lineContent.length - lineContent.trimStart().length;
            // let currentLineOffset = " ".repeat(currentLineCursor);
            let nextLineCursor =
              nextLineContent.length - nextLineContent.trimStart().length;
            let nextLineOffset = " ".repeat(nextLineCursor);

            var splitted = lineContent.split(" ");
            let word = "";
            let currLength = 0;
            let beginCol = 0;

            for (let i = 0; i < splitted.length; i++) {
              currLength += splitted[i].length + 1;
              if (currLength > cursorCol) {
                word = splitted[i];
                beginCol = currLength - splitted[i].length - 1;
                break;
              }
            }
            let initialOffset = "";
            if (currentLineCursor - nextLineCursor > 0) {
              initialOffset = " ".repeat(
                Math.abs(currentLineCursor - nextLineCursor)
              );
            }
            if (DEBUG) {
              console.log("Split is is: " + splitted);
              console.log("Word is: " + word);
              console.log("next content: " + nextLineContent);
              console.log("Next line cursor is: " + nextLineCursor);
              console.log("current line cursor is: " + currentLineCursor);
              console.log("trim start " + nextLineContent.trimStart().length);
            }

            activeEditor.edit((editBuilder) => {
              if (value === PRINT_LABEL) {
                if (i === 0) {
                  editBuilder.insert(
                    new vscode.Position(cursorRow + 1, nextLineCursor),
                    "\n" +
                      nextLineOffset +
                      desiredCommandStart +
                      word +
                      desiredCommandEnd
                  );
                } else {
                  console.log(nextLineOffset.length);
                  editBuilder.insert(
                    new vscode.Position(cursorRow + 1, nextLineCursor),
                    initialOffset +
                      desiredCommandStart +
                      word +
                      desiredCommandEnd +
                      nextLineOffset
                  );
                }
              } else {
                editBuilder.replace(
                  new vscode.Selection(
                    new vscode.Position(cursorRow, beginCol),
                    new vscode.Position(cursorRow, currLength - 1)
                  ),
                  value + "(" + word + ")"
                );
              }
            });
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
