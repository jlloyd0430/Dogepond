import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './AdBannerCarousel.css';
import catsbanner from "./uploads/catsbanner.jpg";
import novalabs from "./uploads/novabanner.jpg";
import rpc from "./uploads/rpc.webp";
import nekko from "./uploads/jrnekko.webp";
import dwarves from "./uploads/dwarves.webp";
import bot from "./uploads/botservices.webp";

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
        <img src={rpc} alt="Ad Banner 4" />
        {/* <p className="legend">Ad Banner 4</p> */}
      </div>
     <div>
        <img src={bot} alt="Banner" />
        {/* <p className="legend">Ad Banner 5</p> */}
      </div>
       <div>
        <img src={nekko} alt="Ad Banner 5" />
        {/* <p className="legend">Ad Banner 6/p> */}
      </div>
      <div>
        <img src={dwarves} alt="Ad Banner 5" />
        {/* <p className="legend">Ad Banner 5/p> */}
      </div>
    </Carousel>
  );
};

export default AdBannerCarousel;
