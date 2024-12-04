import React from "react";

const StepperComponent = ({ currentStep }) => {
  const steps = ["أضف معلوماتك", "تأكد من بياناتك", "تسجيل الدخول"];

  return (
    <div className="flex flex-col items-end w-[21rem]">
      <div className="flex flex-row-reverse items-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center w-[40px] h-[6rem]">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentStep >= index ? "bg-[#BAF3E6] text-[#004D5A]" : "bg-white text-[#666666] border-solid border-[#DDDDDD] border-[1px] " 
                }  font-medium`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-[14px] text-gray-700 whitespace-nowrap">{step}</span>
              </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[1px] ${
                  currentStep > index ? "bg-teal-500" : "bg-gray-300"
                } mx-2 mb-[3.3rem]`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepperComponent;
