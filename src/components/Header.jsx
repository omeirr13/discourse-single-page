import React from 'react';

const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-[#003C47] border-b">
            <div className="flex items-center space-x-3 ml-4">
                <img src="/images/down-arrow.svg" alt="Profile" className="rounded-full h-[7px] mt-2" />
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
}

export default Header;
