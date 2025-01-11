import React, { useEffect,useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './component/Body';
import Navbar from './component/Navbar';
import Demo from './component/Demo';
import ImageSlider from './component/ImageSlider';
import About from './component/About';
import Blog from './component/Blog';
import Login from './component/Login';
import Profile from './component/Profile';

function App() {

  const [data, setData] = useState("");
  const [search, setSearch] = useState("kolkata");
  useEffect(() => {
    const fetchApi = async () => {
      try{
      const url = `https://newsapi.org/v2/everything?q=${search}&apiKey=17293afbabcb4d92b0d0168aa4b66395`;
      const response = await fetch(url);
      const respJson = await response.json();
      console.log(respJson);
      setData(respJson);
      }catch(er){
        console.error("Error fetching the API:", er);
      }
    }
    // fetchApi();
  }, [search])

  return (
    <>
      <div className=''>
      <BrowserRouter>
        <Routes>
          <Route exact path='/Navbar' element={<Navbar/>}></Route>
          <Route exact path='/ImageSlider' element={<ImageSlider/>}></Route>
          <Route exact path='/' element={<Body />}></Route>
          <Route exact path='/About' element={<About/>}></Route>
          <Route exact path='/Blog' element={<Blog/>}></Route>
          <Route exact path='/Login' element={<Login/>}></Route>
          <Route exact path='/Profile' element={<Profile/>}></Route>
        </Routes>
      </BrowserRouter>
        
        {/* <Demo /> */}
        
        
      </div>
    </>
  );
}

export default App;
