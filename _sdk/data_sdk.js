window.dataSdk = {
    init: async (handler) => {
        console.log("Mock Data SDK Initialized");
        // Load existing data from Local Storage
        const savedData = localStorage.getItem('lost_found_data');
        let data = savedData ? JSON.parse(savedData) : [];
        
        // Automatically expire items older than 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        data = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= thirtyDaysAgo;
        });
        
        // Save the filtered data back
        localStorage.setItem('lost_found_data', JSON.stringify(data));
        
        // Tell the app about the data
        handler.onDataChanged(data);
        return { isOk: true };
    },

    create: async (newItem) => {
        const data = JSON.parse(localStorage.getItem('lost_found_data') || '[]');
        // Add a unique ID for the backend to recognize
        newItem.__backendId = Date.now().toString(); 
        data.push(newItem);
        localStorage.setItem('lost_found_data', JSON.stringify(data));
        
        // Refresh the UI by triggering the data change
        location.reload(); 
        return { isOk: true };
    },

    update: async (updatedItem) => {
        let data = JSON.parse(localStorage.getItem('lost_found_data') || '[]');
        data = data.map(item => item.__backendId === updatedItem.__backendId ? updatedItem : item);
        localStorage.setItem('lost_found_data', JSON.stringify(data));
        location.reload();
        return { isOk: true };
    },

    delete: async (itemToDelete) => {
        let data = JSON.parse(localStorage.getItem('lost_found_data') || '[]');
        data = data.filter(item => item.__backendId !== itemToDelete.__backendId);
        localStorage.setItem('lost_found_data', JSON.stringify(data));
        location.reload();
        return { isOk: true };
    }
};


