import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Babel from "@babel/standalone";
import { defaultCode } from "./data";

function App() {
  const [editorCode, setEditorCode] = useState(defaultCode);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    try {
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();

          const editorCodeLines = editorCode.split("\n");

          const editorCodeWithoutImports = editorCodeLines
            .filter((line) => !line.includes("import "))
            .join("\n");

          const libraries = editorCodeLines
            .filter((line) => line.includes("import "))
            .map((line) => {
              const library =
                line.replace("import ", "").split(" from")[0] + "@latest";
              return `<script crossorigin src="https://unpkg.com/${library}"></script>`;
            });

          const codeToTranspile = `${editorCodeWithoutImports}
        ReactDOM.render(<App />, document.getElementById('root'));`;

          const transformedCode = Babel.transform(codeToTranspile, {
            presets: ["react"],
          }).code;

          doc.write(`<html>
            <head>
              <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
              ${libraries.join("\n")}
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.3/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body>
              <div id="root"></div>
              <script>${transformedCode}</script>
            </body>
          </html>`);
          doc.close();
        }
      }
    } catch {}
  }, [editorCode]);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={editorCode}
          onChange={(value) => setEditorCode(value ?? "")}
          theme="vs-dark"
        />
      </div>
      <div className="w-1/2 h-full">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

export default App;
