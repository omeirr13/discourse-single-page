import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-white border-b">
            <div className="flex items-center space-x-3 ml-4">
                <img src="/images/header-image.svg" alt="Profile" className="w-10 h-10 rounded-full border-2 border-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">أسماء التاجري</span>
                <FontAwesomeIcon icon={faBell} className="w-4 h-4 cursor-pointer" style={{marginLeft: "2rem"}}/>
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4 cursor-pointer" style={{marginLeft: "2rem"}}/>

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
                <img src="/images/logo-text.svg" alt="Logo" className="h-8 mr-2" />
                <img src="/images/logo.svg" alt="Salla" className="h-8 mr-4" />
            </div>
        </header>
    );
}

export default Header;
