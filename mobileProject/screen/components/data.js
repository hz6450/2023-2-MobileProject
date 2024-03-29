import { db, doc, getDoc } from '../../firebaseConfig';

export const fetchUserData = async (email) => {
  // 파이어베이스에서 사용자 데이터를 호출해 각 컴포넌트에 전달
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