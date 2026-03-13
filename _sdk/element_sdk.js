const supabaseUrl = 'https://mugzzeulgpvqraatyyww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3p6ZXVsZ3B2cXJhYXR5eXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjU4NDAsImV4cCI6MjA4ODg0MTg0MH0.rkje-J36box9-ErTEcnFMHyd0t0wL5olDCyZNjXGd4Y';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.dataSdk = {
    init: async ({ onDataChanged }) => {
        console.log("Supabase Data SDK Initialized");

        // 1. Initial Load
        const { data, error } = await supabaseClient
            .from('items')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) onDataChanged(data);

        // 2. Real-time Subscription (No more location.reload!)
        supabaseClient
            .channel('public:items')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, async () => {
                const { data: freshData } = await supabaseClient.from('items').select('*');
                onDataChanged(freshData);
            })
            .subscribe();

        return { isOk: true };
    },

    create: async (newItem) => {
        const { data, error } = await supabaseClient
            .from('items')
            .insert([newItem])
            .select();
        
        return { isOk: !error, data: data ? data[0] : null };
    },

    delete: async (itemId) => {
        const { error } = await supabaseClient
            .from('items')
            .delete()
            .eq('id', itemId); // Note: Use 'id' instead of '__backendId'
            
        return { isOk: !error };
    }
};
