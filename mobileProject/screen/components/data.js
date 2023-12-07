import { db, doc, getDoc } from '../../firebaseConfig';

export const fetchUserData = async (email) => {
  try {
    const userDocRef = doc(db, 'users', email);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.log('No user data found for email:', email);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};