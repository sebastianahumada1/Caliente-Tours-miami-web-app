import { useState, useEffect } from 'react';

export type Yacht = {
  id: number;
  name: string;
  slug: string;
  description: string;
  maxPeople: number;
  priceRange: string;
  mainImage: string;
  images: {
    cabin: string[];
    deck: string[];
    yacht: string[];
    charter: string[];
    services: string[];
  };
  specs: {
    length: string;
    type: string;
    year: number;
  };
};

export function useYachts() {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadYachts() {
      try {
        const response = await fetch('/data/yachts.json');
        if (!response.ok) {
          throw new Error('Failed to load yachts data');
        }
        const data = await response.json();
        setYachts(data.yachts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading yachts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadYachts();
  }, []);

  return { yachts, loading, error };
}

// Utility functions
export function filterYachtsByPrice(yachts: Yacht[], priceRange: string): Yacht[] {
  return yachts.filter(yacht => yacht.priceRange === priceRange);
}

export function getYachtById(yachts: Yacht[], id: number): Yacht | undefined {
  return yachts.find(yacht => yacht.id === id);
}

export function getYachtBySlug(yachts: Yacht[], slug: string): Yacht | undefined {
  return yachts.find(yacht => yacht.slug === slug);
}

