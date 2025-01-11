import React, { useState } from 'react';
import Navbar from './Navbar';
import './css/login_regis.css';

export default function Login() {
  const [login, setLogin] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [log, setLog] = useState(false)
  console.log(log);

  // login .............
  const login_data = async (e) => {
    e.preventDefault();
    console.log('login.. page')
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: 'include', // Include credentials in the request
      });

    //   const check = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5000/auth/check', {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             credentials: 'include', // Include credentials in the request
    //         });
    //         if (!response) {
    //             const data = await response.json();
    //             setLog(false);
    //         }
    //         setLog(true);
    //     } catch (err) {
    //         console.error("Failed to update value", err);
    //         setLog(false);
    //     }
    // }
    // check()

      const data = await response.json();
      if (data.message === 'Login successful') {
        localStorage.setItem('token', data.token);
        window.location.href = '/profile'; // redirect to profile page
      } else {
        console.error('Login failed', data.message);
      }
      window.alert(data.message);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  // registration ....................
  const registration_data = async (e) => {
    // e.preventDefault();
    console.log("regstration", email, name, password);
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password
        }),
        credentials: 'include', // Include credentials in the request
      });
      const data = await response.json();
      window.alert("Registration successful");
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }


  return (
    <>
      <Navbar />
      <div className='px-3 py-7 border-4 flex'>
        <div className='w-2/3'>
        </div>
        {
          login === 'registration' ?
            (
              <div className='w-3/5'>
                <p className='mb-6 text-4xl font-bold'>Registration</p>
                <form className='space-y-4 '>
                  <div >
                    <label className='block'>Full Name</label>
                    <input
                      className='border-b-2 border-indigo-300 w-3/4'
                      type='text'
                      placeholder='Name..'
                      onChange={(e) => setName(e.target.value)}></input>
                  </div>
                  <div >
                    <label className='block'>Email</label>
                    <input className='border-b-2 border-indigo-300 w-3/4'
                      type='email'
                      placeholder='Eamil address..'
                      onChange={(e) => setEmail(e.target.value)}></input>
                  </div>
                  <div>
                    <label className='block'>Password</label>
                    <input className='border-b-2 border-indigo-300 w-3/4'
                      type='password'
                      placeholder='*********'
                      onChange={(e) => setPassword(e.target.value)}></input>
                  </div>
                  <div className='flex'>
                    <button className='bt-maring border-2 px-6 py-1 rounded-3xl bg-blue-500 text-white ' onClick={registration_data}>Registration</button>
                    <button className='border-b-2 border-red-200' onClick={() => setLogin('login')}>Login</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className='w-3/5'>
                <p className='mb-6 text-4xl font-bold'>Login</p>
                <form className='space-y-4 '>
                  <div >
                    <label className='block'>Email</label>
                    <input
                      className='border-b-2 border-indigo-300 w-3/4'
                      type='email'
                      placeholder='Eamil address..'
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label className='block'>Password</label>
                    <input
                      className='border-b-2 border-indigo-300 w-3/4'
                      type='password'
                      placeholder='*********'
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>

                  </div>
                  <div className='flex'>
                    <button className='bt-maring border-2 px-6 py-1 rounded-3xl bg-blue-500 text-white' onClick={login_data}>Login</button>
                    <button className='border-b-2 border-red-200' onClick={() => setLogin('registration')}>Registration</button>
                  </div>
                </form>
              </div>

            )
        }

      </div>
    </>
  )
}
