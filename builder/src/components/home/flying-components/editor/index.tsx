import React from 'react';
import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { DEFAULT_REACT_CODE } from '../utils/constants';

type Props = {
  setFieldValue: (field: string, value: any) => void;
  code: string;
};

type EditorCodeDescriptor = { path: string; language: string; value: string };

const defaultFiles = [
  {
    path: '/src/index.tsx',
    language: 'typescript',
    value: DEFAULT_REACT_CODE,
  },
];

const EditorWrapper = ({ setFieldValue, code }: Props) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [files] = useState<EditorCodeDescriptor[]>(
    code
      ? [
          {
            path: '/src/index.tsx',
            language: 'typescript',
            value: code,
          },
        ]
      : defaultFiles
  );
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [currentFile, setCurrentFile] = useState<EditorCodeDescriptor>();
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Configure TypeScript compilation options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    });
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const se = files.find((file) => file.path === event.target.value);
    setCurrentFile(se);
  };

  useEffect(() => {
    if (code) {
      files[0].value = code;
    }
    setCurrentFile(files[0]);
  }, [isEditorReady]);
  return (
    <>
      <select value={currentFile?.path} onChange={handleFileChange}>
        {files.map((file) => (
          <option key={file.path} value={file.path}>
            {file.path}
          </option>
        ))}
      </select>
      <Editor
        width="800"
        height="50vh"
        theme="vs-dark"
        path={currentFile?.path}
        value={currentFile?.value}
        defaultLanguage={currentFile?.language}
        onMount={handleEditorDidMount}
        onChange={(value) => setFieldValue('value.code', value)}
      />
    </>
  );
};

export default EditorWrapper;
