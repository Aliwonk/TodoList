import { useEffect, useState } from "react";

export default function TaskList(props: any) {
    const hidden = props.hidden;
    const [ dataTask, setDataTask ] = useState([]);

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

    useEffect(() => {
        const token = getCookie('userToken')!;
        fetch('http://localhost:3000/task/all', {
            headers: {
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(data => {
            setDataTask(data)
        });
        
    }, []);

    let hiddenClass = '';
    if(hidden) {
        hiddenClass = 'hidden';
    }
    return(
        <div className={hiddenClass}>
            TasksList
        </div>
    )
}