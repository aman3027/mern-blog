import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
  let characterLimit = 200;
  let taglimit = 10;
  let {
    blog,
    blog: { banner, title, tags, des, content },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  let  { userAuth: {access_token} } = useContext(UserContext);
  
  let navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDesChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };

   // function for handling blog title
   const handleTitleKeyDown = (e) => {
    // if user press enter before texoverflow in editor we don't want to change the line
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    // we will separate tags by comma(108 keycode)
     if(e.keyCode == 13 || e.keyCode == 188 ){
        e.preventDefault();
         
        let tag = e.target.value;
        if(tags.length < taglimit){     // tag array ki length at max 10 honi chahiye
           if(!tags.includes(tag) && tag.length){      // if tag is not present already in tags array
              setBlog({ ...blog, tags: [ ...tags, tag ]})
           }
        }else{
            toast.error(`you can add max ${taglimit} Tags`)
        }
        e.target.value = "";

     }
  }

  const publishBlog = (e) => {
       // validata the data then send to the backend if correct
       if(e.target.className.includes("disable")){
         return;
       }
       if(!title.length){
        return toast.error("Write blog title before publishing");
       }
       if(!des.length || des.length > characterLimit){
        return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`)
       }
       if(!tags.length){
        return toast.error("Enter at least 1 tag to help us rank your blog")
       }

       let loadingToast = toast.loading("Publishing....");
       // send the data to backend from frontend using axios

       let blogObj = {
           title, banner, des, content, tags, draft: false
       }
       axios.post("http://localhost:3000" + "/create-blog",
      blogObj,{
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
      })
      .then(() => {
        e.target.classList.add('disable'); // this will prevent adding data twice in our database
        toast.dismiss(loadingToast);
        toast.success("Published");

        setTimeout(() => {
          navigate("/")
        }, 500);
      })
      .catch(({ response }) => {
         e.target.classList.add('disable'); // this will prevent adding data twice in our database
        toast.dismiss(loadingToast);
        return toast.error(response.data.error)
      })

      
  }

  return (
    <section
      className="w-screen min-h-screen grid items-center
       lg:grid-cols-2 py-16 lg:gap-4"
    >
      <Toaster />
      <button
        className="h-12 w-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
        onClick={handleCloseEvent}
      >
        <i class="fi fi-br-cross"></i>
      </button>
      <div className="max-w-[550px] center">
        <p className="text-dark-grey mb-1">Preview</p>
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
          <img src={banner} />
        </div>
        <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
          {title}
        </h1>
        <p className="font-gelasio line-clamp-2 text-xl">{des}</p>
      </div>
      <div className="border-grey lg:border-1 lg:pl-8 lg:mt-4">
        <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
        <input
          type="text"
          placeholder="Blog Title"
          defaultValue={title}
          className="input-box pl-4"
          onChange={handleBlogTitleChange}
        />
        <p className="text-dark-grey mb-2 mt-9">
          Short description about your blog
        </p>

        <textarea
          maxLength={characterLimit}
          defaultValue={des}
          className="h-40 resize-none leading-7 input-box pl-4" // to remove aero in textarea we use resize-none, leading-7 gives fixed line height
          onChange={handleBlogDesChange}
          onKeyDown={handleTitleKeyDown}
        ></textarea>

        <p className="mt-1 text-dark-grey
        text-sm text-right">
        {characterLimit - des.length} characters left</p>

        <p className="text-dark-grey mb-2 mt-9">
        Tags - ( Helps in searching and ranking your blog post )
        </p>

        <div className="relative input-box pl-2 py-2 pb-4">
           <input type="text" placeholder="Tag"
           className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
           onKeyDown={handleKeyDown}
            />
            {
                tags.map((tag, i) => {
                    return <Tag tag={tag} tagIndex= {i} key = {i} />
                })
            }

        </div>
            
             {/* alert user for tag limit */}
             <p className="mt-1 mb-4 text-dark-grey
             text-right
             ">{ taglimit - tags.length } Tags left</p>
             <button className="btn-dark px-8"
             onClick={publishBlog}
             >Publish</button>


             {/* inorder to store content of publish form in data base we have to store this blog(object ) in our data base */}
             {/* so to do that we have to send this blog in backend then we can upload it in our database */}

      </div>
    </section>
  );
};

export default PublishForm;
