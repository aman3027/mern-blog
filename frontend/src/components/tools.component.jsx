// create a tool object which will use in blog editor
import Embed from "@editorjs/embed"; // it allows you to add youtube or any other social media videos by just providing the link
import List from "@editorjs/list"; // it will allow you to unordered or ordered lists
import Image from "@editorjs/image"; // it allows you operation over images
import Header from "@editorjs/header"; // it allows all the headers like h1,h2
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker"; // allows you to highlight any part in editor
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/aws";

const uploadImageByFile = async (e) => {
  // we will fist make a request to our server and we will get an aws link then we can upload the image(same did for blog banner)
  console.log(e);
  return await uploadImage(e).then((url) => {
    
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};
// since we will have need to upload image during writing your blog(editor section)
const uploadImageByURL = (e) => {
  // written in Editorjs opensource library to read from there
 
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e)
    } catch (err) {
      reject(err)
    }
  })
//   console.log(url);
  return  link.then(url => {
   
    return { 
      success: 1,
      file: { url }
    }
  })
}

export const tools = {
  embed: Embed,
  // because when we are creating a list in editor on hovering that we are not getting a toolbar, to do that we are setting inlinetoolbar = true

  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
        uploader: {
            uploadByUrl: uploadImageByURL,
            uploadByFile: uploadImageByFile,
        }
     
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
