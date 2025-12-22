import React, { useState, useRef, useEffect } from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import IssueCard from './IssueCard';
import NoIssuesFound from './NoIssuesFound';

const AllIssues = () => {
    const axios = useAxios();
    const [filters, setFilters] = useState({
        categories: [],
        status: [],
        priority: []
    });
    const [search, setSearch] = useState('');
    const [count,setCount] = useState(0);
    const [currentPage,setCurrentPage]=useState(0);
    
    const searchInputRef = useRef(null);
    const isTypingRef = useRef(false);

    const { data: issues = [], isLoading, isFetching } = useQuery({
        queryKey: ['issues', filters, search, currentPage],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters.categories.length)
                params.append('category', filters.categories.join(','));

            if (filters.status.length)
                params.append('status', filters.status.join(','));

            if (filters.priority.length)
                params.append('priority', filters.priority.join(','));

            if (search) {
                params.append('search', search);
            }

            const res = await axios.get(`/issues?${params.toString()}&limit=10&skip=${currentPage*10}`);
            return res.data;
        },
        keepPreviousData: true,
        staleTime: 3000,
        cacheTime: 10000,
    });

    useEffect(()=>{
        axios.get('/issues/count').then(res=>{
            setCount(res.data.count);
        });
    },[axios]);

    // Handle search input focus
    const handleSearchChange = (e) => {
        isTypingRef.current = true;
        setSearch(e.target.value);
    };

    // Effect to maintain focus
    useEffect(() => {
        if (isTypingRef.current && searchInputRef.current) {
            // Set cursor position to end
            const input = searchInputRef.current;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
            isTypingRef.current = false;
        }
    }, [issues, filters, search]);

    if (isLoading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <span className="loading loading-spinner text-primary"></span>
        </div>
    }

    const isSelected = (type, value) =>
        filters[type].includes(value);

    const categories = [...new Set(issues.map(issue => issue.category))];

    const toggleFilter = (type, value) => {
        setFilters(prev => {
            const exists = prev[type].includes(value);
            return {
                ...prev,
                [type]: exists
                    ? prev[type].filter(item => item !== value)
                    : [...prev[type], value]
            };
        });
    };

    const allStatus = ['Open', 'In Progress', 'Resolved'];
    const priority = ['High', 'Normal'];

    return (
        <div className='mt-20 mb-5'>
            <div className='flex flex-col md:flex-row items-center justify-between mb-4'>
                <div>
                    <h2 className='text-3xl font-bold'>Complained Issues({count})</h2>
                </div>
                <div className='flex flex-row-reverse items-center gap-5'>
                    <div className="dropdown dropdown-start">
                        <div tabIndex={0} role="button" className="btn m-1">Filter By ⬇️</div>
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li><a>
                                <div>
                                    <div className="dropdown dropdown-start">
                                        <div tabIndex={0} role="button" className="btn m-1">Category ⬇️</div>
                                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                            {categories.map(category => (
                                                <li key={category}>
                                                    <button
                                                        onClick={() => toggleFilter('categories', category)}
                                                        className={`btn btn-sm w-full ${isSelected('categories', category)
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-base-200'
                                                            }`}
                                                    >
                                                        {category}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </a></li>
                            <li><a>
                                <div>
                                    <div className="dropdown dropdown-start">
                                        <div tabIndex={0} role="button" className="btn m-1">Status ⬇️</div>
                                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                            {allStatus.map(status => (
                                                <li key={status}>
                                                    <button
                                                        onClick={() => toggleFilter('status', status)}
                                                        className={`btn btn-sm w-full ${isSelected('status', status)
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-base-200'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </a></li>
                            <li><a>
                                <div>
                                    <div className="dropdown dropdown-start">
                                        <div tabIndex={0} role="button" className="btn m-1">Priority ⬇️</div>
                                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                            {priority.map(pri => (
                                                <li key={pri}>
                                                    <button
                                                        onClick={() => toggleFilter('priority', pri)}
                                                        className={`btn btn-sm w-full ${isSelected('priority', pri)
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-base-200'
                                                            }`}
                                                    >
                                                        {pri}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </a></li>
                        </ul>
                    </div>
                    <div>
                        <label className="input">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input 
                                ref={searchInputRef}
                                onChange={handleSearchChange} 
                                value={search} 
                                type="search" 
                                required 
                                placeholder="Search" 
                            />
                        </label>
                    </div>
                </div>
            </div>
            {isFetching && (
                <div className="flex justify-center my-3">
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                {issues.length === 0 && !isFetching ? (
                    <div className="md:col-span-5">
                        <NoIssuesFound />
                    </div>
                ) : (
                    issues.map(issue => (
                        <IssueCard key={issue._id} issue={issue} />
                    ))
                )}
            </div>
            <div className='flex justify-center my-10'>
                <div className='flex gap-4 flex-wrap'>
                    {
                        <button onClick={()=>setCurrentPage(currentPage-1)} className={`btn ${currentPage===0 && "btn-disabled"}`}>
                            Prev
                        </button>
                    }
                    {
                        [...Array(Math.ceil(count/10)).keys()].map(i=><button key={i} onClick={()=>setCurrentPage(i)} className={`btn ${i===currentPage && "btn-primary"}`}>{i+1}</button>)
                    }
                    {
                        <button onClick={()=>setCurrentPage(currentPage+1)} className={`btn ${currentPage===(Math.ceil(count/10))-1 && "btn-disabled"}`}>
                            Next
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};
export default AllIssues;