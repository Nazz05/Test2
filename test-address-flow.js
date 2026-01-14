import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testAddressFlow() {
  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'user1',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const userId = 1; // Assuming user1 has id=1
    
    console.log('Login successful! Token:', token.substring(0, 20) + '...');
    
    // Step 2: Get addresses
    console.log('\nStep 2: Getting addresses...');
    const addressesResponse = await axios.get(`${API_URL}/addresses/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Addresses:', JSON.stringify(addressesResponse.data, null, 2));
    
    // Step 3: Create new address
    console.log('\nStep 3: Creating new address...');
    const newAddressResponse = await axios.post(`${API_URL}/addresses/user/${userId}`, {
      recipientName: 'Tran Thi B',
      phone: '0987654321',
      addressLine: '789 Pho Nguyen Hue',
      ward: 'Ward 4',
      district: 'District 2',
      province: 'TP Ho Chi Minh',
      postalCode: '700002',
      isDefault: false,
      notes: 'Test address'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('New address created:', JSON.stringify(newAddressResponse.data, null, 2));
    
    // Step 4: Update address
    if (newAddressResponse.data.id) {
      console.log('\nStep 4: Updating address...');
      const updateResponse = await axios.put(`${API_URL}/addresses/${newAddressResponse.data.id}/user/${userId}`, {
        recipientName: 'Tran Thi B Updated',
        phone: '0987654321',
        addressLine: '789 Pho Nguyen Hue',
        ward: 'Ward 4',
        district: 'District 2',
        province: 'TP Ho Chi Minh',
        postalCode: '700002',
        isDefault: false,
        notes: 'Test address updated'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Address updated:', JSON.stringify(updateResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAddressFlow();
