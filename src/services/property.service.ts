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
  status: "FREE" | "BUSY";
}

export const propertyService = {
  getAvailableProperties: async (): Promise<FrontendProperty[]> => {
    const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA5NGZhNTA2LTYzNGYtNDc5OS1hOGFjLThkNzJkZmU1NTcxZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ppcWFsY21neWhsZHJhemFjZ2d6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MDQ3ZmI3MS0zNTVlLTRiZGEtYmI0MC1mZDI3MDZjZDRkNzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzczMDE0NDcyLCJpYXQiOjE3NzMwMTA4NzIsImVtYWlsIjoiYWxlam9iYXNpbGUwM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MzAxMDg3Mn1dLCJzZXNzaW9uX2lkIjoiNDMyY2Y0NzYtMmI1Ni00YjY2LTg4NjctZTk0ZDA4ZWRlM2U5IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.6ty7_C2euhyTuRu0OF2MgJREDVNRFsmtOBsQ55NkGXtdIs9kBIhFr7U2PWaxhyVwWfqEfdNkPuuJ0w8xwIEkdA';

    const response = await fetch('http://localhost:3000/properties/allProperties', {
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
      location: p.location, 
      price: `${p.currency} ${p.price.toLocaleString()}`,
      beds: p.beds,
      baths: p.baths,
      sqft: p.sqft, 
      mainImageUrl: p.mainImageUrl || '/images/placeholder.jpg', 
      characteristics: p.characteristics || [],
      status: p.status as "FREE" | "BUSY",
    }));
  },

  createProperty: async (propertyData: Omit<FrontendProperty, 'id' | 'status'>): Promise<void> => {
    const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjA5NGZhNTA2LTYzNGYtNDc5OS1hOGFjLThkNzJkZmU1NTcxZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ppcWFsY21neWhsZHJhemFjZ2d6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MDQ3ZmI3MS0zNTVlLTRiZGEtYmI0MC1mZDI3MDZjZDRkNzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzczMDE0NDcyLCJpYXQiOjE3NzMwMTA4NzIsImVtYWlsIjoiYWxlam9iYXNpbGUwM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MzAxMDg3Mn1dLCJzZXNzaW9uX2lkIjoiNDMyY2Y0NzYtMmI1Ni00YjY2LTg4NjctZTk0ZDA4ZWRlM2U5IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.6ty7_C2euhyTuRu0OF2MgJREDVNRFsmtOBsQ55NkGXtdIs9kBIhFr7U2PWaxhyVwWfqEfdNkPuuJ0w8xwIEkdA'

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