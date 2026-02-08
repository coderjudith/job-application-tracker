const API_URL = import.meta.env.VITE_API_URL;

console.log('API Service initialized. API_URL:', API_URL);

// Helper function for making API calls
const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log('📡 Fetching from:', url, 'Options:', options);
    
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Add mode for CORS
      mode: 'cors',
      credentials: 'omit' // or 'include' if you need cookies
    };
    
    const response = await fetch(url, fetchOptions);
    
    console.log('📦 Response status:', response.status);
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 Raw API response:', data);
    
    // 🔧 FIX: Extract data from the "body" field
    if (data.body) {
      // body is a JSON string, need to parse it
      const parsedBody = JSON.parse(data.body);
      console.log('✅ Parsed body data:', parsedBody);
      return parsedBody;
    }
    
    // If no body field, return data as-is
    console.log('⚠️ No body field, returning raw data');
    return data;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const api = {
  async getApplications() {
    return await fetchApi('/applications');
  },
  
  async createApplication(applicationData) {
    return await fetchApi('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },
  
  async updateApplication(applicationId, applicationData) {
    return await fetchApi(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData)
    });
  },
  
  async deleteApplication(applicationId) {
    console.log('🗑️ Attempting to delete application:', applicationId);
    
    // Try DELETE first, if it fails due to CORS, try POST with _method=DELETE
    try {
      return await fetchApi(`/applications/${applicationId}`, {
        method: 'DELETE'
      });
    } catch (deleteError) {
      console.log('⚠️ DELETE method failed, trying POST with _method=DELETE');
      
      // Fallback: Use POST with _method=DELETE (common workaround for CORS)
      return await fetchApi(`/applications/${applicationId}`, {
        method: 'POST',
        body: JSON.stringify({ _method: 'DELETE' })
      });
    }
  }
};