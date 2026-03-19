// Supabase Data SDK - FIXED for transaction deletes + Clear History
const supabaseUrl = 'https://mugzzeulgpvqraatyyww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3p6ZXVsZ3B2cXJhYXR5eXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjU4NDAsImV4cCI6MjA4ODg0MTg0MH0.rkje-J36box9-ErTEcnFMHyd0t0wL5olDCyZNjXGd4Y';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// OVERRIDE - Complete SDK with ALL functions
window.dataSdk = {
    init: async ({ onDataChanged }) => {
        console.log('✅ COMPLETE Data SDK loaded - transactions ready');
        const data = await fetchItems();
        if (onDataChanged) onDataChanged(data);
        supabaseClient.channel('items').subscribe();
        return { success: true };
    },

    fetchTransactions: async () => {
        console.log('📊 Fetching transactions...');
        const { data, error } = await supabaseClient
            .from('transaction')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Transactions error:', error);
            return [];
        }
        console.log('✅ Transactions:', data?.length || 0);
        return data || [];
    },

    deleteTransaction: async (transId) => {
        console.log('🗑️ DELETE:', transId);
        const { error } = await supabaseClient
            .from('transaction')
            .delete()
            .eq('id', transId);
        if (error) {
            console.error('DELETE ERROR:', error);
            return { success: false, error: error.message };
        }
        console.log('✅ DELETED:', transId);
        return { success: true };
    },

    // Other required functions
    createComment: async (itemId, author, text) => {
        const { data, error } = await supabaseClient.from('comments').insert([{ item_id: itemId, author, text }]).select();
        return data?.[0] || false;
    },

    create: async (item) => {
        const { data, error } = await supabaseClient.from('items').insert([item]).select();
        return data?.[0] || null;
    },

    delete: async (id) => {
        const { error } = await supabaseClient.from('items').delete().eq('id', id);
        return { isOk: !error };
    },

    fetchComments: async (id) => await supabaseClient.from('comments').select('*').eq('item_id', id),
    
    update: async (item) => {
        const { data, error } = await supabaseClient.from('items').update(item).eq('id', item.id).select();
        return data?.[0] || null;
    },

    createTransaction: async (item_id, name, phone) => {
        const { data, error } = await supabaseClient.from('transaction').insert([{ item_id, claimant_name: name, phone }]).select();
        return data?.[0] || false;
    }
};

async function fetchItems() {
    const { data } = await supabaseClient.from('items').select('*').order('created_at', { ascending: false });
    return data || [];
}

    clearAllTransactions: async () => {
        console.log('🧹 Clearing ALL transactions...');
        const { error } = await supabaseClient
            .from('transaction')
            .delete();
        if (error) {
            console.error('Clear FAILED:', error);
            return { success: false, error: error.message };
        }
        console.log('✅ ALL transactions DELETED');
        return { success: true };
    },

    // Final log


console.log('🚀 Data SDK READY - Clear History FIXED!');

