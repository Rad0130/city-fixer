import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import city1 from '../assets/city1.jpg';
import city2 from '../assets/city2.jpg';
import city3 from '../assets/city3.jpg';
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
    return (
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} className='h-140'>
                <div>
                    <img className='h-145 bg-cover' src={city1} />
                </div>
                <div>
                    <img className='h-145 bg-cover' src={city2} />
                </div>
                <div>
                    <img className='h-145 bg-cover' src={city3} />
                </div>
                <div>
                    <img className='h-145 bg-cover' src={banner1} />
                </div>
                <div>
                    <img className='h-145 bg-cover' src={banner2} />
                </div>
                <div>
                    <img className='h-145 bg-cover' src={banner3} />
                </div>
        </Carousel>
    );
};

export default Banner;