const API_URL = import.meta.env.VITE_API_URL;

console.log('API Service initialized. API_URL:', API_URL);

export const api = {
  async getApplications() {
    try {
      const url = `${API_URL}/applications`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url);
      console.log('📦 Response status:', response.status);
      
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
      
      // Return fallback
      return {
        success: false,
        items: [
          {
            applicationId: "fallback-001",
            companyName: "Fallback Company",
            jobTitle: "Fallback Job",
            dateApplied: "2024-01-01",
            status: "Applied"
          }
        ],
        error: error.message
      };
    }
  }
};