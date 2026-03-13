const supabaseUrl = 'https://mugzzeulgpvqraatyyww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3p6ZXVsZ3B2cXJhYXR5eXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjU4NDAsImV4cCI6MjA4ODg0MTg0MH0.rkje-J36box9-ErTEcnFMHyd0t0wL5olDCyZNjXGd4Y';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.dataSdk = {
    // --- ELEMENT SDK ---
    init: async ({ onDataChanged }) => {
        console.log("Supabase Data SDK Initialized");

        // 1. Initial Load (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data, error } = await supabaseClient
            .from('items')
            .select('*')
            .gte('created_at', thirtyDaysAgo.toISOString())
            .order('created_at', { ascending: false });

        if (!error) onDataChanged(data);

        // 2. Real-time Subscription (No more location.reload!)
        const channel = supabaseClient
            .channel('public:items')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, async () => {
                const { data: freshData } = await supabaseClient
                    .from('items')
                    .select('*')
                    .gte('created_at', thirtyDaysAgo.toISOString())
                    .order('created_at', { ascending: false });
                onDataChanged(freshData);
            })
            .subscribe();

        return { isOk: true, unsubscribe: () => channel.unsubscribe() };
    },
    create: async (newItem) => {
        const { data, error } = await supabaseClient
            .from('items')
            .insert([newItem])
            .select();
        
        if (error) {
            console.error('Supabase Insert Error:', error.message);
            return null;
        }
        return data[0];
    },
    delete: async (itemId) => {
        const { error } = await supabaseClient
            .from('items')
            .delete()
            .eq('id', itemId); // Note: Use 'id' instead of '__backendId'
            
        return { isOk: !error };
    },
    // --- DATA SDK ---
    update: async (updatedItem) => {
        const { data, error } = await supabaseClient
            .from('items')
            .update(updatedItem)
            .eq('id', itemId); // Note: Use 'id' instead of '__backendId'
            
        return { isOk: !error };
    },
    fetchComments: async (itemId) => {
        const { data, error } = await supabaseClient
            .from('comments')
            .select('*')
            .eq('item_id', itemId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
        return data;
    },
    createComment: async (itemId, author, text) => {
        const { data, error } = await supabaseClient
            .from('comments')
            .insert([{ 
                item_id: itemId, 
                author: author, 
                text: text 
            }])
            .select();

        if (error) {
            console.error('Error creating comment:', error);
            return null;
        }
        return data[0];
    }
};
