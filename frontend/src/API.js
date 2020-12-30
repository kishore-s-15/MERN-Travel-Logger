const API_URL = 'http://localhost:5000';

export async function listLogEntries() {
    const response = await fetch(`${API_URL}/api/logs`);
    return await response.json();
};

export async function createLogEntry(entry) {
    const apiKey = entry.apiKey;
    delete entry.apiKey;
    const response = await fetch(`${API_URL}/api/logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify(entry)
    });
    const json = await response.json();
    if (response.ok) {
        return json;
    }
    else {
        const error = new Error(json.message);
        error.response = json;
        throw error;
    }
};