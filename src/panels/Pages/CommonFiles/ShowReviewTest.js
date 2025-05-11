import { Group } from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { loadTableData } from "../../../utils/Server/LoadTableFromServer";
import { Icon28DeleteOutline, Icon28WriteOutline } from "@vkontakte/icons";

export const ShowReviewTest = ({ onResult, onResultTestCardId, startTimer, panelName, testId, showAction }) => {
    //БД дата
    const [testData, setTestData] = useState([]);
    const [testCardData, setTestCardData] = useState([]);
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
    //Загрузка карточек теста
    useEffect(() => {
        fetchData('testCard', setTestCardData);
    }, []);
    //Обработка логики нажатия на кнопку начать тест
    const handleButtonClick = () => {
        const now = new Date();
        startTimer(now);
        onResult('selectedtestpanel');
    };
    //Выбранный тест
    const filteredTest = testData.filter(test => test.testId === testId)[0]
    //Фильтр карточек теста по ID теста
    const filteredTestsCard = testCardData.filter(testCard => testCard.testId === testId);
    return (
        <>
            {filteredTest ? (<Group style={{
                padding: 0,
            }}>
                <div style={{
                    backgroundImage: `url(${filteredTest.testPic})`,
                    backgroundPosition: 'center',
                    height: '298px',
                    minWidth: '100%',
                    backgroundSize: 'cover'

                }}>
                    <button style={{
                        padding: 0,
                        width: '20px',
                        height: '28px',
                        border: 'none',
                        background: 'none',
                        marginTop: '15px',
                        marginLeft: '29px',
                        float: 'left'
                    }} onClick={() => onResult(panelName)}>
                        <img style={{
                            width: '20px',
                            height: '28px',
                            background: "none",
                            border: 'none',
                        }} src="Back_Icon.svg"></img>
                    </button>

                    <div style={{
                        display: 'flex',
                        width: '76px',
                        padding: '7px 5.77px 7px 5.77px',
                        backgroundColor: 'rgba(0, 0, 0, 0.74)',
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize: '24px',
                        fontWeight: 500,
                        position: 'absolute',
                        right: 0,
                        top: '8px',
                    }}>
                        {!showAction ? (
                            "100%"
                        ) : (
                            <>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                    <button style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                    }}
                                    onClick={() =>{onResult("updateTestPanel")}}>
                                        <Icon28WriteOutline fill="white" />
                                    </button>
                                    <button style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                    }}>
                                        <Icon28DeleteOutline fill="white" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>


                    <div style={{
                        display: 'inline-block',
                        padding: '8px 56px 5px 20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.74)',
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize: '24px',
                        fontWeight: 500,
                        position: 'relative',
                        bottom: '-238px',
                        left: '-50px'
                    }}>{filteredTest.testName}</div>


                </div>
                <div
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        color: 'rgba(255, 255, 255, 1)',
                        padding: '11px 20px'
                    }}>{filteredTest.testInfo}</div>

                <div style={{
                    backgroundColor: 'rgba(223, 223, 230, 1)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            color: 'rgba(0, 0, 0, 1)',
                            padding: '12px 47px',
                            display: 'inline-block',
                            margin: ' 0 auto ',
                            marginTop: '13px',
                            marginBottom: '13px',
                            fontSize: '16px'
                        }}>Немного теории
                        </div>
                    </div>

                    <div style={{
                        height: '187px',
                        width: '90%',
                        margin: '0 auto',
                        overflowY: 'scroll',
                        scrollbarWidth: 'none',
                        marginBottom: '13px',
                        boxShadow: 'inset 0 -7px 20px -10px rgba(0, 0, 0, 0.5)'
                    }}>

                        {filteredTestsCard.map((card, index) => (
                            <img
                                src={card.cardPicture}
                                onClick={() => (
                                    onResult("displaymoreinfo"),
                                    onResultTestCardId(card.cardId)
                                )}
                                style={{
                                    width: 65,
                                    height: 66,
                                    borderRadius: 90,
                                    margin: index === card.length - 1 ? 0 : 5,
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button style={{
                            width: '214px',
                            height: '48px',
                            border: 'none',
                            fontSize: '18px',
                            color: 'rgba(0, 0, 0, 1)',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            borderRadius: 90,
                            marginBottom: '41px',



                        }} onClick={
                            () => {
                                handleButtonClick();
                            }}>Начать тест</button>
                    </div>
                </div>
            </Group>) : (<p>Загрузка...</p>)}
        </>
    )
}