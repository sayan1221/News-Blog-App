import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { format } from 'date-fns';
import './css/style.css';

export default function Blog() {
  const [textBlog, setTextBlog] = useState('');
  const [up_MyBlog, setUp_MyBlog] = useState({
    data: '',
    id: '',
  });
  const [blogData, setBlogData] = useState([]);
  const [myBlog, setMyblog] = useState([]);
  const [btn, setBtn] = useState(false);
  const [upd, setUpd] = useState(false);
  const [uId, setUId] = useState('');
  const [blogAdded, setBlogAdded] = useState(false);

  // main rendring ...........
  useEffect(() => {
    const fetch_blog = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/fetch_blog', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response) {
          const data = await response.json();
          console.error("Blog is not found ", data);
          return;
        }
        const data = await response.json();
        setBlogData(data);
      } catch (err) {
        console.error('Blog fetching error', err);
      }
    }
    fetch_blog();
    myblog();
  }, [blogAdded]);


  // add blog .................

  const addBlog = async () => {
    if (textBlog !== '') {
      try {
        const response = await fetch('http://localhost:5000/auth/add_blog', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            textBlog,
          }),
        });
        if (!response) {
          const data = await response.json();
          console.error("Blog data is not found frontend", data);
          return;
        }
        const data = await response.json();
        setBlogAdded(!blogAdded);
        // setBlogData(preBlog => [...preBlog,data]);
        window.alert(data.message);
        setTextBlog('');
        myblog();
      } catch (err) {
        console.error('add blog failed frontend', err);
      }
    } else {
      window.alert('Enter valid Blog');
    }
  };


  // fetch my blog ..............
  const myblog = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/my_blog', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response) {
        console.error('My Blog not found ', data);
      }
      // const data = await response.json();
      // console.log(data);
      setMyblog(data);
    } catch (err) {
      console.error("my Blog error", err);
    }
  }

  // update my blog....................
  const updateBlog = async () => {
    try {
      setUpd(!upd)
      // console.log('come to update Blog')
      const data = up_MyBlog.data;
      const id = up_MyBlog.id;
      // console.log(data,id)
      const response = await fetch('http://localhost:5000/auth/update_myBlog', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          data,
          id,
        }),
        credentials: 'include',
      });
      if (!response) {
        console.error('My Blog not found ', data2);
      }
      const data2 = await response.json();
      console.log("data2 : ", data2.message)
      myblog();
    } catch (err) {
      console.error("My blog update failed ", err);
    }
  }

  // delete my blog...................
  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/delete_blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response) {
        console.log('Blog not deleteed');
      }
      const data = await response.json();
      console.log("data:", data);
      window.alert(data.message);
      setBlogAdded(!blogAdded);
    } catch (err) {
      console.error('Delete my Blog failed', err);
    }
  }

  return (
    <>
      <Navbar />
      <div className='body'>
        <div className='mt-8'>
          <div>
            <label className='block'>Enter Blog</label>
            <div className='flex'>
              <input
                className='border-b-2 border-indigo-300 w-1/2 mt-2 outline-none'
                type='text'
                placeholder='Enter new Blog ..'
                onChange={(e) => setTextBlog(e.target.value)}
                value={textBlog}
              >
              </input>
              <button className='btn_green border-2 border-blue-400 rounded-2xl px-4 ml-3 ' onClick={addBlog} >Add</button>
            </div>
          </div>


          {
            blogData.length > 0 ? (
              <>
                <div className='mt-4 pb-4  border-2 border-gray-500 rounded-lg  '>
                  <button className='text-center w-full btn_green my-2 font-bold rounded-lg' onClick={() => {
                    setBtn(!btn);
                    if (btn === false) {
                      setUId('');
                      setUpd(false);
                    }
                  }} >
                    {
                      btn === false ? <span className='border-y-2 border-blue-500 '>Show My Blog</span> : <span className='border-y-2 border-red-500 text-red-400'>Close my Blog</span>
                    }

                  </button>
                  {
                    btn === true ? (
                      myBlog.length !== 0 ? (
                        myBlog.map((blog, index) => (
                          <>
                            <div key={index} className='border-2 shadow-xl shadow-gray-400/50 rounded-xl p-3 m-2'>
                              <div className="flex ">
                                <p className='border-b-2 text-2xl'><span className='font-bold'>Name:</span> {blog.name}</p>
                                <p className='ml-10'><span className='font-bold'>Date:</span> {format(new Date(blog.date), 'MMMM dd, yyyy')}</p>
                              </div>
                              <p className='text-lg pt-2'><span className='font-bold'>Topic:</span> {blog.blog_topic}</p>
                              <div className='flex '>
                                <button className='text-center w-1/2 ' onClick={() => { setUpd(!upd); setUId(blog._id) }}>
                                  {upd === false ? <span className='green rounded-2xl border-2 border-indigo-500 px-2'>Update</span> : uId === blog._id ? <span className='red rounded-2xl border-2 border-indigo-500 px-2'>Close</span> : ''}
                                </button>
                                <button className='text-center w-1/4 red rounded-2xl border-2 border-indigo-500 px-2' onClick={() => deleteBlog(blog._id)}>Delete</button>
                              </div>
                              {upd === true && uId === blog._id ? (
                                <div className='block'>
                                  <>
                                    <input
                                      className='border-b-2 border-indigo-300 w-4/3 mt-2 outline-none'
                                      type='text'
                                      placeholder='Enter Updated Blog ..'
                                      onChange={(e) => setUp_MyBlog({ data: e.target.value, id: blog._id })}
                                    // value={blog.blog_topic}
                                    ></input>
                                    <button class='green rounded-2xl border-2 border-indigo-500 px-2' onClick={updateBlog}>Update</button>
                                  </>
                                </div>
                              ) : ('')
                              }
                            </div>
                          </>
                        ))

                      ) : (
                        <div className='w-full text-center'><span>My Blog is not available</span></div>
                      )

                    ) : ('')
                  }
                </div>
              </>
            ) : ('')}

        </div>


        <div className='mt-8'>
          <label className='block text-center w-full mb-2 border-y-2 border-blue-300 font-bold italic'>Show all Blog</label>
          {
            blogData.length > 0 ? (
              blogData.map((blogs, index) => (
                <div key={index} className='border-2 shadow-xl shadow-blue-300/50 rounded-xl p-3 mb-4 '>
                  <div className="flex ">
                    <p className='border-b-2 text-2xl'><span className='font-bold'>Name:</span> {blogs.name}</p>
                    <p className='ml-10'><span className='font-bold'>Date:</span> {format(new Date(blogs.date), 'MMMM dd, yyyy')}</p>
                  </div>
                  <p className='text-lg pt-2'><span className='font-bold'>Blog Topic:</span> {blogs.blog_topic}</p>
                </div>
              ))
            ) : (
              <>
                <p>No blogs available, Login First</p>
              </>
            )

          }
        </div>
      </div>
    </>
  )
}
