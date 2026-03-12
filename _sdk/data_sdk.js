// Supabase configuration
const supabaseUrl = 'https://mqaevofwzykcbqdbjdgz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYWV2b2Z3enlrY2JxZGJqZGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzgzNTAsImV4cCI6MjA4ODg1NDM1MH0.81vckiSTZ-amlbNKXdVD_ZjOhoVmK9W_IQrqDDtwr3k';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

window.dataSdk = {
    init: async ({ onDataChanged }) => {
        console.log("Data SDK Initialized with Supabase");

        // Initial fetch
        const data = await fetchItems();
        if (onDataChanged) {
            onDataChanged(data);
        }

        // Set up real-time subscription
        const channel = supabase
            .channel('items_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, (payload) => {
                console.log('Change received!', payload);
                fetchItems().then(data => {
                    if (onDataChanged) {
                        onDataChanged(data);
                    }
                });
            })
            .subscribe();

        return { success: true };
    },

    create: async (newItem) => {
        const { data, error } = await supabase
            .from('items')
            .insert([newItem]);

        if (error) {
            console.error('Error creating item:', error);
            alert("Error saving item");
            return null;
        }

        return data;
    },

    update: async (updatedItem) => {
        const { data, error } = await supabase
            .from('items')
            .update(updatedItem)
            .eq('id', updatedItem.id);

        if (error) {
            console.error('Error updating item:', error);
            alert("Error updating item");
            return null;
        }

        return data;
    },

    delete: async (itemId) => {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error('Error deleting item:', error);
            alert("Error deleting item");
            return false;
        }

        return true;
    }
};

// Helper function to fetch items
async function fetchItems() {
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }

    return data || [];
}

