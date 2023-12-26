import React, {useState, useEffect} from 'react';
import Styles from "../../styles/clastering.module.css";
import { ClasteringData } from './ClasteringData';
import Line from "../../images/line.svg";
import Warning from "../../images/warning.png";

const ClasteringReport = () => {
    const [keywords, setKeywords] = useState('')
    const [downloadLink, setDownloadLink] = useState('')

    const sendData = async () => {

        const res = {
            query: keywords
        }

        const params = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
                'Content-Type': "application/problem+json; charset=utf-8"
            },
            body: JSON.stringify(res)
        };

        const response = await fetch('cl', params).then(res => res.blob())
        setDownloadLink(URL.createObjectURL(await response))
    }

    return (
        <div className={Styles.clastering}>
            <section className={Styles.header}>
                <div>
                    <p className={Styles.headerText}>Кластеризация запросов</p>
                    <img src={Line} alt="line" className={Styles.line}/>
                </div>
            </section>

            <section className={Styles.start}>
                <div className={Styles.input}>
                    <p className={Styles.Head}>
                        Список запросов
                    </p>

                    <textarea onChange={e=>setKeywords(e.target.value)}/>

                    <p className={Styles.inputWarning}>
                        Введите запросы - каждый запрос с новой строки. 
                    </p>

                    <button className={Styles.inputButton1} disabled>
                        Прикрепить файл
                    </button>

                    <button onClick={sendData} className={Styles.inputButton2}>
                        Отправить
                    </button>
                </div>

                <div className={Styles.warning}>
                    <img src={Warning} alt="warning" className={Styles.warningSvg}/> 

                    <p className={Styles.warningText}>
                        После автоматической кластеризации рекомендуется 
                        проводить дополнительную ручную кластеризацию. 
                        Это помогает довести состояние кластеров до нужного
                        вам состояния и распределить не попавшие в кластеры 
                        запросы самостоятельно.
                    </p>     
                </div>
            </section>

            <section className={Styles.result}>
                <div className={Styles.resultText}>
                    <p className={Styles.Head}>
                        Результат:
                    </p>

                    <p>Кластеризация успешно завершена.</p>

                    <div className={Styles.resultButton}>
                        <p>
                            Скачать можно по ссылке: 
                        </p>
                        <button className={Styles.buttonDownloadClaster}><a download='clustering.txt' href={downloadLink}>Скачать</a></button>
                    </div>
                </div>
            </section>

            {false&&<section className={Styles.allClaster}>
                <p className={Styles.Head}>
                    Последние кластеризации
                </p>

                <table className={Styles.tableClaster}>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Количество запросов</th>
                            <th>Кол-во кластеризованных запросов</th>
                            <th>Ссылка для скачивания</th>
                        </tr>
                    </thead>

                    <tbody>
                        <ClasteringData/>
                    </tbody>
                </table>
            </section>}
        </div>
    );
};

export default ClasteringReport;