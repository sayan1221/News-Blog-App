import React, { useEffect, useState } from 'react';
import './css/style.css';
// import Navbar from './Navbar';
import cricket from './image/cricket3.png';
import validator from 'validator';
import Navbar from './Navbar';
import ImageSlider from './ImageSlider';

export default function Body() {

  const [data, setData] = useState("");
  const [search, setSearch] = useState('kolkata');
  const [topic, setTopic] = useState([]);
  // console.log(topic);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const url = `https://newsapi.org/v2/everything?q=${search}&apiKey=17293afbabcb4d92b0d0168aa4b66395`;
        const response = await fetch(url);
        const respJson = await response.json();
        console.log("JSON data API", respJson);
        setData(respJson);
      } catch (error) {
        console.error("Error fetching the API:", error);
      }
    }
    fetchApi();
    get_topic();
  }, [search]);

  // get button data
  const handelInput = (e) => {
    setSearch(e.target.value);
  }

  // get date properly format wise
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const getInputData = (item) => {
    setSearch(item);
  }


  const get_topic = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/get_topic', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching topics: ', errorText);
        return;
      }
      const data = await response.json();
      setTopic(data);
    } catch (err) {
      console.error('Topic not fetch ', err);
    }
  }



  return (
    <>
      <Navbar typeData={getInputData} />
      <div className='body'>

        <ImageSlider />

        <div className='container_btn grid gap-4 grid-cols-5 mb-4 mt-5'>
          {
            topic.length > 0 ? (
              topic.map((topics, index) => (
                <button key={index} className='button border-4  hover:shadow-blue-500/50 ' value={topics.topic_name} onClick={handelInput}>{topics.topic_name}</button>
              ))
            ) : (
              <>
                <button className='button border-4 ' value='Delhi' onClick={handelInput}>Delhi</button>
                <button className='button border-4 ' value='cricket' onClick={handelInput}><img className='newsImg' src={cricket}></img></button>
                <button className='button border-4 ' value='Football' onClick={handelInput}>Football</button>
                <button className='button border-4 ' value='Stock' onClick={handelInput}>Stock</button>

              </>
            )
          }
          </div>

        {data && data.articles && data.articles.length > 0 ? (<div><p className="text-2xl heading ">{search} News</p><br /></div>) : ("")}
        {data && data.articles && data.articles.length > 0 ? (
          data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).map((article, index) => {

            const date = formatDate(article.publishedAt);
            return (
              <div key={index} className='card border-2 shadow-xl shadow-blue-500/50 rounded-xl p-3 mb-4'>
                <div className=' shadow-xl '>
                  <p className="text-2xl title">{article.title}</p>
                </div>
                <div className='text-lg pt-2'>
                  <p>Date: {date}</p>
                  <p>{article.description}</p>
                  <img src={article.urlToImage}></img>
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}

      </div>
    </>
  )
}
