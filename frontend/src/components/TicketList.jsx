import React, { useState, useEffect } from 'react';

const TicketList = ({ refreshTrigger }) => {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const CATEGORIES = ['billing', 'technical', 'account', 'general'];
    const PRIORITIES = ['low', 'medium', 'high', 'critical'];
    const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

    const fetchTickets = async () => {
        setIsLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (categoryFilter) params.append('category', categoryFilter);
            if (priorityFilter) params.append('priority', priorityFilter);
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);

            const url = `http://localhost:8000/api/tickets/?${params.toString()}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                setError('Failed to fetch tickets');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch on mount or when filters change (except search which is debounced)
    useEffect(() => {
        fetchTickets();
    }, [categoryFilter, priorityFilter, statusFilter, refreshTrigger]);

    // Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchTickets();
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/api/tickets/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                fetchTickets();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status.replace('_', '-')}`;
    };

    return (
        <div className="ticket-list-container">
            <div className="list-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>

                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="">All Priorities</option>
                        {PRIORITIES.map(p => (
                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                    </select>

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {isLoading ? (
                <div className="loading-state">Loading tickets...</div>
            ) : tickets.length === 0 ? (
                <div className="empty-state">No tickets found.</div>
            ) : (
                <div className="ticket-grid">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className={`ticket-card priority-${ticket.priority}`}>
                            <div className="card-header">
                                <span className={`priority-tag ${ticket.priority}`}>{ticket.priority}</span>
                                <span className={getStatusClass(ticket.status)}>{ticket.status.replace('_', ' ')}</span>
                            </div>
                            <h3 className="ticket-title">{ticket.title}</h3>
                            <p className="ticket-desc">
                                {ticket.description.length > 100
                                    ? ticket.description.substring(0, 100) + '...'
                                    : ticket.description}
                            </p>
                            <div className="ticket-meta">
                                <span className="category-label">📁 {ticket.category}</span>
                                <span className="date-label">📅 {formatDate(ticket.created_at)}</span>
                            </div>
                            <div className="card-actions">
                                <label>Change Status:</label>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                >
                                    {STATUSES.map(s => (
                                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketList;
