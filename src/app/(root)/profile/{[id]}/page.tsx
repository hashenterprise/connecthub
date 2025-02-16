import UserProfile from '@/components/profile/user-profile';
import { api } from '@/lib/api';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await api.users.getProfile(params.id);
  
  return (
    <div className="container mx-auto py-8">
      <UserProfile profile={profile} />
    </div>
  );
}