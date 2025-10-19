'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  contactName?: string;
  createdAt?: string;
  updatedAt?: string;
  productCount?: number;
}

interface SupplierContextType {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<boolean>;
  deleteSupplier: (id: string) => Promise<boolean>;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Initiating fetch to /api/pemasok...');
      const response = await fetch('/api/pemasok', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // First, check if the response is OK
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Failed to parse error response' };
        }

        const errorInfo = {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          error: errorData?.error || 'No error details provided',
          details: errorData?.details
        };
        
        console.error('API Error Response:', errorInfo);
        
        // More specific error messages based on status code
        let errorMessage = 'Gagal mengambil data pemasok';
        if (response.status === 500) {
          errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
        } else if (response.status === 404) {
          errorMessage = 'Endpoint tidak ditemukan';
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
        
        throw new Error(errorMessage);
      }
      
      // If we get here, response is OK
      const responseData = await response.json();
      
      if (!Array.isArray(responseData)) {
        console.error('Expected array response but received:', responseData);
        throw new Error('Format data tidak valid dari server');
      }
      
      console.log(`Successfully fetched ${responseData.length} suppliers`);
      
      // Transform the data to ensure it matches the Supplier interface
      const formattedSuppliers = responseData.map(supplier => ({
        id: supplier.id || '',
        name: supplier.name || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        contactName: supplier.contactName || '',
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt
      }));
      
      setSuppliers(formattedSuppliers);
      
    } catch (err) {
      const error = err as Error;
      console.error('Error in fetchSuppliers:', {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      setError(error.message || 'Terjadi kesalahan saat mengambil data pemasok');
      setSuppliers([]);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/pemasok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: supplier.name,
          address: supplier.address,
          phone: supplier.phone,
          email: supplier.email,
          contactName: supplier.contactName || ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menambahkan pemasok');
      }

      await fetchSuppliers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error adding supplier:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menambahkan pemasok');
      return false;
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/pemasok/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui pemasok');
      }

      await fetchSuppliers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating supplier:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui pemasok');
      return false;
    }
  };

  const deleteSupplier = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/pemasok/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus pemasok');
      }

      await fetchSuppliers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus pemasok');
      return false;
    }
  };

  return (
    <SupplierContext.Provider 
      value={{
        suppliers,
        loading,
        error,
        fetchSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

export function useSuppliers() {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
}
