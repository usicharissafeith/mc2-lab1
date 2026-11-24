import { initializeApp } from 'firebase/app'; 
import { getFirestore } from 'firebase/firestore'; 
import { environment } from '../environments/environment'; 
  
// One Firebase app and one Firestore instance for the whole app. 
export const firebaseApp = initializeApp(environment.firebase); 
export const db = getFirestore(firebaseApp);