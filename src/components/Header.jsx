import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const buttonRef = useRef(null);

    const userObj = localStorage.getItem("salla_discourse_user");
    const user = JSON.parse(userObj);
    let userName  = "";
    let avatarTemplate  = "";
    if(user){
        userName = user.username;
        avatarTemplate = process.env.REACT_APP_API_URL + user.avatar_template.replace("{size}","28");
    }

    const toggleDropdown = () => setDropdownVisible(prevState => !prevState);

    const closeDropdown = (e) => {
        //if clicked inside dont close
        if (e.target.closest('.dropdown-menu') || e.target.closest('.dropdown-button')) return;
        setDropdownVisible(false);
    };

    useEffect(() => {
        document.addEventListener('click', closeDropdown);
        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, []);

    const logout = async() => {

        try {

            await axios.post(`${process.env.REACT_APP_API_URL}/admin/users/${user.id}/log_out.json`,{},
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
        catch(error){
            console.log(error);
        }

    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="flex items-center justify-between sm:p-4 p-4 pl-0 bg-white border-b">
            <div className="flex items-center space-x-3 ml-0 sm:ml-4 relative">
            <img 
                src={avatarTemplate} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-yellow-500 hidden sm:block" 
            />
            <span className="text-lg font-semibold text-gray-800 hidden sm:block">{userName}</span>

            <div className="relative">
                <img 
                    src={`/images/header/arrow-down.svg`} 
                    className={`cursor-pointer hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    onClick={() => setIsDropdownOpen(prev => !prev)} 
                />

{isDropdownOpen && (
    <div className="absolute right-[-17px] mt-4 w-48 ml-4 bg-white rounded-md shadow-lg border border-gray-300 z-50">
        {/* Triangle Arrow */}
        <div className="absolute top-[-9px] right-4 w-4 h-4 bg-white border-l border-t border-gray-300 transform rotate-45"></div>
        
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

            <img src={`/images/header/bell.svg`} className="cursor-pointer ml-0 sm:!ml-[40px]" />
            <img src={`/images/header/search.svg`} className="cursor-pointer !ml-[40px]" />
        </div>
            {/* Additional buttons */}
            <div className="flex items-center space-x-6">
                <button className="text-xl">
                    <i className="fas fa-bell"></i>
                </button>
                <button className="text-xl">
                    <i className="fas fa-search"></i>
                </button>
            </div>
    
            {/* Logo */}
            <div className="flex items-center">
                <img src="/images/logo.svg" alt="Salla" className="h-8 mr-4" />
            </div>
        </header>
    );
    
};

export default Header;
