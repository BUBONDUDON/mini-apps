import './HomePage.css';
import {
    Card,
    CardGrid,
    Group,
    Panel,
    View
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";



import BottomMenu from "../../Components/Menu/BottomMenu";
import { loadTableData } from "../../../utils/Server/LoadTableFromServer";
import DisplayTest from "../CommonFiles/DisplayTest";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { ShowAdditionalInformation } from "../CommonFiles/ShowAdditionalInformation";
import { ShowReviewTest } from "../CommonFiles/ShowReviewTest";
import { ConstructorTests } from '../CommonFiles/ConstructorTests';

export const HomePage = ({ id, fetchedUser }) => {
    //навигация по страничкам .JS
    const navigator = useRouteNavigator();
    //БД дата
    const [categoryData, setCategoryData] = useState([]);
    const [testData, setTestData] = useState([]);
    const [testCardData, setTestCardData] = useState([]);
    //Переключалка панелей
    const [activePanel, setActivePanel] = useState(id);
    // Состояние для хранения текущего времени
    const [currentTime, setCurrentTime] = useState(null);
    //Хуки-схрон категории
    const [currentCategoryId, setCurrentCategoryId] = useState();
    const [currentCategoryName, setCurrentCategoryName] = useState();
    const [currentCategoryDesc, setCurrentCategoryDesc] = useState();
    const [currentCategoryPic, setCurrentCategoryPic] = useState();
    //Хук-схрон теста
    const [currentTestId, setCurrentTestId] = useState();
    const [currentTestName, setCurrentTestName] = useState();
    const [currentTestInfo, setCurrentTestInfo] = useState();
    const [currentTestPic, setCurrentTestPic] = useState();
    //Хук-схрон карточки теста
    const [currentTestCardId, setCurrentTestCardId] = useState();
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
    //Загрузка категорий
    useEffect(() => {
        fetchData('category', setCategoryData);
    }, []);
    //Загрузка тестов
    useEffect(() => {
        fetchData('test', setTestData);
    }, []);
    //Загрузка карточек теста
    useEffect(() => {
        fetchData('testCard', setTestCardData);
    }, []);
    //Фильтр тестов по ID категории
    const filteredTests = testData.filter(test => test.categoryId === currentCategoryId);
    //Фильтр карточек теста по ID теста
    const filteredTestsCard = testCardData.filter(testCard => testCard.testId === currentTestId);
    return (
        <>
            <View id={activePanel} activePanel={activePanel}>
                <Panel id="homepage" style={{ height: 651 + 117 + 56 }}>
                    <div delimiter="none" style={{
                        backgroundColor: 'black',
                        color: 'white',
                        height: "56px",
                        minWidth: '100%',
                        fontSize: '18px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>Категории</div>
                    <div style=
                        {{
                            backgroundColor: 'rgba(223, 223, 230, 1)',
                            padding: '20px 0',
                            paddingBottom: '117px',
                            height: '80%',
                            overflowY: 'scroll',
                            scrollbarWidth: 'none',
                            boxSizing: 'border-box'
                        }}>
                        {
                            categoryData.map((category) => (
                                <li key={category.id} style={{
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
                                                setCurrentCategoryId(category.id);
                                                setCurrentCategoryName(category.name);
                                                setCurrentCategoryDesc(category.description);
                                                setCurrentCategoryPic(category.picture);
                                                setActivePanel("selectedcategorypanel");
                                            }}>
                                        <div
                                            style={{
                                                minWidth: '100%',
                                                height: 123,
                                                backgroundImage: `url(${category.picture})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover',

                                            }}>
                                            <div
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '11px 20px 13px 20px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.74)',
                                                    color: 'white',
                                                    marginTop: '40px',


                                                }}>{category.name}</div>
                                        </div>

                                    </div>
                                </li>
                            ))
                        }
                    </div>
                    <button
                        className="button-test"
                        onClick={() => setActivePanel("constructortests")}

                        style=
                        {{
                            width: '144px',
                            height: '44px',
                            position: 'fixed',
                            bottom: '150px',
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                            color: 'white',
                            borderRadius: ' 20px 0 0 20px',
                            border: 'none',
                            fontSize: '16px'

                        }}>Создать тест</button>
                    <BottomMenu page={"homepage"} onResult={handleResult} />
                </Panel>

                <Panel id="selectedcategorypanel">

                    <div style={{
                        display: 'flex',
                        background: 'black',
                        color: 'white',
                        fontSize: '18px',
                        height: '56px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0'
                    }}>

                        <button onClick={() => setActivePanel("homepage")} style={{
                            background: "none",
                            width: '11px',
                            height: '20px',
                            border: 'none',
                            float: 'left',
                            paddingLeft: '29.6px'

                        }}>
                            <img src="Back_Icon_White1.svg"></img>
                        </button>
                        <div style={{
                            margin: '0 auto',
                            paddingRight: '29.6px',
                            fontSize: '18px'
                        }}> Категории </div>
                    </div>

                    <div style=
                        {{
                            height: 250,
                            padding: 0,
                            borderRadius: 0,
                            backgroundImage: `url(${currentCategoryPic}`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'
                        }}>
                        <div style={{
                            display: 'inline-block',
                            backgroundColor: 'rgba(0, 0, 0, 0.74)',
                            padding: '7px 19px 12px 19px',
                            color: '#fff', // Цвет текста
                            marginTop: '188px',
                        }}>{currentCategoryName}</div>
                    </div>
                    <div mode="plain" style={{
                        display: 'flex',
                        alignContent: 'center',
                        backgroundColor: 'black',
                        margin: 0,
                        padding: '11px 20px',
                        minHeight: '155px',
                        verticalAlign: 'center'
                    }}>
                        <div style={{
                            margin: 'auto',
                            color: 'rgba(255, 255, 255, 1)',
                        }}>
                            {currentCategoryDesc}
                        </div>
                    </div>

                    <div style={{
                        padding: 20,
                        backgroundColor: 'rgba(223, 223, 230, 1)',
                        flexGrow: 1,
                    }}>
                        {filteredTests.map(test => (
                            <div key={test.testId}>

                                <div
                                    onClick={
                                        () => {
                                            setCurrentTestId(test.testId);
                                            setCurrentTestName(test.testName);
                                            setCurrentTestInfo(test.testInfo);
                                            setCurrentTestPic(test.testPic);
                                            setActivePanel("selectedreviewtestpanel");
                                        }
                                    }
                                    mode="plain"
                                    style={{
                                        borderRadius: 20,
                                        margin: 0,
                                        backgroundColor: 'rgba(223, 223, 230, 1)',
                                        marginBottom: '13px'

                                    }}>
                                    <div
                                        style=
                                        {{
                                            alignContent: 'center',
                                            position: 'relative',
                                            borderRadius: 20,
                                            height: 76,
                                            backgroundImage: `url(${test.testPic})`,
                                            backgroundPosition: 'center',
                                            marginBottom: '13px'

                                        }} >
                                        <div style={{
                                            padding: '10px 20px',
                                            display: 'inline-block',
                                            backgroundColor: 'rgba(0, 0, 0, 0.74)',
                                            color: 'rgba(255, 255, 255, 1)',

                                        }}> {test.testName}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </Panel>

                <Panel id="selectedreviewtestpanel">
                    <ShowReviewTest
                        onResult={handleResult}
                        onResultTestCardId={handleTestCard}
                        startTimer={handleTimer}
                        panelName={"selectedcategorypanel"}
                        testId={currentTestId}
                        showAction={false} />
                </Panel>

                <Panel id="selectedtestpanel">
                    <DisplayTest cards={filteredTestsCard} onResult={handleResult} fetchedUser={fetchedUser} startTime={currentTime} />
                </Panel>

                <Panel id="displaymoreinfo">
                    <ShowAdditionalInformation cardId={currentTestCardId} onResult={handleResult} fetchedUser={fetchedUser} showFav={true} panelName={"selectedreviewtestpanel"} />
                </Panel>
                <Panel id="constructortests">
                    <ConstructorTests
                        onResult={handleResult}
                        panelName={"homepage"}
                        fetchedUser={fetchedUser}
                        masCards={Array.from({ length: 15 }, () => ({
                            cardQuestion: '',
                            cardPicture: null,
                            cardCorrectAnswer: '',
                            cardWrongAnswers: [null, null, null], // Массив для неправильных ответов
                            cardPictureName: '',
                            cardPictureAuthor: '',
                            cardPictureCountry: '',
                            cardPictureDescription: '',
                            cardPictureDateOfCreation: ''
                        }))} 
                        forEdit={false}/>
                    <BottomMenu
                        page={"homepage"} onResult={handleResult} />
                </Panel>
            </View >
        </>
    );
}