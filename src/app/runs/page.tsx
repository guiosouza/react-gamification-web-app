"use client";
import dynamic from 'next/dynamic';

const RunsComponent = dynamic(() => import('@/app/runs/runs'), {
  ssr: false,
});

export default function RunsPage() {
  return <RunsComponent />;
}