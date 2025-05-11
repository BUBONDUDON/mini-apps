import "./MyFav.css";

import { Panel, View } from "@vkontakte/vkui";

import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { useEffect, useState } from "react";
import { loadTableData } from "../../../../utils/Server/LoadTableFromServer";
import { ShowAdditionalInformation } from "../../CommonFiles/ShowAdditionalInformation";

export const MyFav = ({ id, fetchedUser }) => {
    const navigator = useRouteNavigator();
    //Переключалка панелей
    const [activePanel, setActivePanel] = useState(id);
    const [currentTestCardId, setCurrentTestCardId] = useState();
    //БД дата
    const [testCardData, setTestCardData] = useState([]);
    const [favData, setFavData] = useState([]);
    //Прокид активной панели для функций страничек
    const handleResult = (result) => {
        setActivePanel(result);
    };
    // Универсальная функция для загрузки данных
    const fetchData = async (tableName, setData) => {
        const result = await loadTableData(tableName);
        if (result) {
            setData(result);
        }
    };
    //Загрузка избранного
    useEffect(() => {
        fetchData('favorites', setFavData);
    }, []);
    //Загрузка карточек теста
    useEffect(() => {
        fetchData('testCard', setTestCardData);
    }, []);
    //Выбираем ИД карточки тестов из таблицы избранного по ИД пользователя
    const filteredFavData = favData.filter(user => user.vkId === fetchedUser.id);
    //Выбираем все поля карточки тестов из таблицы карточек теста по ИД карточки
    const filteredTestCardData = testCardData.filter(testCard =>
        filteredFavData.some(fav => fav.testCardId === testCard.cardId)
    );
    //Выбираем все поля карточки тестов из таблицы карточек теста по ИД карточки для отрисовки подробностей
    const currentTestCard = filteredTestCardData.filter(testCard => testCard.cardId === currentTestCardId)
    console.log(currentTestCard);
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
                        }}> Избранное </div>
                    </div>
                    {
                        filteredTestCardData.map((testCard) => {
                            const allFieldsEmpty =
                                !testCard.cardPictureName &&
                                !testCard.cardPictureAuthor &&
                                !testCard.cardPictureDateOfCreation &&
                                !testCard.cardPictureCountry;
                            return (
                                <li key={testCard.cardId} style={{
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
                                                setActivePanel("selectedfav");
                                                setCurrentTestCardId(testCard.cardId)
                                            }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                minWidth: '100%',
                                                height: 123,
                                                backgroundImage: `url(${testCard.cardPicture})`,
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
                                                {
                                                    allFieldsEmpty ? ("Автор не добавил описания :(")
                                                        :
                                                        (`<<${testCard.cardPictureName ?? "Название: Пустенько :/"}>>, 
                                                            ${testCard.cardPictureAuthor ?? "Автор: Пустенько :/"}, 
                                                            ${testCard.cardPictureDateOfCreation ?? "Дата создания: Пустенько :/"}, 
                                                            ${testCard.cardPictureCountry ?? "Страна: Пустенько :/"}`)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </li>)
                        })
                    }
                </Panel>
                <Panel id="selectedfav">
                    <ShowAdditionalInformation
                        cardId={currentTestCardId}
                        onResult={handleResult}
                        fetchedUser={fetchedUser}
                        showFav={false}
                        panelName={"myfav"} />
                </Panel>
            </View>
        </>
    );
}