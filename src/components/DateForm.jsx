import React, { useState } from 'react';
import { apiCall } from '../apis/api';

const DateForm = () => {
    const [dates, setDates] = useState('');
    const [customerType, setCustomerType] = useState('regular');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dateArray = dates.split(',').map(date => date.trim());

        // Call the common API call method
        const { data, error } = await apiCall('http://localhost:8080/hotels/calculate-prices', 'POST', {
            dates: dateArray,
            customerType: customerType
        });

        if (error) {
            setError('Error calculating prices. Please check your inputs.');
            setResult(null);
        } else {
            setResult(data);
            setError('');
        }
    };
  return (
    <div className="container mt-5">
    <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
            <label className="form-label">Enter Dates (YYYY-MM-DD): </label>
            <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="form-control"
                placeholder="2024-10-13, 2024-10-14, ..."
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
        <button type="submit" className="btn btn-primary w-100">Calculate Prices</button>
    </form>

    {error && (
        <div className="alert alert-danger mt-4">
            {error}
        </div>
    )}

    {result && (
        <div className="card mt-4">
            <div className="card-body">
                <h2 className="card-title">Best Hotel Result</h2>
                <p className="card-text">Hotel Name: {result.hotelName}</p>
                <p className="card-text">Hotel Rating: {result.hotelRating}</p>
                <p className="card-text">Total Price: ${result.totalPrice}</p>
            </div>
        </div>
    )}
</div>

  )
}

export default DateForm