import React, {useContext, useState} from 'react';
import '../../styles/Register-authentication.css';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/IsAuth";
import Styles from "../../styles/Register-authentication.css";
import {Requests} from "../../API/Requests";
import {Validator} from '../../misc/Validator.js';
import {LocalStorageManager} from "../../misc/LocalStorageManager";

const Register = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext)
    const navigate = useNavigate()
    const validator = new Validator()

    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const [checkboxData, setCheckboxData] = useState(false)
    const [checkboxConf, setCheckboxConf] = useState(false)
    const [checkboxSpam, setCheckboxSpam] = useState(false)

    const [validateUserName, setValidateUserName] = useState(false)

    return (
        <div style={{background: '#252525', width: '100%', height: '100%', paddingTop: '70px', paddingBottom: '70px'}}>
            <div className={Styles.bodyPart}>
                <form className="form" id="form" onSubmit={sendData}>
                    <div className="register-Field-left">
                        <div className="register-Field-left-header">
                            <h1>Регистрация</h1>
                            <p>Уже есть аккаунт? <Link to="/authorization" className={Styles.userIn}
                                                       style={{color: '#F66450'}}>Войти</Link></p>
                        </div>
                        <div>
                            <input placeholder="Имя пользователя" type="text" name="userName"
                                   required onChange={e => setUserName(e.target.value)}/>

                            {validateUserName &&
                                <p style={{
                                    fontSize: '12px',
                                    width: '500px',
                                    height: '40px',
                                    marginLeft: '50px',
                                    color: 'rgb(246, 100, 80)'
                                }}>
                                    Имя пользователя может содержать только латинские буквы и иметь длину от 5 до 20
                                    символов!
                                </p>}
                        </div>

                        <div>
                            <input placeholder="Е-mail: example@mail.ru" type="email" name="email" required
                                   onChange={e => setEmail(e.target.value)}/>

                            {!validator.validateEmail(email) &&
                                <p style={{
                                    fontSize: '12px',
                                    width: '500px',
                                    height: '40px',
                                    marginLeft: '50px',
                                    color: 'rgb(246, 100, 80)'
                                }}>
                                    Почта должна содержать домен, например, example@mail.ru!
                                </p>}
                        </div>

                        <div>
                            <input placeholder="Пароль" type="password" name="password" required
                                   onChange={e => setPassword(e.target.value)}/>

                            {!validator.validatePassword(password) &&
                                <p style={{
                                    fontSize: '12px',
                                    width: '500px',
                                    height: '40px',
                                    marginLeft: '50px',
                                    color: 'rgb(246, 100, 80)'
                                }}>
                                    Пароль должен состоять содержать заглавную букву, цифру и иметь длину не менее 6
                                    символов!
                                </p>}
                        </div>

                        <div>
                            <input placeholder="Повторите пароль" type="password" name="repeatPassword"
                                   required onChange={e => setRepeatPassword(e.target.value)}/>

                            {!validator.validateRepeatPassword(password, repeatPassword) &&
                                <p style={{
                                    fontSize: '12px',
                                    width: '500px',
                                    height: '40px',
                                    marginLeft: '50px',
                                    color: 'rgb(246, 100, 80)'
                                }}>
                                    Пароли не совпадают!
                                </p>}
                        </div>

                        <button type="submit" className='login'>Зарегистрироваться</button>
                    </div>

                    <div className="register-Field-right">
                        <div>
                            <input type="checkbox" id="checkboxData" name="checkboxData" required
                                   onChange={e => setCheckboxData(!checkboxData)}/>
                            <label htmlFor="checkboxData">Даю свое согласие на обработку персональных данных</label>
                        </div>
                        {!validator.validateCheckboxData(checkboxData) &&
                            <p style={{
                                fontSize: '12px',
                                width: '300px',
                                height: '40px',
                                marginLeft: '40px',
                                marginTop: '-30px',
                                color: 'rgb(246, 100, 80)'
                            }}>
                                Необходимо поставить флажок!
                            </p>}
                        <div>
                            <input type="checkbox" id="checkboxConf" name="checkboxConf" required
                                   onChange={e => setCheckboxConf(!checkboxConf)}/>
                            <label htmlFor="checkboxConf">Согласен с условиями пользования и политикой
                                конфиденциальности</label>
                        </div>
                        {!validator.validateCheckboxConf(checkboxConf) &&
                            <p style={{
                                fontSize: '12px',
                                width: '300px',
                                height: '40px',
                                marginLeft: '40px',
                                marginTop: '-30px',
                                color: 'rgb(246, 100, 80)'
                            }}>
                                Необходимо поставить флажок!
                            </p>}
                    </div>
                </form>
            </div>
        </div>
    )

    function validate() {
        let a = validator.validateUserName(userName)
        let b = validator.validateUserName(userName)
        let c = validator.validateUserName(userName)
        let d = validator.validateUserName(userName)

        setValidateUserName(!a)
        setValidateUserName(!b)
        setValidateUserName(!c)
        setValidateUserName(!d)

        return a && b &&c && d
    }

    async function sendData(event) {
        event.preventDefault();

        if (
            !validate()
        ) {
            console.log("dadada")
            return
        }

        const res = {
            username: userName,
            name: userName,
            email: email,
            password: password,
            checkboxData: checkboxData,
            checkboxConf: checkboxConf,
            checkboxSpam: checkboxSpam
        }

        const API = new Requests()
        const result = await API.unregisteredPost("account/register", res)

        if (result.ok) {
            const res = {
                username: userName,
                password: password
            }

            const API = new Requests()
            const result = await API.unregisteredPost("account/login", res)

            if (result.ok) {
                const respJSON = await result.json()
                LocalStorageManager.setJWT(respJSON.token)
                LocalStorageManager.setIsAuth(true)
                navigate("/")
                setIsAuth(true)
            }
        }
    }
};

export default Register;