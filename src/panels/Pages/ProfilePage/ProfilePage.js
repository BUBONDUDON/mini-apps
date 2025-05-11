
import { Panel, View } from "@vkontakte/vkui";
import './ProfilePage.css';

import BottomMenu from "../../Components/Menu/BottomMenu";
import { useState } from "react";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

export const ProfilePage = ({ id, fetchedUser }) => {
    const { photo_max_orig, first_name, last_name } = { ...fetchedUser };
    const navigator = useRouteNavigator();
    const [activePanel, setActivePanel] = useState(id);
    const handleResult = (result) => {
        setActivePanel(result);
    };

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <View id={activePanel} activePanel={activePanel}>
            <Panel id={id}>
                {/* Скроллируемый контейнер */}
                <div style={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: '40px',
                    boxSizing: 'border-box',
                    background: 'rgba(223, 223, 230, 1)'
                }}>
                    {fetchedUser && (
                        <div style={{
                            position: 'relative',
                            backgroundImage: `url(${photo_max_orig})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: 303,
                        }}>
                            <div style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.74)',
                                padding: '8px 25px 20px 18px',
                                boxSizing: 'border-box',
                                height: '50px',
                                marginBottom: '24px',
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: 'medium'
                            }}>
                                {`${first_name} ${last_name}`}
                            </div>
                        </div>
                    )}

                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        height: 98,
                        backgroundColor: 'black',
                        paddingLeft: 20,
                        paddingRight: 47,
                    }}>
                        <ul style={{
                            listStyleType: 'none',
                            paddingLeft: 0,
                            margin: 0,
                        }}>
                            <li style={{ marginBottom: 10, color: 'white', }}>Кол-во пройденных тестов</li>
                            <li style={{ marginBottom: 13, color: 'white', }}>% правильных ответов</li>
                            <li style={{ marginBottom: 7, color: 'white', }}>Любимые категории</li>
                        </ul>
                        <button
                            onClick={toggleVisibility}
                            style={{
                                border: 'none',
                                backgroundColor: 'rgba(0,0,0,0)',
                                width: 44,
                                height: 44,
                                position: 'absolute',
                                top: 61,
                                right: 26,
                                cursor: 'pointer',
                                transform: isVisible ? 'rotate(-180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                            }}>
                            <img src="chevron_up.png" alt="toggle" />
                        </button>
                    </div>
                    <div className={`category-list ${isVisible ? 'visible' : ''}`}>
                        <div style={{
                            backgroundColor: 'white',
                            color: 'black',
                            borderRadius: '20px',
                            padding: '6px 14px',
                            fontSize: '14px',
                            fontWeight: 600
                        }}>Живопись</div>
                        <div style={{
                            backgroundColor: 'white',
                            color: 'black',
                            borderRadius: '20px',
                            padding: '6px 14px',
                            fontSize: '14px',
                            fontWeight: 600
                        }}>Диджитал-арт</div>
                    </div>

                    <div style=
                        {{ backgroundColor: 'rgba(223, 223, 230, 1)', paddingBottom: 20 }}>
                        <div style={{
                            width: '233px',
                            height: '43px',
                            backgroundColor: 'white',
                            color: 'black',
                            fontSize: '16px',
                            border: 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 'auto',
                            marginTop: '17px',
                            fontWeight: '500'

                        }}>Достижения</div>

                        <div style={{
                            width: '90%',
                            height: '107px',
                            margin: '0 auto',
                            overflowY: 'scroll',
                            scrollbarWidth: 'none',
                            boxShadow: 'inset 0 -7px 20px -10px rgba(0, 0, 0, 0.5)',
                            gap: '10px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginBottom: '21px',
                            marginTop: '6px'
                        }}>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} style={{
                                    width: '64px',
                                    height: '66px',
                                    borderRadius: '50%',
                                    background: 'pink',

                                }} />
                            ))}
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '90%',
                            margin: '0 auto',
                            justifyContent: 'space-between'
                        }}>
                            <button
                                style={{
                                    width: '160px',
                                    height: '48px',
                                    borderRadius: '20px',
                                    fontSize: '16px',
                                    color: 'black',
                                    background: 'white',
                                    border: 'none',
                                    fontWeight: '500'

                                }}
                                onClick={
                                    () => { navigator.replace("/myfav") }}>Избранное</button>
                            <button style={{
                                width: '160px',
                                height: '48px',
                                borderRadius: '20px',
                                fontSize: '16px',
                                color: 'black',
                                background: 'white',
                                border: 'none',
                                fontWeight: '500'
                            }}
                                onClick={() => navigator.replace("/mytests")}>Мои тесты</button>
                        </div>
                    </div>
                </div>

                {/* Меню всегда внизу */}
                <BottomMenu page={"profilepage"} onResult={handleResult} />
            </Panel>
        </View>
    );
};