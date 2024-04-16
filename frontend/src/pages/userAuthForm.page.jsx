import { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios"; // Changed import statement
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    // console.log(serverRoute);
    axios
      .post("http://localhost:3000" + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        console.log("Error response:", response); // Log the response for debugging
        if (response && response.data && response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.error("An error occurred during authentication.");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let form = new FormData(authForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    // form validation

    let { fullname, email, password } = formData;

    if (fullname && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters long");
    }

    if (!email.length) {
      return toast.error("Enter Email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase, 1 uppercase letters"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };
        // console.log(formData);

        userAuthThroughServer(serverRoute, formData);
        return <Navigate to="/" />;
      })
      .catch((err) => {
        toast.error("trouble login through google");
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <section className="h-cover flex items-center justify-center">
      <Toaster />
      <form ref={authForm} className="w-[80%] max-w-[400px]">
        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
          {type == "sign-in" ? "Welcome back" : "join us today"}
        </h1>

        {type !== "sign-in" ? (
          <InputBox
            name="fullname"
            type="text"
            placeholder="Full Name"
            icon="fi-rr-user"
          />
        ) : (
          ""
        )}
        <InputBox
          name="email"
          type="email"
          placeholder="Email"
          icon="fi-rr-envelope"
        />
        <InputBox
          name="password"
          type="password"
          placeholder="password"
          icon="fi-rr-key"
        />

        <button
          className="btn-dark center mt-14"
          onClick={handleSubmit}
          type="button"
        >
          {type.replace("-", " ")}
        </button>

        <div
          className="relative flex w-full items-center gap-2 my-10 opacity-10
                 uppercase text-black font-bold"
        >
          <hr className="w-1/2 border-black" />
          <p className="text-center">or</p>
          <hr className="w-1/2 border-black" />
        </div>

        <button
          className="btn-dark flex items-center 
                justify-center gap-4 w-[98%] center"
          onClick={handleGoogleAuth}
        >
          <img src={googleIcon} className="w-5" alt="Google Icon" />
          continue with google
        </button>

        {type == "sign-in" ? (
          <p className="mt-6 text-dark-grey text-xl text-center">
            Don't have an account ?
            <Link to="/signup" className="underline text-black text-xl ml-1 ">
              Join us today
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-dark-grey text-xl text-center">
            Already a member ?
            <Link to="/signin" className="underline text-black text-xl ml-1 ">
              Sign in here.
            </Link>
          </p>
        )}
      </form>
    </section>
  );
};

export default UserAuthForm;
