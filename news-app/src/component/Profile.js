import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import './css/style.css';


export default function Profile() {
    const [profile, setProfile] = useState({});
    const [topics, setTopics] = useState({});
    const [error, setError] = useState(null);
    const [oldPass, setPass] = useState();
    const [newPass, setNewPass] = useState();
    const email = profile.email;
    const [isadd, setIsadd] = useState(true);
    const [add_data, setAdd_data] = useState('');
    const navigate = useNavigate();
    const [login, setLogin] = useState(false)
    // console.log(login);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/profile', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Include credentials in the request
                });
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    const errorText = await response.text();
                    console.error('Error fetching profile: ', errorText);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                window.location.href = '/login';
            }
        };
        fetchProfile();
        fetch_topics();
    }, [topics]);

    
    // const check = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5000/auth/check', {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             credentials: 'include', // Include credentials in the request
    //         });
    //         if (!response) {
    //             const data = await response.json();
    //             setLogin(false);
    //         }
    //         setLogin(true);
    //     } catch (err) {
    //         console.error("Failed to update value", err);
    //         setLogin(false);
    //     }
    // }
    // check()


    // Update password
    const update_pass = async () => {
        if (oldPass === '' || newPass === '') {
            window.alert('Enter valid data');
        }
        else {
            try {
                const response = await fetch('http://localhost:5000/auth/update_pass', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        oldPass,
                        newPass,
                    }),
                    credentials: 'include', // Include credentials with the request
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                window.alert(data.message);
                console.log("Data : ", data);
            } catch (err) {
                console.error("Failed to update value", err);
            }
        }
    }


    // add favorite news topic 
    const add_topic = async () => {
        if (add_data === '') {
            window.alert('Enter topic ');
        }
        else {
            try {
                const response = await fetch('http://localhost:5000/auth/add_topic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // email,
                        add_data,
                    }),
                    credentials: 'include',
                });
                if (!response.ok) {
                    console.log("Failed to update topic")
                }
                const data = await response.json();
                console.log("Topic response : ", data);
                fetch_topics();
                setIsadd(true);
                setAdd_data('');
            } catch (err) {
                console.error("Failed to add new topic", err);
            }
        }
    }


    // fetch topic .....
    const fetch_topics = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/get_topic', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure credentials are included
            });
            if (response.ok) {
                const data = await response.json();
                setTopics(data);
            } else {
                const errorText = await response.text();
                console.error('Error fetching topics: ', errorText);
                setError('Error fetching topics');
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            setError('Error fetching topics');
        }
    }


    // delete topic ....................
    const delete_topics = async (topicId) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/delete_topic/${topicId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error deleting topic:', errorText);
                return;
            }
            const data = await response.json();
            fetch_topics();
        } catch (error) {
            console.error('Error deleting topic:', error);
        }
    }

    const handelclick = () => {
        update_pass();
    }


    // logout..............
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setIsAuthenticated(false);
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <>
            <Navbar />
            <div className='body'>
                <div className='m-auto float-right mb-2 block '>
                    <button className='red round_btn border-2 border-indigo-500 px-2 ' onClick={handleLogout}>Logout</button>
                </div>
                <h1 className='text-center text-3xl font-bold block'>welcome to profile page</h1>
                <div className='mt-5 text-lg'>
                    <p><span className='font-bold mr-1 '>Name: </span>{profile.name}</p>
                    <p><span className='font-bold mr-1'>Email: </span> {profile.email}</p>
                    <label className='mt-5 block border-b-2 font-bold'>Change password</label>
                    <div className=' flex w-10/12'>
                        <div className='w-full '>
                            <input
                                className='border-b-2 border-indigo-300 w-11/12 mt-2 outline-none block'
                                type='text'
                                placeholder='Old Password ..'
                                onChange={(e) => setPass(e.target.value)}>
                            </input>
                            <input
                                className='border-b-2 border-indigo-300 w-11/12 mt-4 outline-none block'
                                type='text'
                                placeholder='New Password ..'
                                onChange={(e) => setNewPass(e.target.value)}>
                            </input>
                        </div>
                        <button className='border_radious border-2 border-indigo-500 px-5 py-1  block mt-5 text-center m-auto' onClick={handelclick}>Submit</button>
                    </div>
                </div>
                <div className='mt-6'>
                    <span className='text-center text-3xl font-bold'>Add Your Favorite News Topic</span>
                    <div>
                        <div className='text-xl mt-3 flex'>
                            <button className='   px-2 block ml-5' onClick={() => { setIsadd(!isadd) }}>
                                {isadd ? (
                                    <span className='border_radious border-indigo-500'>Add Topic</span>
                                ) : (
                                    <span className='round_btn border-2 rounded-lg border-indigo-500 px-2'>Close</span>
                                )}
                            </button>
                        </div>
                        <div>
                            {
                                isadd ? '' : (
                                    <div className='flex'><input
                                        className='border-b-2 border-indigo-300 w-3/4 mt-4 outline-none'
                                        type='text'
                                        placeholder='Add new Topic ..'
                                        onChange={(e) => setAdd_data(e.target.value)}>
                                    </input>
                                        <button
                                            className='round_green_btn border-2 border-indigo-500 px-2 block ml-5'
                                            onClick={add_topic}
                                        >Add
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className='mt-6'>
                    <span className='text-center text-3xl font-bold'>Your Favorite News Topic is :</span>
                    {
                        topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <div key={index} className='flex w-full'>
                                    <p className='text-xl mr-10 w-1/2'>Topic {index + 1} : {topic.topic_name}</p>
                                    <button
                                        className='round_btn border-2 rounded-lg border-indigo-500 px-2 block ml-5'
                                        onClick={() => delete_topics(topic._id)}
                                    >Delete</button></div>
                            ))
                        ) : (
                            <p className='text-xl'>No topics found.</p>
                        )
                    }
                </div>
            </div>
        </>
    )
}


