import DashboardLayout from '@/app/Components/admin/DashboardLayout';
import EventManager from '@/app/Components/admin/EventManager';

export default function EventsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Events Management</h1>
      <EventManager />
    </DashboardLayout>
  );
} 