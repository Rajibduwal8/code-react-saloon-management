'use client';

import StudentDetail from '@/src/pages/StudentDetail';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  return <StudentDetail id={params.id} />;
}
