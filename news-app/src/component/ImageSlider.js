import React, { useEffect, useState } from 'react';
import './css/imgSlider.css';
import left from './image/left-arrow.png';
import right from './image/right-arrow.png';

import img1 from './image/pexels-kaboompics-6335.jpg';
import img2 from './image/pexels-markusspiske-3970328.jpg';
import img3 from './image/pexels-nappy-935979.jpg';

const ImageSlider = (props) => {
  const images = [
    { img: img1, text: 'cricket' },
    { img: img2, text: 'stocks' },
    { img: img3, text: 'latest' },
    { img: img2, text: 'stocks market' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPreviousSlide = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className='main_container'>
      <div className="slider-container">
        <div className="arrow left" onClick={goToPreviousSlide}>
          <img src={left} alt="Previous" />
        </div>
        {images.map((image, index) => (
          <div
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            key={index}
            style={{ backgroundImage: `url(${image.img})` }}
          >
            {/* <div>
              <p></p>
              <button
                className='news_text'
                onClick={() => props.select(image.text)}
              >
                {image.text} news
              </button>
            </div> */}
          </div>
        ))}
        <div className="arrow right" onClick={goToNextSlide}>
          <img src={right} alt="Next" />
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
