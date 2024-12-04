import React, { useState } from "react";
import StepperComponent from "./Stepper";

const AddYourInfoForm = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSave = () => {
        console.log("save");
        //api call
    };

    return (
        <div>
            <div className="space-y-4">
                <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">البريد الالكتروني</p>
                <input
                    type="email"
                    placeholder="البريد الالكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
                />
                <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">اسم المستخدم</p>
                <input
                    type="text"
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 !mt-2 h-[38px] border-[#EEEEEE] border-[1px] rounded-md text-right"
                />
                <p className="text-[14px] mb-0 text-[#444444] font-medium text-right">الاسم(اختياري)</p>
                <input
                    type="text"
                    placeholder="الاسم"
                    value={name}
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
            <button
                onClick={handleSave}
                className="mt-6 w-full bg-[#BAF3E6] text-[#004D5A] py-3 rounded-md"
            >
                تسجيل الدخول
            </button>
            <div className="flex flex-col items-center justify-center p-6 pb-0 border-t mt-6 border-t-[#EEEEEE]">
                <p>
                    هل لديك حساب بالفعل؟
                </p>
                <p className="text-[#004D5A]">
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
