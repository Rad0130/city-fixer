import React from 'react';
import Banner from '../../components/Banner';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import Features from '../../components/Features';
import IssueCard from '../Issues/IssueCard';

const Home = () => {
    const axios = useAxios();

    const { data: resolvedIssues = [] } = useQuery({
        queryKey: ['resolvedIssues'],
        queryFn: async () => {
            const res = await axios.get('/issues/resolved');
            return res.data;
        }
    });

    return (
        <div className='mt-16 bg-white overflow-x-hidden'>
            <Banner />

            {/* Latest Resolved Issues Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                        Latest Impact
                    </h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    <p className="mt-4 text-gray-500 font-medium">Real problems solved by real citizens</p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {resolvedIssues.map(issue => (
                        <div key={issue._id} className="transform transition-all duration-300 hover:-translate-y-2">
                            <IssueCard issue={issue} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Our Platform - Vivid Gradient Section */}
            <section className="py-24 relative overflow-hidden bg-slate-900">
                {/* Background decorative blobs */}
                <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-widest uppercase">Features</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Why Choose Our Platform</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            We bridge the gap between community needs and government action through a seamless, transparent digital ecosystem.
                        </p>
                    </div>
                    <Features />
                </div>
            </section>

            {/* How It Works - Glassmorphism Design */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">The Process</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto italic">Fixing your neighborhood in four simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                        {/* Desktop Connecting Line */}
                        <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent z-0"></div>

                        {[
                            { step: '1', title: 'Report Issue', desc: 'Capture details and location via our intuitive interface.', color: 'from-blue-500 to-cyan-400' },
                            { step: '2', title: 'Review & Assign', desc: 'Admins verify and dispatch tasks to the right department.', color: 'from-indigo-500 to-purple-500' },
                            { step: '3', title: 'Track Updates', desc: 'Get notified as your report moves from "Pending" to "In Progress".', color: 'from-fuchsia-500 to-pink-500' },
                            { step: '4', title: 'Resolution', desc: 'See the results and rate the service quality.', color: 'from-emerald-500 to-teal-400' }
                        ].map((item, idx) => (
                            <div key={idx} className="group flex flex-col items-center text-center relative z-10">
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg shadow-indigo-200 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform duration-300`}>
                                    <span className="text-3xl font-black text-white -rotate-3 group-hover:-rotate-12">{item.step}</span>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 hover:border-indigo-200 transition-colors">
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics - High Energy Gradient */}
            <section className="py-20 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { label: 'Issues Reported', val: '10,000+' },
                            { label: 'Resolution Rate', val: '85%' },
                            { label: 'Response Time', val: '24h' },
                            { label: 'Cities Covered', val: '50+' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stat.val}</div>
                                <div className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Elegant Cards */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Voices of the City</h2>
                        <div className="w-16 h-1 bg-fuchsia-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah Johnson', role: 'Local Resident', color: 'from-blue-400 to-indigo-500', text: "Reported a broken streetlight in my area. It was fixed within 48 hours! This platform truly works." },
                            { name: 'Michael Chen', role: 'Business Owner', color: 'from-emerald-400 to-cyan-500', text: "The pothole in front of my shop was fixed in record time. Great transparency and updates throughout." },
                            { name: 'Priya Sharma', role: 'Community Leader', color: 'from-orange-400 to-rose-500', text: "Our community park cleanup was organized through this platform. 50+ volunteers participated!" }
                        ].map((t, i) => (
                            <div key={i} className="group bg-slate-50 p-10 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-transparent hover:border-slate-100">
                                <div className="flex items-center mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} shadow-lg shadow-indigo-100`}></div>
                                    <div className="ml-4">
                                        <h4 className="font-extrabold text-slate-800">{t.name}</h4>
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-tighter">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed italic">"{t.text}"</p>
                                <div className="mt-6 flex gap-1 text-orange-400">
                                    {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;