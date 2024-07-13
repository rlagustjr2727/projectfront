import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';
import Modal from '../Modal/Modal';

const Carousel = () => {
  const images = [
    'images/ontake.png',
    'images/busan_whiskey.png',
    'images/johnnie.png'
    // 필요한 만큼 추가 이미지 경로를 넣어주세요
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isAutoSliding) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000); // 3초마다 자동 슬라이드 변경
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isAutoSliding, currentIndex]);

  useEffect(() => {
    const handleSlideChange = () => {
      setIsAutoSliding(false); // 슬라이드 변경 시 자동 슬라이딩 정지
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsAutoSliding(true); // 10초 후 자동 슬라이딩 다시 시작
      }, 10000); // 10초 (10000ms)
    };

    window.addEventListener('click', handleSlideChange);

    return () => {
      window.removeEventListener('click', handleSlideChange);
    };
  }, [currentIndex]);

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  const handlePrevClick = () => {
    setIsAutoSliding(false); // 이전 버튼 클릭 시 자동 슬라이딩 정지
    prevSlide();
  };

  const handleNextClick = () => {
    setIsAutoSliding(false); // 다음 버튼 클릭 시 자동 슬라이딩 정지
    nextSlide();
  };

  const handleDotClick = (index) => {
    setIsAutoSliding(false); // 직접 슬라이드 선택 시 자동 슬라이딩 정지
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="carousel">
      <button className="prev" onClick={handlePrevClick}>&#10094;</button>
      <button className="next" onClick={handleNextClick}>&#10095;</button>
      <div className="slide-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={index === currentIndex ? 'slide active' : 'slide'}
            onClick={handleImageClick}
          >
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === currentIndex ? 'dot active' : 'dot'}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
      {isModalOpen && <Modal image={images[currentIndex]} onClose={closeModal} />}
    </div>
  );
};

export default Carousel;
