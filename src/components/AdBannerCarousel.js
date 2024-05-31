import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './AdBannerCarousel.css';
import catsbanner from "./uploads/catsbanner.jpg"
import novalabs from "./uploads/novabanner.jpg"
import wizards from "./uploads/wizardbanner.jpg"

const AdBannerCarousel = () => {
  return (
    <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false}>
      <div>
        <img src={catsbanner} alt="Ad Banner 1" />
        {/* <p className="legend">Ad Banner 1</p> */}
      </div>
      <div>
        <img src={novalabs} alt="Ad Banner 2" />
        {/* <p className="legend">Ad Banner 2</p> */}
      </div>
      <div>
        <img src={wizards} alt="Ad Banner 3" />
        {/* <p className="legend">Ad Banner 3</p> */}
      </div>
    </Carousel>
  );
};

export default AdBannerCarousel;
