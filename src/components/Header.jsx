import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

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
    return (
        <header className="flex items-center justify-between p-4 bg-[#003C47] border-b">
            <div className="flex items-center space-x-3 ml-4">
                <div className="relative">
                    <img 
                        src="/images/down-arrow.svg" 
                        alt="Profile" 
                        className="rounded-full h-[7px] mt-2 cursor-pointer dropdown-button" 
                        onClick={toggleDropdown}
                        ref={buttonRef} 
                    />
                    
                    {isDropdownVisible && (
                        <div 
                            className="absolute mt-[20px] w-40 bg-[#FBFDFF] rounded-lg shadow-lg z-50 dropdown-menu"
                            style={{
                                right: buttonRef.current && 
                                       (window.innerWidth - buttonRef.current.getBoundingClientRect().right) < 200 
                                       ? '0' 
                                       : 'auto',
                                left: buttonRef.current && 
                                      (window.innerWidth - buttonRef.current.getBoundingClientRect().right) >= 200
                                      ? '0' 
                                      : 'auto',
                            }}
                        >
                            <button className="w-full text-left px-4 py-2 text-[#003C47] text-sm rounded-b-lg" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <span className="text-lg text-[#F8F8F8]"> {userName}</span>
                <img src={avatarTemplate} alt="Profile" className="w-10 h-10 rounded-full" />
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-xl">
                    <i className="fas fa-bell"></i>
                </button>
                <button className="text-xl">
                    <i className="fas fa-search"></i>
                </button>
            </div>

            <div className="flex items-center">
                <img src="/images/logo.svg" alt="Salla" className="w-[95px] h-[48px] mr-4" />
            </div>
        </header>
    );
};

export default Header;
