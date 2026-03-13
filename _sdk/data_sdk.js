// Ensure the Supabase library is loaded via CDN in your HTML first:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseUrl = 'https://mugzzeulgpvqraatyyww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3p6ZXVsZ3B2cXJhYXR5eXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjU4NDAsImV4cCI6MjA4ODg0MTg0MH0.rkje-J36box9-ErTEcnFMHyd0t0wL5olDCyZNjXGd4Y'; // Your key here

// FIX: Reference the library correctly (usually 'supabase' or 'window.supabase')
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.dataSdk = {
    init: async ({ onDataChanged }) => {
        console.log("Data SDK Initialized with Supabase");

        const data = await fetchItems();
        if (onDataChanged) onDataChanged(data);

        const channel = supabaseClient
            .channel('items_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'items' }, 
                async (payload) => {
                    console.log('Change received!', payload);
                    const freshData = await fetchItems();
                    if (onDataChanged) onDataChanged(freshData);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully connected to real-time updates!');
                } else if (status === 'CLOSED') {
                    console.log('Real-time connection closed.');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Real-time connection error. Check your RLS policies or Replication settings.');
                }
            });

        return { success: true };
    },

    create: async (newItem) => {
        const { error } = await supabaseClient
            .from('items')
            .insert([newItem]);

        if (error) {
            console.error('Error creating item:', error);
            return null;
        }
        return newItem;
    },

    update: async (updatedItem) => {
        const { data, error } = await supabaseClient
            .from('items')
            .update(updatedItem)
            .eq('id', updatedItem.id)
            .select(); // FIX: Added .select() to return the updated record

        if (error) {
            console.error('Error updating item:', error);
            return null;
        }
        return data[0];
    },

    delete: async (itemId) => {
        const { error } = await supabaseClient
            .from('items')
            .delete()
            .eq('id', itemId);

        return !error;
    }
};

async function fetchItems() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabaseClient
        .from('items')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString()) // Only get last 30 days
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }
    return data || [];
}


