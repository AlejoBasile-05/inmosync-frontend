export interface FrontendProperty {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  currency: string;
  mainImageUrl: string;
  beds: number;
  baths: number;
  sqft: number;
  characteristics: string[];
  status: "Available" | "Reserved";
}

export const propertyService = {
  getAvailableProperties: async (): Promise<FrontendProperty[]> => {
    const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA5NGZhNTA2LTYzNGYtNDc5OS1hOGFjLThkNzJkZmU1NTcxZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ppcWFsY21neWhsZHJhemFjZ2d6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MDQ3ZmI3MS0zNTVlLTRiZGEtYmI0MC1mZDI3MDZjZDRkNzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzczMDA2OTAyLCJpYXQiOjE3NzMwMDMzMDIsImVtYWlsIjoiYWxlam9iYXNpbGUwM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MzAwMzMwMn1dLCJzZXNzaW9uX2lkIjoiZWJhYzM4NWYtYjZjMS00N2ZmLTgyNmItZWMyM2NiZWE1MjQxIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.PCVPlycH-kZnaE2ZKIFQx7SCv6nL6o7S-1w_TaLAWI49yIrytvM16Fx8Awn3__qwHE5F6NfEJq8uNiRcq7CSWw';

    const response = await fetch('http://localhost:3000/properties/allProperties?status=FREE', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener propiedades del servidor');
    }

    const data = await response.json();

    return data.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      address: p.location, 
      price: `${p.currency} ${p.price.toLocaleString()}`, 
      mainImageUrl: p.mainImageUrl || '/images/placeholder.jpg', 
      features: { beds: p.beds, baths: p.baths, sqft: p.sqft },
      status: p.status === 'FREE' ? 'Available' : 'Reserved'
    }));
  },

  createProperty: async (propertyData: Omit<FrontendProperty, 'id' | 'status'>): Promise<void> => {
    const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA5NGZhNTA2LTYzNGYtNDc5OS1hOGFjLThkNzJkZmU1NTcxZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ppcWFsY21neWhsZHJhemFjZ2d6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MDQ3ZmI3MS0zNTVlLTRiZGEtYmI0MC1mZDI3MDZjZDRkNzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzczMDA2OTAyLCJpYXQiOjE3NzMwMDMzMDIsImVtYWlsIjoiYWxlam9iYXNpbGUwM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MzAwMzMwMn1dLCJzZXNzaW9uX2lkIjoiZWJhYzM4NWYtYjZjMS00N2ZmLTgyNmItZWMyM2NiZWE1MjQxIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.PCVPlycH-kZnaE2ZKIFQx7SCv6nL6o7S-1w_TaLAWI49yIrytvM16Fx8Awn3__qwHE5F6NfEJq8uNiRcq7CSWw'

    const response = await fetch('http://localhost:3000/properties/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      let errorMessage = 'Hubo un error inesperado al guardar la propiedad.';
      
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message) 
          ? errorData.message.join(', ')
          : errorData.message;
      }

      throw new Error(errorMessage);
    }
  }
};