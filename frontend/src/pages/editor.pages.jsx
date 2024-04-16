import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const blogStructure = {
  // this is blog structure object
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({}); // react tool allows you to share the data between the components

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [ textEditor, setTextEditor ] =useState({ isReady: false});
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  return (
    // you can access these four values from blogeditor and publish form
    <EditorContext.Provider
      value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}
    >
      {
        // we will check if user has logged in then only he can write in editor
        access_token == null ? (
          <Navigate to="/signin" />
        ) : editorState == "editor" ? (
          <BlogEditor />
        ) : (
          <PublishForm />
        )
      }
    </EditorContext.Provider>
  );
};

export default Editor;
