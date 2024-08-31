"use client"
import WebApp from '@twa-dev/sdk';
import { useEffect, useState, useRef } from 'react';
import { db } from '@/firebase/clientApp';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import MemoryGame from '@/components/memoryGame';
import AppBar from '@/components/AppBar';
import NavBar from '@/components/NavBar';
import TaskList from '@/components/TaskList';
import Popup from '@/components/Popup';
import { UserData, Task } from '@/types';

const tasks: Task[] = [
  { id: 1, name: 'Join our Telegram Channel', link: 'https://t.me/AlmeMaterEdu', btn: 'Join' },
  { id: 2, name: 'Follow us on Twitter', link: 'https://x.com/almemater', btn: 'Follow' },
  { id: 3, name: 'Follow us on Linkedin', link: 'https://www.linkedin.com/company/almemater', btn: 'Follow' },
  { id: 4, name: 'Share Your Feedback', link: 'https://forms.gle/D2vx7ZvegpBKByvw6', btn: 'Complete' }, // New feedback task
];

const sampleUserData: UserData = {
  id: 123456,
  first_name: 'John',
  last_name: 'Doe',
  username: 'johndoe',
  language_code: 'en',
  is_premium: false,
};

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const memoryGameRef = useRef<{ startGame: () => void }>(null);

  useEffect(() => {
    const initializeUser = async () => {
      if (process.env.NEXT_PUBLIC_DEVELOPMENT == "true") {
        setUserData(sampleUserData);
        setPoints(0);
        setCompletedTasks([]);
      } else if (WebApp.initDataUnsafe.user) {
        const user = WebApp.initDataUnsafe.user as UserData;
        setUserData(user);

        const userDocRef = doc(db, "users", user.username || user.id.toString());
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPoints(userData.points);
          setCompletedTasks(userData.completedTasks);
        } else {
          await setDoc(userDocRef, {
            id: user.id,
            name: `${user.first_name} ${user.last_name || ''}`,
            username: user.username || '',
            points: 0,
            completedTasks: []
          });
           // Show popup for new users
        }
      }
    };

    setShowPopup(true);

    initializeUser();
  }, []);

  const handleTaskCompletion = async (taskId: number, taskLink: string) => {
    if (!completedTasks.includes(taskId)) {
      window.open(taskLink, '_blank');
      setTimeout(async () => {
        const newPoints = points + 5;
        const newCompletedTasks = [...completedTasks, taskId];

        setPoints(newPoints);
        setCompletedTasks(newCompletedTasks);

        if (userData) {
          const userDocRef = doc(db, "users", userData.username || userData.id.toString());
          await setDoc(userDocRef, {
            id: userData.id,
            name: `${userData.first_name} ${userData.last_name || ''}`,
            username: userData.username || '',
            points: newPoints,
            completedTasks: newCompletedTasks
          }, { merge: true });
        }
      }, 3000); // 3 seconds delay
    }
  };

  const handleStartGame = () => {
    setCurrentPage('home');
    setShowPopup(false);
    memoryGameRef.current?.startGame(); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <AppBar userData={userData} points={points} />
      <main className="flex-grow p-4">
        {userData ? (
          <>
            {currentPage === 'home' && (
              <MemoryGame ref={memoryGameRef} userData={userData} points={points} setPoints={setPoints} />
            )}
            {currentPage === 'tasks' && (
              <TaskList tasks={tasks} completedTasks={completedTasks} handleTaskCompletion={handleTaskCompletion} />
            )}
            {currentPage === 'profile' && (
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <p><strong>First Name:</strong> {userData.first_name}</p>
                <p><strong>Last Name:</strong> {userData.last_name}</p>
                <p><strong>Username:</strong> @{userData.username}</p>
                <p><strong>Language:</strong> {userData.language_code}</p>
                <p><strong>Premium User:</strong> {userData.is_premium ? 'Yes' : 'No'}</p>
              </div>
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </main>
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} className="fixed bottom-0 w-full" />
      {showPopup && <Popup onClose={() => setShowPopup(false)} onStart={handleStartGame} />}
    </div>
  );
}