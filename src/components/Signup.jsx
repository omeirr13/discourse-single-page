import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddYourInfoForm = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const redirectToLogin = () =>{
        navigate("/login");
    }

    const handleSave = async (event) => {
        event.preventDefault();
        console.log(email, username, password,name);

        if(!email && !username && !password && !name){
            alert("Please fill out all fields");
            return;
        }
        try {
            //create user in discourse
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users.json`,  {
                email,
                username,
                password,
                name,
                active:true, //bypass email verififcation
                approved:true, //bypass email verififcation
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": `${process.env.REACT_APP_API_KEY}`,
                    "Api-Username": `${process.env.REACT_APP_API_USERNAME}`,
                }
            });

            if(response.data.errors){
                setError(response.data.message);
                return;
            }
            setError("");
            navigate("/login");
        }
        catch(error){
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSave}>
                <div className="space-y-4">
                    {error ? <div className="text-[14px] text-[#FF0000] font-medium text-right">{error}</div> : <></>}
                    <p className="text-[14px] mb-0 text-[#444444] font-medium text-right mt-5">البريد الالكتروني</p>
                    <input
                        type="email"
                        placeholder="البريد الالكتروني"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
                    />
                    <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">اسم المستخدم</p>
                    <input
                        type="text"
                        required
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
                    />
                    <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">كلمة المرور</p>
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
                    />
                    <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">الاسم(اختياري)</p>
                    <input
                        type="text"
                        placeholder="الاسم"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
                    />
                    <div className="flex items-center justify-end">
                        <label htmlFor="terms" className="text-gray-600">
                            أوافق على
                            <span className="text-[#004D5A] font-medium"> شروط الخدمة و سياسة الخصوصية</span>
                        </label>
                        <input type="checkbox" id="terms" className="ml-2 w-[20px] h-[20px] rounded-sm" />
                    </div>
                </div>
                <button type="submit"
                    className="mt-6 w-full bg-[#BAF3E6] text-[#004D5A] py-3 rounded-md"
                >
                    تسجيل الدخول
                </button>
            </form>
            <div className="flex flex-col items-center justify-center p-6 pb-0 border-t mt-6 border-t-[#EEEEEE]">
                <p>
                    هل لديك حساب بالفعل؟
                </p>
                <p onClick={redirectToLogin}  className="text-[#004D5A] cursor-pointer">
                    تسجيل الدخول
                </p>
            </div>

        </div>
    );
};

const Signup = () => {
    // const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full">
                <div className="flex-col flex items-center justify-center p-8 bg-teal-50">
                    <h1 className="text-3xl font-bold text-black mb-4">
                        أهلاً بكم في مجتمع سلة
                    </h1>
                    <p className="text-lg text-[#707070] mb-8 leading-relaxed">
                        أنشئ مجتمع سلة ليكون المكان الأمثل والأكثر موثوقية للتجارة، تبادل الأفكار
                        والخبرات.
                    </p>
                </div>

                <div className="flex-1 p-8 border-l">
                    <div className="flex justify-end w-[24rem]">
                        <p className="text-[#444444] text-[30px] font-bold">انضم الينا</p>
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

export default Signup;
