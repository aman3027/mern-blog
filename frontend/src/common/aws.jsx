// we will make a funtion which will take image as an argument and it will upload image to aws(bucket) , and it will return an upload url back to telling that image is uploaded successfully
import axios from "axios";
export const uploadImage = async (img) => {
  let imgUrl = null;
  await axios
    .get("http://localhost:3000" + "/get-upload-url")
    .then(async ({ data: { uploadURL } }) => {
      await axios({
        method: "PUT",
        url: uploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      }).then(() => {
        imgUrl = uploadURL.split("?")[0];
      });
    });

  return imgUrl;
};
