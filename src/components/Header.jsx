import React, { useState, useEffect, useRef } from "react";

const Header = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const buttonRef = useRef(null);

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

    const logout = () => {
        console.log("logging out");
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
                <span className="text-lg text-[#F8F8F8]">إبراهيم شمس</span>
                <img src="/images/header-image.svg" alt="Profile" className="w-10 h-10 rounded-full" />
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
