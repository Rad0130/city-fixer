import React from 'react';
import  {Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';

const Features = () => {
    return (
        <Swiper
        effect={'coverflow'}
        grabCursor={true}
        loop={true}
        centeredSlides={true}
        slidesPerView={3}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
        >
            <SwiperSlide>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Real-time Tracking</h3>
                        <p className="text-gray-600">
                        Track your reported issues from submission to resolution with live updates and notifications.
                        </p>
                    </div>
            </SwiperSlide>
            <SwiperSlide>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 rounded-full bg-linear-to-r from-green-500 to-teal-500 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Response</h3>
                        <p className="text-gray-600">
                        Priority routing ensures critical issues get immediate attention from relevant departments.
                        </p>
                    </div>
            </SwiperSlide>
            <SwiperSlide>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Community Support</h3>
                        <p className="text-gray-600">
                        Upvote issues to show importance and collaborate with neighbors on community problems.
                        </p>
                    </div>
            </SwiperSlide>
            <SwiperSlide>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Data Insights</h3>
                        <p className="text-gray-600">
                        Comprehensive analytics help city officials make data-driven decisions for infrastructure planning.
                        </p>
                    </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Issue Categorization</h3>
                <p className="text-gray-600">
                    Automatically categorizes reported problems to ensure faster routing to the right city departments.
                </p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-linear-to-r from-emerald-500 to-lime-500 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0c-3.314 0-6 1.79-6 4v2h12v-2c0-2.21-2.686-4-6-4z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Verified Authority Updates</h3>
                <p className="text-gray-600">
                    Receive transparent progress updates directly from verified city officials for better trust and accountability.
                </p>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default Features;