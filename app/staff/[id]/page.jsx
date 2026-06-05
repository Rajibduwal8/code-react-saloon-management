'use client';

import StaffDetail from '@/src/pages/StaffDetail';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  return <StaffDetail id={params.id} />;
}
