'use client';
import React, { useState, Suspense,useEffect } from "react";
import Link from "next/link";
import style from "./UserEntrance.module.css";
import { googleSignup } from "../../services/auth";
import { FcGoogle } from "react-icons/fc";
import { FaSignInAlt } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { signUpUser, loginUser, registerWithGoogle } from "../../services/user";
import { useRouter } from "next/navigation";
import { userDetailsStore } from "../../services/zustand";
import ForgetPassword from "../Entrance/ForgotPassword";
import { showError } from "../../services/messeges";
export const dynamic = 'force-dynamic';

export const Entrance = ({ type }: any) => {
  const [email, setEmail] = useState("");
  const [typeUser, setTypeUser] = useState("user");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isWithGoogle, setIsWithGoogle] = useState(false);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [isLoadding, setIsLoadding] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const setUserDetails = userDetailsStore((state) => state.setUserDetails);
  const router = useRouter();
  let typeFromUrl="";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    typeFromUrl = params?.get("type") ||"";
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
    if(typeFromUrl=="representative"){
      setIsRepresentative(true);
      setTypeUser("representative");
    }
  }, []);

  const mutationSignUp = useMutation({
    mutationFn: signUpUser,
    onMutate: () => {
      setIsLoadding(true);
    },
    onSuccess: (data: any) => {
      console.log(isLoadding);
      console.log(data);
      if (data.userDetails.email) setDetails(data);
      else {
        setIsLoadding(false);
        showError("נסה שוב או התחבר");
      }
    },
    onError: (error: any) => {
      setIsLoadding(false);
      console.log(error.message);
      showError("נסה שוב או התחבר");
    },
  });

  const mutationLogin = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setIsLoadding(true);
    },
    onSuccess: (data) => {
      if (data.userDetails.email) setDetails(data);
      else {
        setIsLoadding(false);
        showError("אימייל או סיסמא שגויים");
      }
    },
    onError: (error: any) => {
      setIsLoadding(false);
      console.log(error.message);
      showError("נסה שוב או התחבר");
    },
  });

  const mutationRegisterWithGoogle = useMutation({
    mutationFn: registerWithGoogle,
    onMutate: () => {
      setIsLoadding(true);
    },
    onSuccess: (data) => {
      setDetails(data);
    },
    onError: (error: any) => {
      setIsLoadding(false);
      console.log(error.message);
      showError("נסה שוב ");
    },
  });

  const setDetails = (data: any) => {
    if (data.userDetails.user_type == "user") {
      const userDetails = {
        _id: data.userDetails._id,
        email: data.userDetails.email,
        google_auth: data.userDetails.google_auth || false,
        user_type: data.userDetails.user_type,
        name: data.userDetails.name,
        id_number: data.userDetails.id_number,
        address: data.userDetails.address,
        status: data.userDetails.status,
        profile_picture: data.userDetails.profile_picture
      };
      setUserDetails(userDetails);
      router.push("/chat/user");
    }
    if (data.userDetails.user_type == "representative") {
      const userDetails = {
        _id: data.userDetails._id,
        email: data.userDetails.email,
        google_auth: data.userDetails.google_auth || false,
        user_type: data.userDetails.user_type,
        name: data.userDetails.name,
        id_number: data.userDetails.id_number,
        address: data.userDetails.address,
        status: data.userDetails.status,
        profile_picture: data.userDetails.profile_picture
      };
      setUserDetails(userDetails);
      router.push("/chat/representative");
    }
    if (data.userDetails.user_type == "manager") {
      const userDetails = {
        _id: data.userDetails._id,
        email: data.userDetails.email,
        google_auth: data.userDetails.google_auth || false,
        user_type: data.userDetails.user_type,
        name: data.userDetails.name,
        id_number: data.userDetails.id_number,
        address: data.userDetails.address,
        status: data.userDetails.status,
        profile_picture: data.userDetails.profile_picture
      };
      setUserDetails(userDetails);
      router.push("/chat/manager");
    }
  };

  const entranceExempleUser = (e: any) => {
    e.preventDefault();
    const userData = {
      email: "rutite261@gmail.com",
      password: "rrRR2024",
      isWithGoogle: false,
    };
    mutationLogin.mutate(userData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (type == "signup") {
      console.log(typeFromUrl);
      
      const userData = {
        email: email,
        password: password,
        isWithGoogle: false,
        userType: typeUser,
      };
      mutationSignUp.mutate(userData);
    }
    if (type == "login") {
      const userData = {
        email: email,
        password: password,
        isWithGoogle: false,
      };
      mutationLogin.mutate(userData);
    }
  };

  const signupHandler = async (e: any) => {
    e.preventDefault();
    const res = await googleSignup();
    setIsWithGoogle(true);
    const emailFromGoogle = res.user.email;
    setEmail(emailFromGoogle);
    const nameFromGoogle = res.user.displayName;
    setName(nameFromGoogle);
    console.log(emailFromGoogle, nameFromGoogle);
    const userData = {
      email: emailFromGoogle,
      name: nameFromGoogle,
      isWithGoogle: true,
      userType: "user",
    };
    mutationRegisterWithGoogle.mutate(userData);
  };

  return (
    <>
      {isLoadding && (
        <div className={style.loading_dots}>
          <div className={style.dot}></div>
          <div className={style.dot}></div>
          <div className={style.dot}></div>
        </div>
      )}
      {!isLoadding && (
        <form onSubmit={handleSubmit} className={style.container}>
          <h2 className={style.title}>
            {type == "login" ? "התחברות" : "רישום"}
          </h2>
          <div className={style.inputContainer}>
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              readOnly={isRepresentative}
              className={style.input}
              onChange={(e) => setEmail(e.target.value)}
              title="אנא הכנס כתובת אימייל תקינה"
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <input
              type="password"
              placeholder="סיסמא"
              className={style.input}
              onChange={(e) => setPassword(e.target.value)}
              title=" הסיסמה חייבת לכלול אותיות קטנות וגדולות ומספרים, באורך לפחות 6 תווים"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$"
            />
            {type == "login" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setForgetPassword(true);
                }}
                className={style.resetPassword}
              >
                שכחתי סיסמא
              </button>
            )}
          </div>
          {forgetPassword && (
            <ForgetPassword setForgetPassword={setForgetPassword} />
          )}
          <button onClick={entranceExempleUser} className={style.exempleUser}>
            {" "}
            <FaSignInAlt className={style.entranceIcon} /> התחבר כמשתמש לדוגמא
          </button>
          <button className={style.googleButton} onClick={signupHandler}>
            <FcGoogle className={style.googleIcon} /> register with Google{" "}
          </button>
          <button className={style.submitButton} type="submit">
            {" "}
            {type == "login" ? "הכנס" : "הרשם"}{" "}
          </button>
          <Link
            href={type == "login" ? "/signup" : "/login"}
            className={style.link}
          >
            {" "}
            {type == "login" ? "משתמש חדש?" : "משתמש רשום?"}{" "}
          </Link>
          <Link href="/company_signup" className={style.link}>
            חברה חדשה?
          </Link>
        </form>
      )}
    </>
  );
};
