import React, { useState } from 'react';

const CreateTicketForm = ({ onTicketCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [isClassifying, setIsClassifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const CATEGORIES = [
        { value: 'billing', label: 'Billing' },
        { value: 'technical', label: 'Technical' },
        { value: 'account', label: 'Account' },
        { value: 'general', label: 'General' },
    ];

    const PRIORITIES = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
    ];

    const handleDescriptionBlur = async () => {
        if (!description.trim()) return;

        setIsClassifying(true);
        setApiError('');
        try {
            const response = await fetch('http://localhost:8000/api/tickets/classify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.suggested_category) setCategory(data.suggested_category);
                if (data.suggested_priority) setPriority(data.suggested_priority);
            } else {
                console.error('Classification failed');
            }
        } catch (err) {
            console.error('API Error:', err);
        } finally {
            setIsClassifying(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        else if (title.length > 200) newErrors.title = 'Title must be under 200 characters';

        if (!description.trim()) newErrors.description = 'Description is required';
        if (!category) newErrors.category = 'Category is required';
        if (!priority) newErrors.priority = 'Priority is required';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        setApiError('');

        try {
            const response = await fetch('http://localhost:8000/api/tickets/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    priority,
                }),
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                setCategory('');
                setPriority('');
                if (onTicketCreated) onTicketCreated();
                alert('Ticket created successfully!');
            } else {
                const errorData = await response.json();
                setApiError(JSON.stringify(errorData));
            }
        } catch (err) {
            setApiError('Failed to connect to the server. Is the backend running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2 className="form-title">Create Support Ticket</h2>
                <p className="form-subtitle">Fill in the details below. Our AI will help classify your request.</p>

                {apiError && <div className="error-banner">{apiError}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="title">Ticket Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Cannot access billing dashboard"
                            className={errors.title ? 'error' : ''}
                            disabled={isSubmitting}
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Detailed Description</label>
                        <textarea
                            id="description"
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescriptionBlur}
                            placeholder="Describe your issue in detail..."
                            className={errors.description ? 'error' : ''}
                            disabled={isSubmitting}
                        ></textarea>
                        {errors.description && <span className="error-text">{errors.description}</span>}
                        <small className="ai-hint">AI categories will refresh when you finish typing.</small>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <div className="select-wrapper">
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={errors.category ? 'error' : ''}
                                    disabled={isSubmitting || isClassifying}
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                {isClassifying && <div className="inline-spinner"></div>}
                            </div>
                            {errors.category && <span className="error-text">{errors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <div className="select-wrapper">
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className={errors.priority ? 'error' : ''}
                                    disabled={isSubmitting || isClassifying}
                                >
                                    <option value="">Select Priority</option>
                                    {PRIORITIES.map((p) => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                                {isClassifying && <div className="inline-spinner"></div>}
                            </div>
                            {errors.priority && <span className="error-text">{errors.priority}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting || isClassifying}
                    >
                        {isSubmitting ? 'Creating Ticket...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketForm;
