import { useState } from "react";
import { qawaneen, wasoom } from "../constants";

const LeftSidebar = () => {
    return (
        <div className="rounded-lg p-4 !pl-0 max-w-xs w-full mr-28" dir="rtl">
            <div className="flex gap-3 w-[26vw] items-center">

                <p className="whitespace-nowrap">قوانين القسم</p>
                <div className="h-0 w-[26vw] border-t-[1px] mt-1 border-t-[#E6E6E6]">
                </div>


            </div>
            <div className="mt-8 text-[#666666] w-[25vw]">
                {qawaneen.map((qanoon, index) => (
                    <div className="flex gap-3 mt-4">
                    <div>
                        <div className="flex justify-center items-center w-[26px] h-[26px] bg-[#EEEEEE] rounded-full">
                            <p className="text-[#666666]">{index + 1}</p>
                        </div>
                    </div>
                        <p className="mr-3"> {qanoon.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 w-[26vw] items-center mt-16">

                <p className="whitespace-nowrap">وسوم شائعة</p>
                <div className="h-0 w-[26vw] border-t-[1px] mt-1 border-t-[#E6E6E6]">
                </div>

            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 mr-3">
                {wasoom.map((tag, index) => (
                    <div key={index} className="px-4 py-2 text-black text-center flex gap-2">
                        <span className="font-bold text-[25px]">#{' '}</span>
                        <span className="ml-1">{tag.value}</span>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default LeftSidebar;
