import { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import './SearchEvents.css';

const SearchEvents = () => {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [role, setRole] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setHasSearched(true);

    try {
      const filters = {
        keyword: keyword.trim(),
        start_date: startDate,
        end_date: endDate,
        user_id: user.id,
        role: role,
      };

      const response = await eventsAPI.searchEvents(filters);
      setResults(response.data || []);
    } catch (err) {
      setError(err.response?.data || 'Failed to search events');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setRole('');
    setResults([]);
    setHasSearched(false);
    setError('');
  };

  return (
    <div className="search-events-page">
      <div className="page-header">
        <div>
          <h1>
            <ion-icon name="search-outline"></ion-icon>
            Search Events
          </h1>
          <p>Find events by keywords, dates, and your role</p>
        </div>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-filters">
            <div className="filter-group">
              <label htmlFor="keyword">
                <ion-icon name="text-outline"></ion-icon>
                Keywords
              </label>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search event name or description..."
              />
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="startDate">
                  <ion-icon name="calendar-outline"></ion-icon>
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="endDate">
                  <ion-icon name="calendar-outline"></ion-icon>
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="role">
                <ion-icon name="shield-outline"></ion-icon>
                My Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="organizer">Organizer</option>
                <option value="invitee">Invitee</option>
                <option value="collaborator">Collaborator</option>
              </select>
            </div>
          </div>

          <div className="search-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <ion-icon name="hourglass-outline" className="spin"></ion-icon>
                  Searching...
                </>
              ) : (
                <>
                  <ion-icon name="search-outline"></ion-icon>
                  Search
                </>
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <ion-icon name="refresh-outline"></ion-icon>
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {hasSearched && !loading && (
        <div className="search-results">
          <h2>
            <ion-icon name="list-outline"></ion-icon>
            Search Results ({results.length})
          </h2>

          {results.length === 0 ? (
            <div className="no-results">
              <ion-icon name="search-outline"></ion-icon>
              <h3>No events found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="results-grid">
              {results.map((event) => (
                <div key={event.id} className="result-card">
                  <h3>
                    <ion-icon name="calendar"></ion-icon>
                    {event.name}
                  </h3>
                  <p>
                    <ion-icon name="calendar-outline"></ion-icon>
                    {event.date} at {event.time}
                  </p>
                  <p>
                    <ion-icon name="location-outline"></ion-icon>
                    {event.location}
                  </p>
                  {event.description && (
                    <p className="description">
                      <ion-icon name="document-text-outline"></ion-icon>
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchEvents;
