import { useEffect, useState } from "react";
import { loadTableData } from "../../../utils/Server/LoadTableFromServer";
import { supabase } from "../../../utils/Server/supabase";


export const ShowAdditionalInformation = ({ cardId, onResult, fetchedUser, showFav, panelName }) => {
    const { id } = { ...fetchedUser };
    //БД дата
    const [testCardData, setTestCardData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    // Универсальная функция для загрузки данных
    const fetchData = async (tableName, setData) => {
        const result = await loadTableData(tableName);
        if (result) {
            const filteredData = result.find(card => card.cardId === cardId);
            setData(filteredData);
            checkIfFavorite(id, cardId); // Проверяем, есть ли в избранном
        }
    };
    // Проверка, является ли элемент избранным
    const checkIfFavorite = async (vkId, testCardId) => {
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('vkId', vkId)
            .eq('testCardId', testCardId);

        if (data && data.length > 0) {
            setIsFavorite(true); // Устанавливаем состояние, если элемент в избранном
        } else {
            setIsFavorite(false); // Устанавливаем состояние, если элемент не в избранном
        }
    };
    // Функция для добавления или удаления из избранного
    const handleSubmit = async () => {
        if (isFavorite) {
            // Если элемент уже в избранном, удаляем его
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('vkId', id)
                .eq('testCardId', cardId);

            if (!error) {
                setIsFavorite(false); // Обновляем состояние
            } else {
                console.error("Ошибка при удалении из избранного:", error);
            }
        } else {
            // Если элемента нет в избранном, добавляем его
            const { error } = await supabase
                .from('favorites')
                .insert([{ vkId: id, testCardId: cardId }]);

            if (!error) {
                setIsFavorite(true); // Обновляем состояние
            } else {
                console.error("Ошибка при добавлении в избранное:", error);
            }
        }
    };
    // Загрузка карточек теста
    useEffect(() => {
        fetchData('testCard', setTestCardData);
    }, [cardId]); // Добавлен cardId в зависимости
    return (
        <>
            {testCardData ? (
                <>
                    <div style={{
                        backgroundColor: 'rgba(223, 223, 230, 1)',
                        minHeight: '100%',
                        minWidth: '100%',
                        flexGrow: '1'
                    }}>
                        <div style={{
                            backgroundImage: `url(${testCardData.cardPicture})`,
                            backgroundPosition: 'center',
                            height: '298px',
                            maxWidth: '100%',
                            backgroundSize: 'cover'
                        }}>
                            <button style={{
                                background: "none",
                                width: '11px',
                                height: '20px',
                                border: 'none',
                                float: 'left',
                                paddingLeft: '29.6px',
                                marginTop: '18px'
                            }} onClick={() => onResult(panelName)}>
                                <img src="Back_Icon_White1.svg"></img>
                            </button>
                            {showFav && (
                                <button style={{
                                    display: 'flex',
                                    float: 'right',
                                    padding: 0,
                                    width: '38x',
                                    height: '38px',
                                    border: 'none',
                                    background: 'none',
                                    marginTop: '9px',
                                    marginRight: '10px'
                                }}
                                    onClick={handleSubmit}>
                                    <img style={{
                                        width: '38px',
                                        height: '38px'
                                    }} src={isFavorite ? "heart2.svg" : "heart1.svg"}>
                                    </img>
                                </button>
                            )}
                        </div >
                        <div style={{
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                            display: 'inline-block',
                            overflow: 'auto',
                            color: 'rgb(255, 255, 255)',
                            minHeight: '94px',
                            minWidth: '100%',
                        }}>
                            <ol style={{
                                listStyleType: 'none',
                                padding: '0',
                                marginTop: '3px',
                                marginBottom: '9px',
                                marginLeft: '32px'
                            }}>
                                <li>Название: {testCardData.cardPictureName}</li>
                                <li>Автор: {testCardData.cardPictureAuthor}</li>
                                <li>Дата создания: {testCardData.cardPictureDateOfCreation}</li>
                                <li>Страна: {testCardData.cardPictureCountry}</li>
                            </ol>
                        </div>

                        <div style={{
                            marginTop: 0,
                            width: '81%',
                            margin: '0 auto',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            padding: '14px 19px 11px 16px',
                            marginBottom: '20px',
                            color: 'black'

                        }}>
                            {testCardData.cardPictureDescription}
                        </div>
                    </div>
                </>
            ) : (
                <p>Загрузка...</p> // Сообщение о загрузке
            )}
        </>
    )
}