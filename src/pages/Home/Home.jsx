import React from 'react';
import Banner from '../../components/Banner';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import Features from '../../components/Features';
import IssueCard from '../Issues/IssueCard';

const Home = () => {
    const axios=useAxios();

    const {data:allIssues=[]}=useQuery({
        queryKey:['issues'],
        queryFn: async()=>{
            const res=await axios.get('/issues');
            return res.data;
        }
    })

    const resolvedIssues=allIssues.filter(issue=>issue.status==='Resolved');

    return (
        <div className='mt-16'>
            <Banner></Banner>
            <div>
                <h1 className='font-bold text-4xl mt-20 mb-10'>latest Resolved Issues</h1>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                {
                    resolvedIssues.slice(0,6).map(issue=>
                        <IssueCard key={issue._id} issue={issue}></IssueCard>
                    )
                }
            </div>

            {/* feature section */}
            <section className="py-16 bg-linear-to-b from-white to-blue-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Platform</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Empowering citizens to make their cities better through technology
                    </p>
                    </div>

                    <div>
                        <Features></Features>
                    </div>
                </div>
            </section>

            {/* <!-- How It Works Section --> */}
            <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Simple steps to report and resolve public issues in your city
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* <!-- Step 1 --> */}
                <div className="relative">
                    <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-6 relative z-10">
                        <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Report Issue</h3>
                        <p className="text-gray-600">
                        Take a photo, add description and location of the issue through our mobile or web app.
                        </p>
                    </div>
                    </div>
                </div>

                {/* <!-- Step 2 --> */}
                <div className="relative">
                    <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-linear-to-r from-green-500 to-teal-600 flex items-center justify-center mb-6 relative z-10">
                        <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Review & Assign</h3>
                        <p className="text-gray-600">
                        Admin reviews and assigns the issue to relevant staff based on category and location.
                        </p>
                    </div>
                    </div>
                </div>

                {/* <!-- Step 3 --> */}
                <div className="relative">
                    <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-linear-to-r from-orange-500 to-amber-600 flex items-center justify-center mb-6 relative z-10">
                        <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Progress Updates</h3>
                        <p className="text-gray-600">
                        Track real-time updates as staff works on the issue. Get notified about progress changes.
                        </p>
                    </div>
                    </div>
                </div>

                {/* <!-- Step 4 --> */}
                <div className="relative">
                    <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-linear-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-6 relative z-10">
                        <span className="text-2xl font-bold text-white">4</span>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Resolution & Feedback</h3>
                        <p className="text-gray-600">
                        Issue gets resolved and closed. Provide feedback to help improve city services.
                        </p>
                    </div>
                    </div>
                </div>
                </div>

                {/* <!-- Connecting Lines for Desktop --> */}
                <div className="hidden md:block absolute top-40 left-0 right-0">
                <div className="flex justify-center">
                    <div className="w-3/4 h-1 bg-linear-to-r from-blue-500 via-green-500 to-purple-500 opacity-30 rounded-full"></div>
                </div>
                </div>
            </div>
            </section>

            {/* <!-- Extra Section 1: Statistics --> */}
            <section className="py-16 bg-linear-to-r from-indigo-600 to-purple-700 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Making a Real Difference</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    Join thousands of citizens who are actively improving their communities
                </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">10,000+</div>
                    <p className="text-lg opacity-90">Issues Reported</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">85%</div>
                    <p className="text-lg opacity-90">Resolution Rate</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">24h</div>
                    <p className="text-lg opacity-90">Average Response Time</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">50+</div>
                    <p className="text-lg opacity-90">Cities Covered</p>
                </div>
                </div>
            </div>
            </section>

            {/* <!-- Extra Section 2: Testimonials --> */}
            <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">What Citizens Say</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Real stories from people who made their neighborhoods better
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* <!-- Testimonial 1 --> */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-400 to-purple-500"></div>
                    <div className="ml-4">
                        <h4 className="font-bold text-gray-800">Sarah Johnson</h4>
                        <p className="text-sm text-gray-600">Local Resident</p>
                    </div>
                    </div>
                    <p className="text-gray-600 italic">
                    "Reported a broken streetlight in my area. It was fixed within 48 hours! This platform truly works."
                    </p>
                    <div className="mt-4 flex text-yellow-400">
                    <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                    </div>
                </div>

                {/* <!-- Testimonial 2 --> */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-green-400 to-teal-500"></div>
                    <div className="ml-4">
                        <h4 className="font-bold text-gray-800">Michael Chen</h4>
                        <p className="text-sm text-gray-600">Business Owner</p>
                    </div>
                    </div>
                    <p className="text-gray-600 italic">
                    "The pothole in front of my shop was fixed in record time. Great transparency and updates throughout."
                    </p>
                    <div className="mt-4 flex text-yellow-400">
                    <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                    </div>
                </div>

                {/* <!-- Testimonial 3 --> */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-orange-400 to-red-500"></div>
                    <div className="ml-4">
                        <h4 className="font-bold text-gray-800">Priya Sharma</h4>
                        <p className="text-sm text-gray-600">Community Leader</p>
                    </div>
                    </div>
                    <p className="text-gray-600 italic">
                    "Our community park cleanup was organized through this platform. 50+ volunteers participated!"
                    </p>
                    <div className="mt-4 flex text-yellow-400">
                    <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                    </div>
                </div>
                </div>
            </div>
            </section>
        </div>
    );
};

export default Home;