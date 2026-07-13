import { Loader2 } from 'lucide-react';

export default function Loading({ fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center">{content}</div>;
  }
  return <div className="py-20 flex items-center justify-center">{content}</div>;
}
