import { getBackendUrl } from '../index';

export async function saveUserToDb(user: any): Promise<void> {
  const url = `${getBackendUrl()}/user/save`;
  console.log(url);
  console.log(user);

  try {
    const payload = {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: user.fullName || '',
      imageUrl: user.imageUrl || '',
      email: user.primaryEmailAddress?.emailAddress || '',
      clerkId: user.id, // if you want to explicitly save ClerkId as well
    };

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
  } catch (error) {
    console.error('Error in saveUserToDb:', error);
    throw error;
  }
}
