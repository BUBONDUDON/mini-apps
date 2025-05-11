import "./MyTests.css";

import { Panel, View } from "@vkontakte/vkui";

import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { useEffect, useState } from "react";
import { loadTableData } from "../../../../utils/Server/LoadTableFromServer";
import { ShowReviewTest } from "../../CommonFiles/ShowReviewTest";
import { ShowAdditionalInformation } from "../../CommonFiles/ShowAdditionalInformation";
import DisplayTest from "../../CommonFiles/DisplayTest";
import { ConstructorTests } from "../../CommonFiles/ConstructorTests";
import BottomMenu from "../../../Components/Menu/BottomMenu";

export const MyTests = ({ id, fetchedUser }) => {
    const navigator = useRouteNavigator();
    //Переключалка панелей
    const [activePanel, setActivePanel] = useState(id);
    //Хук-схрон теста
    const [currentTestId, setCurrentTestId] = useState();
    //Хук-схрон карточки теста
    const [currentTestCardId, setCurrentTestCardId] = useState();
    // Состояние для хранения текущего времени
    const [currentTime, setCurrentTime] = useState(null);
    //БД дата
    const [testData, setTestData] = useState([]);
    const [testCardData, setTestCardData] = useState([]);
    //Прокид активной панели для функций страничек
    const handleResult = (result) => {
        setActivePanel(result);
    };
    //Прокид карточки теста для функции странички
    const handleTestCard = (result) => {
        setCurrentTestCardId(result)
    }
    //Прокид времени для функции странички
    const handleTimer = (result) => {
        setCurrentTime(result)
    }
    // Универсальная функция для загрузки данных
    const fetchData = async (tableName, setData) => {
        const result = await loadTableData(tableName);
        if (result) {
            setData(result);
        }
    };
    //Загрузка тестов
    useEffect(() => {
        fetchData('test', setTestData);
    }, []);
    //Загрузка тестов
    useEffect(() => {
        fetchData('testCard', setTestCardData);
    }, []);
    //Фильтр тестов по ИД пользователя
    const filteredTestData = testData.filter(test => test.vkId === fetchedUser.id)
    //Фильтр карточек теста по ID теста
    const filteredTestsCard = testCardData.filter(testCard => testCard.testId === currentTestId);
    console.log(filteredTestsCard)
    return (
        <>
            <View id={activePanel} activePanel={activePanel}>
                <Panel id={id}>
                    <div delimiter="none" style={{
                        backgroundColor: 'black',
                        height: "56px",
                        minWidth: '100%',
                        display: 'flex'
                    }}>

                        <button onClick={() => navigator.replace("/profilepage")} style={{
                            background: 'none',
                            border: 'none',
                            position: 'relative',
                            width: '11px',
                            height: '20px',
                            float: 'left',
                            clear: 'both',
                            marginLeft: '29.6px',
                            marginTop: '18px',
                            padding: 0

                        }}>
                            <img style={{
                                width: '11px',
                                height: '20px',

                            }} src="Back_Icon_White.svg"></img>
                        </button>
                        <div style={{
                            display: 'inline-block',
                            fontSize: '18px',
                            position: 'relative',
                            margin: 'auto auto',
                            color: 'white',
                            clear: 'both'
                        }}> Мои тесты </div>
                    </div>
                    {filteredTestData.map((test, index) => (
                        <li key={test.testId} style={{
                            marginBottom: 13,
                            minWidth: '100%',
                            height: 123,
                            listStyleType: 'none',
                        }}>
                            <div
                                style={{

                                }}
                                onClick={
                                    () => {
                                        setCurrentTestId(test.testId);
                                        setActivePanel("selectedTestPanel")
                                    }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minWidth: '100%',
                                        height: 123,
                                        backgroundImage: `url(${test.testPic})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',

                                    }}>
                                    <div
                                        style={{
                                            margin: 'auto 0',
                                            padding: '11px 20px 13px 20px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.74)',
                                            color: 'white',
                                            marginTop: '40px',
                                        }}>
                                        {`Тест ${index + 1} ${test.testName}`}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </Panel>
                <Panel id="selectedTestPanel">
                    <ShowReviewTest
                        onResult={handleResult}
                        onResultTestCardId={handleTestCard}
                        startTimer={handleTimer}
                        panelName={"mytests"}
                        testId={currentTestId} 
                        showAction={true}/>
                </Panel>
                <Panel id="displaymoreinfo">
                    <ShowAdditionalInformation cardId={currentTestCardId} onResult={handleResult} fetchedUser={fetchedUser} showFav={false} panelName={"selectedTestPanel"} />
                </Panel>
                <Panel id="selectedtestpanel">
                    <DisplayTest cards={filteredTestsCard} onResult={handleResult} fetchedUser={fetchedUser} startTime={currentTime} />
                </Panel>
                <Panel id="updateTestPanel">
                    <ConstructorTests 
                    onResult={handleResult}
                    panelName={"mytests"}
                    fetchedUser={fetchedUser}
                    masCards={filteredTestsCard}
                    forEdit={true}/>
                    <BottomMenu page={id} onResult={handleResult}/>
                </Panel>
            </View>
        </>
    );
}