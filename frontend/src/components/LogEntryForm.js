import React, { useState } from 'react';
import { useForm } from 'react-hook-form'

import { createLogEntry } from '../API';

const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit } = useForm();

    const onFormSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error) {
            console.error(error.message);
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <form className="entry-form" onSubmit={handleSubmit(onFormSubmit)}>
            {error ? <h3 className="error">{error}</h3> : null}
            <label htmlFor="apiKey">API KEY</label>
            <input name="apiKey" type="password" required ref={register} />
            <label htmlFor="title">Title</label>
            <input name="title" type="text" required ref={register} />
            <label htmlFor="comments">Comments</label>
            <textarea name="comments" rows={3} ref={register} />
            <label htmlFor="description">Description</label>
            <textarea name="description" rows={3} ref={register} />
            <label htmlFor="rating">Rating</label>
            <input name="rating" type="Number" min="1" max="10" ref={register} />
            <label htmlFor="image">Image</label>
            <input name="image" type="text" ref={register} />
            <label htmlFor="visitDate">Visit Date</label>
            <input name="visitDate" type="date" required ref={register} />
            <button disabled={loading}>{loading ? 'Loading...' : 'Create Entry'}</button>
        </form>
    )
};

export default LogEntryForm;