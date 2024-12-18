import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../crypto";
import { useDispatch, useSelector } from "react-redux";

import { setIndiLoading } from "../../redux/features/loadingSlice";

const AddYourInfoForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.loading);

  const redirectSignup = () => {
    navigate("/signup");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    dispatch(setIndiLoading({ actionType: "auth", postId: "-1", value: true }));
    if (!username && !password) {
      alert("Please fill out all fields");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/session`,
        {
          login: username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": `${process.env.REACT_APP_API_KEY}`,
            "Api-Username": `${process.env.REACT_APP_API_USERNAME}`,
          },
          withCredentials: true,
        }
      );
      dispatch(
        setIndiLoading({ actionType: "auth", postId: "-1", value: false })
      );
      if (response.data.error) {
        setErrors(response.data.error);
        return;
      }
      const secretKey = process.env.REACT_APP_SECRET;
      const encryptedPassword = encryptData(password, secretKey);
      localStorage.setItem(
        "salla_discourse_user",
        JSON.stringify(response.data.user)
      );
      localStorage.setItem("salla_discourse_token", encryptedPassword);
      navigate("/");
    } catch (error) {
      dispatch(
        setIndiLoading({ actionType: "auth", postId: "-1", value: false })
      );
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSave}>
        {errors && (
          <div className="text-[#FF0000] text-right mt-2">{errors}</div>
        )}
        <div className="space-y-4 mt-20">
          <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">
            اسم المستخدم
          </p>
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
          />
          <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">
            كلمة المرور
          </p>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
          />
        </div>
        {loading.auth["-1"] ? (
          <img
            src="/images/loader.gif"
            alt="Loading..."
            className="w-[12px] h-[15px]"
          />
        ) : (
          <button
            type="submit"
            className="mt-6 w-full bg-[#BAF3E6] text-[#004D5A] py-3 rounded-md"
          >
            تسجيل الدخول
          </button>
        )}
      </form>

      <div className="flex flex-col items-center justify-center p-6 pb-0 border-t mt-20 border-t-[#EEEEEE]">
        <p>ليس لديك حساب؟</p>
        <p className="text-[#004D5A] cursor-pointer" onClick={redirectSignup}>
          قم بإنشاء حساب الان
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  // const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex-col flex items-center justify-center p-8 bg-teal-50">
          <h1 className="text-3xl font-bold text-black mb-4">
            أهلاً بكم في مجتمع سلة
          </h1>
          <p className="text-lg text-[#707070] mb-8 leading-relaxed">
            أنشئ مجتمع سلة ليكون المكان الأمثل والأكثر موثوقية للتجارة، تبادل
            الأفكار والخبرات.
          </p>
        </div>

        <div className="flex-1 p-8 border-l">
          <div className="flex justify-end w-[24rem]">
            <p className="text-[#444444] text-[30px] font-bold">أهلاً بعودتك</p>
          </div>
          {/* <div className="mb-3 mt-7 flex justify-center">
                        <StepperComponent currentStep={currentStep} />
                    </div> */}
          <AddYourInfoForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
