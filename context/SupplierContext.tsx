'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  productCount?: number;
}

interface SupplierContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export function SupplierProvider({ children }: { children: ReactNode }) {
  // Data dummy awal
  const initialSuppliers: Supplier[] = [
    { 
      id: 1, 
      name: "PT Sumber Sehat Abadi", 
      phone: "081234567890",
      email: "info@sumbersehat.com",
      address: "Jl. Raya Bogor KM 30, Jakarta Timur",
      city: "Jakarta Timur",
      postalCode: "13760",
      productCount: 24
    },
    { 
      id: 2, 
      name: "CV Pet Lovers", 
      phone: "082345678901",
      email: "contact@petlovers.co.id",
      address: "Jl. Sudirman Kav. 10",
      city: "Jakarta Selatan",
      postalCode: "10220",
      productCount: 18
    },
  ];

  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now(), // Generate ID unik
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: number, updates: Partial<Supplier>) => {
    setSuppliers(prev =>
      prev.map(supplier =>
        supplier.id === id ? { ...supplier, ...updates } : supplier
      )
    );
  };

  const deleteSupplier = (id: number) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  return (
    <SupplierContext.Provider 
      value={{ 
        suppliers, 
        addSupplier, 
        updateSupplier, 
        deleteSupplier 
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
