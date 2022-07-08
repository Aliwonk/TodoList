import { useRouter } from "next/router";
import { ChangeEvent, HtmlHTMLAttributes, InputHTMLAttributes, MouseEvent, useState } from "react"
import { SignIn } from "../types/signIn";

export default function Auth() {
    const router = useRouter();
    const [ dataUser, setDataUser ] = useState({
        login: '',
        password: ''
    });
    const [ errorValidate, setErrorValidate ] = useState('');
    const [ messageAuth, setMessageAuth ] = useState('');

    function inputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setDataUser({ ...dataUser, [name]: value })
    };

    async function checkValidate(data: SignIn) {
        
        // check login
        
        if(data.login === '') return 'Пустой логин';
        const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        const validateEmail = emailRegexp.test(data.login);
        if(!validateEmail) return 'Некорректный логин';

        // check password
        
        if(data.password === '') return 'Пустой пароль';
        if(data.password.length < 4) return 'Короткий пароль(не менее 4 символов)';
        
        return null;
    };

    async function authUser(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const validateData = await checkValidate(dataUser);
        if(validateData !== null) return setErrorValidate(validateData);

        const urlBackend = 'http://localhost:3000/user/auth';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataUser)
        };

        const response = await fetch(urlBackend, options);
        const data = await response.json();
        const token = data.token;

        if(!token) return setMessageAuth('Авторизация не успешно');

        // save token in cookie

        document.cookie = `userToken=${token}; max-age=${24 * 60 * 60 * 1000};`;

        // redirect home page

        router.push('/');
    };

    return (
        <>
        <div className="text-center text-sm align-middle">{errorValidate}</div>
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Авторизация</h2>
          </div>
          <form className="mt-8 space-y-6" method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email-address"
                  name="login"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Login"
                  onChange={inputChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={inputChange}
                />
              </div>
            </div>

            <div>
              <button
                onClick={authUser}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Войти 
              </button>
            </div>
          </form>
        </div>
      </div>
        </>
    )
}