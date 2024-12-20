import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();

    const userObj = localStorage.getItem("salla_discourse_user");
    const user = JSON.parse(userObj);
    let userName = "";
    let avatarTemplate = "";
    let isAdmin = false;
    let adminLink = "";
    if (user) {
        userName = user.username;
        avatarTemplate = process.env.REACT_APP_API_URL + user.avatar_template.replace("{size}", "30");
        if (user.admin) {
            isAdmin = true;
            adminLink = process.env.REACT_APP_API_URL + "/admin";
        }
    }
    const logout = async () => {

        try {

            await axios.post(`${process.env.REACT_APP_API_URL}/admin/users/${user.id}/log_out.json`, {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Api-Key": `${process.env.REACT_APP_API_KEY}`,
                        "Api-Username": `${process.env.REACT_APP_API_USERNAME}`,
                    }
                });

            localStorage.removeItem("salla_discourse_user");
            localStorage.removeItem("salla_discourse_token");
            navigate("/login");

        }
        catch (error) {
            console.log(error);
        }

    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="flex items-center justify-between sm:p-4 p-4 pl-0 bg-white border-b">
            {user ? (
                <div className="flex items-center space-x-3 ml-4 relative">
                    <img
                        src={avatarTemplate}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 sm:block"
                    />
                    <span className="text-lg font-semibold text-gray-800">{userName}</span>

                    <div className="relative">
                        <img
                            src={`/images/header/arrow-down.svg`} alt=""
                            className={`cursor-pointer block ${isDropdownOpen ? 'rotate-180' : ''}`}
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                        />

                        {isDropdownOpen && (
                            <div className="absolute right-[-35px] sm:right-[-17px] mt-4 w-[8rem] sm:w-48 ml-4 bg-white rounded-md shadow-lg border border-gray-300 z-50">
                                {/* Triangle Arrow */}
                                <div className="absolute top-[-9px] right-[34px] sm:right-4 w-4 h-4 bg-white border-l border-t border-gray-300 transform rotate-45"></div>

                                {/* Dropdown Content */}
                                <ul className="py-2">
                                    <li
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => logout()}
                                    >
                                        تسجيل الخروج
                                    </li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            ) : (
                <button
                    className="font-semibold text-white bg-[#004D5A] px-4 py-2 rounded"
                    onClick={() => navigate("/login")}
                >
                    تسجيل الدخول
                </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-2">
                {isAdmin && (
                    <a className="font-bold cursor-pointer" href={adminLink} target="_blank" rel="noreferrer">
                        مسؤل
                    </a>
                )}
                <img src="/images/logo.svg" alt="Salla" className="h-8 mr-4" />
            </div>
        </header>
    );
};
export default Header;
