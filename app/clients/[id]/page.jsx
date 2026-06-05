'use client'; 

import ClientDetail from '@/src/pages/ClientDetail'; 
import { useParams } from 'next/navigation'; 

export default function Page() { 
  const params = useParams(); 
  return <ClientDetail id={params.id} />; 
}
