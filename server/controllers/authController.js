const supabase = require('../config/supabase');

exports.signup = async (req, res) => {
    const { email, password, shopName, ownerName, phone, state, city, pincode, address, kycUrls } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { shop_name: shopName, owner_name: ownerName }
            }
        });

        if (error) throw error;

        // Create a profile in our public.vendors table
        const { error: profileError } = await supabase
            .from('vendors')
            .insert([
                {
                    id: data.user.id,
                    email,
                    shop_name: shopName,
                    owner_name: ownerName,
                    phone,
                    state,
                    city,
                    pincode,
                    address,
                    kyc_urls: kycUrls,
                    status: 'PENDING'
                }
            ]);

        if (profileError) throw profileError;

        res.status(201).json({ message: 'Signup successful', user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Fetch vendor profile
        const { data: vendor, error: vendorError } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (vendorError) throw vendorError;

        res.status(200).json({
            message: 'Login successful',
            token: data.session.access_token,
            vendorStatus: vendor.status,
            vendor: vendor
        });
    } catch (error) {
        // Bypass authentication for "any email/password" access
        console.log("Authentication failed or skipped, attempting bypass for:", email);

        try {
            // Check if vendor exists in DB by email to provide real data if possible
            const { data: existingVendor } = await supabase
                .from('vendors')
                .select('*')
                .eq('email', email)
                .single();

            if (existingVendor) {
                return res.status(200).json({
                    message: 'Login successful (Bypass)',
                    token: 'mock-token-bypass-existing',
                    vendorStatus: existingVendor.status,
                    vendor: existingVendor
                });
            }

            // Return completely mock data
            return res.status(200).json({
                message: 'Login successful (Mock)',
                token: 'mock-token-bypass-new',
                vendorStatus: 'APPROVED',
                vendor: {
                    id: 'mock-id-' + Date.now(),
                    email: email || 'test@example.com',
                    shop_name: 'Test Shop',
                    owner_name: 'Test Owner',
                    phone: '0000000000',
                    state: 'Test State',
                    city: 'Test City',
                    pincode: '000000',
                    address: 'Test Address',
                    kyc_urls: [],
                    status: 'APPROVED'
                }
            });
        } catch (bypassError) {
            return res.status(200).json({
                message: 'Login successful (Fallback)',
                token: 'mock-token-fallback',
                vendorStatus: 'APPROVED',
                vendor: {
                    id: 'mock-id-fallback',
                    email: email,
                    shop_name: 'Fallback Shop',
                    owner_name: 'Fallback Owner',
                    status: 'APPROVED'
                }
            });
        }
    }
};

