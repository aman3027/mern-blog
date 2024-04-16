import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
const BlogEditor = () => {
  // import editor context from editor.pages.jsx, we will call setBlog function inorder to change the value of blog
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog, textEditor, setTextEditor,setEditorState
  } = useContext(EditorContext);

  //  useeffect will run only once after the rendering , but if you pass a variable in [] then it will run whenever thatvariable will.chan

  useEffect(() => {
    setTextEditor( new EditorJS({
        holderId: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Write an awesome blog"
    }))
  },[])



  // when image is uploading then there should be a tost like "uploading..."

  const handleBannerUpload = (e) => {
    // first access this file then we will send it to backend
    let img = e.target.files[0];

    if (img) {
      // for uploading image we will use service provided by amazon web service(we will use s3 service) to upload the images in their data base then we will use the refrence link to store in our database
      let loadingToast = toast.loading("Uploading...");

      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded");
            // changing the blog banner state
            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast); 
          return toast.error(err);
        });
    }
  };

  // function for handling blog title
  const handleTitleKeyDown = (e) => {
    // if user press enter before texoverflow in editor we don't want to change the line
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  // function for managing texerea according to text
  const handleTitleChange = (e) => {
    //console.log(e);
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  // handle image error when it is not uploaded

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () =>{
    // firstly we have to insure that some data should be in your form then you can publish that form
      if(!banner.length){
        return toast.error("Upload a blog banner to publish it");
      }
      if(!title.length)
      {
        return toast.error("Please write blog title");
      }
      if(textEditor.isReady){
        textEditor.save().then(data => {
            if(data.blocks.length){
              setBlog({ ...blog, content: data}) // save data of blog editor
              setEditorState("publish")
            }else{
              return toast.error("Write anything for your blog")
            }
        })
        .catch((err)=>{
          console.log(err);
        })
      }
  }

  return (
    // because in react we can only return single parent component that is why we have to wrap all component inside parent component
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2"
          onClick={handlePublishEvent}
          >Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <section>
        <div className="mx-auto max-w-[900px] w-full">
          <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
            <label htmlFor="uploadBanner">
              <img src={banner} className="z-20" onError={handleError} />
              <input
                id="uploadBanner"
                type="file"
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={handleBannerUpload}
              />
            </label>
          </div>
          {/* textarea for blog title */}
          <textarea
           defaultValue={title}
            placeholder="Blog Title"
            className="text-4xl font-normal w-full h-20
          outline-none resize-none mt-10 leading-tight
          placeholder:opacity-40"
            onKeyDown={handleTitleKeyDown}
            onChange={handleTitleChange}
          ></textarea>

         <hr className="w-full opacity-10 my-5" />
         {/* editor */}
         <div id="textEditor" className="font-gelasio">

         </div>


        </div>
      </section>
    </>
  );
};

export default BlogEditor;
