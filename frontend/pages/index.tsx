import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import CreateTask from './components/CreateTask';
import TaskList from './components/TaskList';

function HomePage() {
  const router = useRouter();
  const [ dataTasks, setDataTasks ] = useState([]);
  const [ hiddenMainBlock, setHiddenMainBlock ] = useState('');
  const [ hiddenTaskList, setHiddenTaskList ] = useState(true);
  const [ hiddenCreateTaskBlock, setHiddenCreateTaskBlock ] = useState(true);

  function getCookie(name: string) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }


  function openTaskList() {
    setHiddenMainBlock('hidden');
    setHiddenTaskList(false);
    setHiddenCreateTaskBlock(true);
  };

  function openTaskCreate() {
    setHiddenMainBlock('hidden');
    setHiddenCreateTaskBlock(false);
    setHiddenTaskList(true);
  };

  useEffect(() => {
    // get token from cookie
    const token = getCookie('userToken')!;

    if(!token) { router.push('/auth') }
  
  }, [])




  return (
    <>
      <div className='float-left flex flex-col justify-center items-center w-auto h-screen'>
        <div onClick={openTaskList} className='w-full h-8 bottom-2 mb-2 flex items-center justify-center cursor-pointer bg-sky-600'>Мои задачи</div>
        <div onClick={openTaskCreate} className='w-full h-8 bottom-2 mb-2 flex items-center justify-center cursor-pointer bg-sky-600'>Создать задачу</div>
      </div>
      <div className={`flex justify-center items-center h-screen ${hiddenMainBlock}`}>
          Добро пожадовать в приложения для создания задач
      </div>
      <TaskList hidden={hiddenTaskList}/>
      <CreateTask hidden={hiddenCreateTaskBlock} />
    </>
  )
}

export default HomePage
