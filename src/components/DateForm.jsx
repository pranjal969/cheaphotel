import React, { useState } from 'react';
import { apiCall } from '../apis/api';
import DatePicker from 'react-datepicker';
const DateForm = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [customerType, setCustomerType] = useState('regular');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Initialize loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        setLoading(true); // Start loading

        // Generate a list of dates between startDate and endDate
        const dateArray = [];
        let currentDate = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (currentDate && end) {
            while (currentDate <= end) {
                dateArray.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else if (currentDate) {
            dateArray.push(currentDate.toISOString().split('T')[0]);
        }

        try {
            const { data, error } = await apiCall('/hotels/calculate-prices', 'POST', {
                dates: dateArray,
                customerType: customerType
            });

            if (error) {
                setError('Error calculating prices. Please check your inputs.');
            } else {
                setResult(data);
                setError('');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setResult(null);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                        <h2 className="text-center mb-4">Hotel Pricing Calculator</h2>

                        <div className="mb-3">
                            <label className="form-label">Select Start Date: </label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select start date"
                                isClearable
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Select End Date: </label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select end date"
                                isClearable
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Customer Type: </label>
                            <select
                                value={customerType}
                                onChange={(e) => setCustomerType(e.target.value)}
                                className="form-select"
                            >
                                <option value="regular">Regular</option>
                                <option value="reward">Reward</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Calculating Prices...' : 'Calculate Prices'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="row justify-content-center mt-4">
                <div className="col-12 col-md-8 col-lg-6">
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className={`mb-4 card ${result.customerType === 'regular' ? 'card-regular' : 'card-reward'}`}>
                            <div className="card-body">
                                <h2 className="card-title">Best Hotel Result</h2>
                                <p className="card-text">Hotel Name: {result.hotelName}</p>
                                <p className="card-text">Hotel Rating: {result.hotelRating}</p>
                                <p className="card-text">Total Price: ${result.totalPrice}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DateForm;