import React, { useEffect, useState } from 'react'
import './css/navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from './image/news.png';
import search from './image/search.png';
import close from './image/close.png';

export default function Navbar(props) {

    // search dropDown
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/check', {
                    credentials: 'include'
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const profile = async () => {
        try {
            navigate('/profile');
        } catch (err) {
            console.error('Profile failed:', err);
        }
    }

    return (
        <>
            <nav>
                <div className={`navbar shadow-lg  ${isOpen ? 'show' : ''}`}>
                    <div className='logo'><img className='logoImg' src={logo}></img><p className='logoText'> News app</p></div>
                    <div className="dropdown-container">
                        <button onClick={toggleDropdown} className="dropdown-button ">
                            {isOpen ? <span className="close-icon"><img className='imgIcon' src={close}></img></span> : <img className='imgIcon' src={search}></img>}
                        </button>
                        <div className={`dropdown-menu easy-in-out ${isOpen ? 'show' : ''}`}>
                        </div>
                    </div>

                    <div className='menu mobile_font'>
                        <div className='menu1'><NavLink to={'/'} >Home</NavLink></div>
                        <div className='menu1'><NavLink to={'/Blog'} > Blog </NavLink></div>
                        {/* <div className='menu1'><NavLink to={'/About'} > About </NavLink></div> */}
                        {isAuthenticated ? (
                            <div className='menu1'>
                                <button onClick={profile}>Profile</button>
                            </div>
                        ) : (
                            <div className='menu1'><NavLink to={'/Login'}>Login</NavLink></div>
                        )}
                    </div>
                </div>

                {isOpen ? (
                    <div className='search'>
                        <input className='searchBar' type='text' placeholder='Search News' onChange={(e) => {
                            props.typeData(e.target.value);
                        }} />
                    </div>
                ) : ''}
            </nav>
        </>
    )
}
