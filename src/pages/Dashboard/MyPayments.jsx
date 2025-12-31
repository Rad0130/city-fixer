import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const MyPayments = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency function
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg"></div>
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Error loading payment history. Please try again.</span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className='font-bold text-3xl text-gray-800'>Payment History</h1>
                <p className="text-gray-600 mt-2">
                    {payments.length > 0 
                        ? `You have ${payments.length} payment${payments.length !== 1 ? 's' : ''}`
                        : 'No payments found'
                    }
                </p>
            </div>
            
            {payments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold text-gray-700">No Payments Yet</h3>
                    <p className="text-gray-500">Your payment history will appear here once you make a payment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="table">
                        {/* head */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="font-semibold text-gray-700">Issue Name</th>
                                <th className="font-semibold text-gray-700">Transaction ID</th>
                                <th className="font-semibold text-gray-700">Paid By</th>
                                <th className="font-semibold text-gray-700">Amount</th>
                                <th className="font-semibold text-gray-700">Payment Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={payment._id || payment.transactionId || index} 
                                    className="hover:bg-gray-50 transition-colors">
                                    <td>
                                        <div className="font-medium text-gray-900">
                                            {payment.IssueName || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-mono text-sm text-gray-600">
                                            {payment.transactionId || 'No ID'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {payment.paidBy || 'Unknown User'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-green-600">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-gray-700">
                                            {payment.createdAt ? formatDate(payment.createdAt) : 'N/A'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Payment Summary */}
            {payments.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-white rounded-lg shadow p-6">
                        <div className="stat-title text-gray-600">Total Payments</div>
                        <div className="stat-value text-3xl font-bold text-blue-600">
                            {payments.length}
                        </div>
                    </div>
                    <div className="stat bg-white rounded-lg shadow p-6">
                        <div className="stat-title text-gray-600">Total Amount</div>
                        <div className="stat-value text-3xl font-bold text-green-600">
                            {formatCurrency(
                                payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
                                payments[0]?.currency
                            )}
                        </div>
                    </div>
                    <div className="stat bg-white rounded-lg shadow p-6">
                        <div className="stat-title text-gray-600">Last Payment</div>
                        <div className="stat-value text-xl font-semibold text-gray-800">
                            {payments.length > 0 && payments[0].createdAt 
                                ? formatDate(payments[0].createdAt) 
                                : 'N/A'
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPayments;