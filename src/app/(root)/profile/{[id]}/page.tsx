import { UserProfile } from '@/components/profile/user-profile';
import { getUserProfile } from '@/lib/api';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await getUserProfile(params.id);
  
  return (
    <div className="container mx-auto py-8">
      <UserProfile profile={profile} />
    </div>
  );
}