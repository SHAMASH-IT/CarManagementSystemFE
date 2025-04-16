'use client';

import InterventionManagement from '../../components/InterventionManagement';

export default function InterventionPage({ params }: { params: { id: string } }) {
  return <InterventionManagement interventionId={parseInt(params.id)} />;
} 