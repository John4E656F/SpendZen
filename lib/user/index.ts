import { getBackendUrl } from '../index';
import { useUserStore } from '@/hooks'; // Adjust the path as needed
import type { UserData } from '@/types'; // Assuming you export UserData type

export async function saveUserToDb(user: any): Promise<UserData> {
  const url = `${getBackendUrl()}/user/save`;
  console.log('saveUserToDb called with user:', user);

  try {
    const payload = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: user.fullName || '',
      imageUrl: user.imageUrl || '',
      email: user.primaryEmailAddress?.emailAddress || '',
      clerkId: user.id,
    };

    console.log('saving user to backend with payload:', payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to save user:', errorText);
      throw new Error('Failed to save user to backend');
    }

    // Parse JSON response
    const respJson = await response.json();

    // Extract user data from response
    const savedUser: UserData = {
      _id: respJson.user._id,
      clerkId: respJson.user.clerkId,
      firstName: respJson.user.firstName,
      lastName: respJson.user.lastName,
      fullName: respJson.user.fullName,
      imageUrl: respJson.user.imageUrl,
      email: respJson.user.email,
    };

    console.log('savedUser from backend:', savedUser);

    // Update Zustand store
    useUserStore.getState().setUser(savedUser);

    return savedUser;
  } catch (error) {
    console.error('Error in saveUserToDb:', error);
    throw error;
  }
}

export async function getUserFromDb(clerkId: string): Promise<UserData> {
  const url = `${getBackendUrl()}/user/get?clerkId=${encodeURIComponent(clerkId)}`;
  console.log('getUserFromDb called with clerkId:', clerkId);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch user from backend:', errorText);
      throw new Error('Failed to fetch user from backend');
    }

    const respJson = await response.json();

    // Assuming backend returns { user: { ...UserData } }
    const fetchedUser: UserData = {
      _id: respJson.user._id,
      clerkId: respJson.user.clerkId,
      firstName: respJson.user.firstName,
      lastName: respJson.user.lastName,
      fullName: respJson.user.fullName,
      imageUrl: respJson.user.imageUrl,
      email: respJson.user.email,
    };

    console.log('fetchedUser from backend:', fetchedUser);

    // Update Zustand store
    useUserStore.getState().setUser(fetchedUser);

    return fetchedUser;
  } catch (error) {
    console.error('Error in getUserFromDb:', error);
    throw error;
  }
}

export async function checkUserStatus(clerkId: string): Promise<{ userExists: boolean; hasGoal: boolean; user: UserData }> {
  const url = `${getBackendUrl()}/user/status?clerkId=${encodeURIComponent(clerkId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch user status');
  return res.json();
}
