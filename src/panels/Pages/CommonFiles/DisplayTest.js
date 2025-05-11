import { Button, Card, Group, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/Server/supabase';

const DisplayTest = ({ cards = [], onResult, fetchedUser, startTime }) => {
    const { id } = { ...fetchedUser };
    const [isOpen, setIsOpen] = useState(false);
    const [complaint, setComplaint] = useState('');
    // Объект для отслеживания статуса жалобы
    const [complaintStatus, setComplaintStatus] = useState({});
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const [currentCardId, setCurrentCardId] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    //Время в секундах
    const [elapsedTime, setElapsedTime] = useState(0);
    // Флаг для управления таймером
    const [timerActive, setTimerActive] = useState(true);
    //ОТПРАВКА ЖАЛОБЫ
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('complaint')
            .insert([{ vkId: id, cardId: cards[currentCardId]?.cardId, description: complaint }]);

        if (error) {
            console.error('Ошибка при отправке жалобы:', error);
        } else {
            setComplaintStatus(prev => ({ ...prev, [currentCardId]: true })); // Устанавливаем статус для текущей карточки
            handleClose();
        }
    };
    // Проверка, отправлял ли пользователь жалобу
    useEffect(() => {
        const checkComplaint = async () => {
            const { data, error } = await supabase
                .from('complaint')
                .select('*')
                .eq('vkId', id)
                .eq('cardId', cards[currentCardId]?.cardId);

            if (data && data.length > 0) {
                setComplaintStatus(prev => ({ ...prev, [currentCardId]: true })); // Если есть запись, устанавливаем состояние
            }
        };
        checkComplaint();
    }, [currentCardId, id, cards]);

    const getRandomAnswers = () => {
        const currentCard = cards[currentCardId];
        if (!currentCard) return [];

        const answers = [
            currentCard.cardCorrectAnswer,
            currentCard.cardWrongAnswer1,
            currentCard.cardWrongAnswer2,
            currentCard.cardWrongAnswer3,
        ].filter(answer => answer !== null);
        return answers.sort(() => Math.random() - 0.5);
    };
    useEffect(() => {
        setShuffledAnswers(getRandomAnswers());
    }, [currentCardId]); // Перемешиваем ответы только при изменении currentCardId
    const handleAnswer = (answer) => {
        setUserAnswers(prevAnswers => [
            ...prevAnswers,
            {
                question: currentCard.cardQuestion,
                correctAnswer: currentCard.cardCorrectAnswer,
                userAnswer: answer,
                picture: currentCard.cardPicture
            }
        ]);

        if (answer === currentCard.cardCorrectAnswer) {
            setCorrectAnswersCount(correctAnswersCount + 1);
        }
        if (currentCardId < cards.length - 1) {
            setCurrentCardId(currentCardId + 1);
        } else {
            setShowResult(true);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    useEffect(() => {
        // Устанавливаем начальное время при монтировании компонента
        if (startTime === null) {
            startTime = Date.now();
        }

        // Обновляем время каждые 1000 мс, если таймер активен
        const timer = setInterval(() => {
            if (timerActive) {
                const currentTime = Math.floor((Date.now() - startTime) / 1000); // Вычисляем прошедшее время в секундах
                setElapsedTime(currentTime);
            }
        }, 1000);

        return () => clearInterval(timer); // Чистим таймер при размонтировании
    }, [startTime, timerActive]);

    useEffect(() => {
        // Останавливаем таймер, когда showResult становится true
        if (showResult) {
            setTimerActive(false);
        }
    }, [showResult]);

    if (showResult) {
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        return (
            <div style={{
                background: 'black',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
                position: 'relative',
                width: '100%',
            }}>
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                }}>
                    <h2 style={{
                        margin: '20px auto 30px auto',
                        fontSize: '24px',
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        textAlign: 'center',
                        color: "white"
                    }}>Результаты</h2>

                    <div style={{
                        backgroundColor: 'rgba(189, 189, 189, 1)',
                        width: '210px',
                        height: '119px',
                        padding: '11px 15px 17px 21px',
                        float: 'left',
                        marginRight: '21px',
                        boxSizing: 'border-box',
                        marginTop: '17px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <span style={{
                                color: 'black',
                                fontSize: '16px',
                                marginRight: '29px'
                            }}>Правильно</span>
                            <span style={{
                                fontSize: '16px',
                                color: 'black'
                            }}>{correctAnswersCount}</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '15px'
                        }}>
                            <span style={{
                                color: 'black',
                                fontSize: '16px',
                                marginRight: '29px'
                            }}>Неправильно</span>
                            <span style={{
                                fontSize: '16px',
                                color: 'rgba(255, 0, 0, 1)'
                            }}>{cards.length - correctAnswersCount}</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '15px'
                        }}>
                            <span style={{
                                color: 'black',
                                fontSize: '16px',
                                marginRight: '29px'
                            }}>Время</span>
                            <span style={{
                                fontSize: '16px',
                                color: 'black'
                            }}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</span>
                        </div>
                    </div>

                    <div style={{
                        width: '135px',
                        height: '135px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '48px',
                        fontWeight: '700',
                        color: 'rgba(0, 0, 0, 1)',
                        borderRadius: '90px',
                        display: 'flex',
                        marginRight: '20px',
                        marginBottom: '41px',
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        float: 'right',


                    }}>
                        {Math.round((correctAnswersCount / cards.length) * 100)}%
                    </div>
                </div>

                {/* Список вопросов с картинками */}
                <div style={{
                    borderRadius: '20px 20px 0 0 ',
                    background: 'white'
                }}>

                    <h3 style={{
                        color: 'black',
                        fontSize: '16px',
                        fontWeight: '500',
                        width: '90%',
                        margin: '20px 20px 0 20px'
                    }}>Показать ответы</h3>

                    {userAnswers.map((answer, index) => (
                        <Card /*стандарт блок*/
                            key={index}
                            style={{
                                backgroundImage: `url(${answer.picture})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '76px',
                                marginBottom: '12px',
                                borderRadius: '8px',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                width: '90%',
                                margin: '20px'
                            }}
                            onClick={() => toggleExpand(index)}>
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',

                            }}>
                                <span style={{ fontWeight: '500' }}>{index + 1} вопрос</span>
                                <span style={{
                                    color: answer.userAnswer === answer.correctAnswer ? '#4BB34B' : '#E64646',
                                    fontWeight: '500'
                                }}>
                                    {answer.userAnswer === answer.correctAnswer ? '✓' : '✗'}
                                </span>
                            </div>



                            {expandedIndex === index && (
                                <div /*расскрыв блок*/ style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    padding: '16px',
                                    overflowY: 'auto',
                                }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{
                                            color: '#aaa',
                                            fontSize: '14px',
                                            marginBottom: '4px'
                                        }}>Вопрос:</div>
                                        <div style={{ fontWeight: '500' }}>{answer.question}</div>
                                    </div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{
                                            color: '#aaa',
                                            fontSize: '14px',
                                            marginBottom: '4px'
                                        }}>Правильный ответ:</div>
                                        <div style={{
                                            fontWeight: '500',
                                            color: '#4BB34B'
                                        }}>{answer.correctAnswer}</div>
                                    </div>
                                    <div>
                                        <div style={{
                                            color: '#aaa',
                                            fontSize: '14px',
                                            marginBottom: '4px'
                                        }}>Ваш ответ:</div>
                                        <div style={{
                                            fontWeight: '500',
                                            color: answer.userAnswer === answer.correctAnswer ? '#4BB34B' : '#E64646'
                                        }}>{answer.userAnswer}</div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}

                    
                </div>
            </div>
        );
    }

    const currentCard = cards[currentCardId];
    if (!currentCard) {
        return <div>Нет доступных вопросов.</div>;
    }

    return (
        <div style={{
            background: 'rgba(223, 223, 230, 1)',
            flexGrow: '1'
            }}>
            <div
                style={{
                    Minwidth: '100%',
                    backgroundImage: `url(${currentCard.cardPicture})`,
                    height: '298px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}>
                <div>
                    <button onClick={() => onResult("selectedreviewtestpanel")} style={{
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
                    <button
                        onClick={handleOpen}
                        disabled={complaintStatus[currentCardId]}
                        style={{
                            backgroundColor: 'rgba(0,0,0,0)',
                            position: 'absolute',
                            border: 'none',
                            marginTop: 17,
                            right: 17,

                        }}>
                        <img
                            src="complaint_btn.svg"
                            style={{
                            }} />
                    </button>

                    {isOpen && (/*форма  */
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 4
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: ' 8px 16px 16px 16px',
                                borderRadius: '18px',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                minHeight: '148px',
                                width: '327px',
                            }}>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'right',
                                    paddingRight: '9px',
                                    marginBottom: '24px',

                                }}>

                                    <h2 style={{
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        margin: '0',
                                        display: 'inline-block',
                                        color: 'black'

                                    }}>Подать жалобу</h2>

                                    <button style={{
                                        border: 'none',
                                        background: 'none',
                                        width: '24px',
                                        height: '24px',
                                        marginLeft: '68px'
                                    }} type="button"
                                        onClick={handleClose}><img src='button_close.svg'></img>
                                    </button>
                                </div>

                                <textarea
                                    style={{
                                        color: 'black',
                                        minHeight: '44px',
                                        maxHeight: '57px',
                                        width: '327px',
                                        overflowY: 'scroll',
                                        scrollbarWidth: 'none',
                                        borderRadius: '10px',
                                        display: 'inline-block',
                                        backgroundColor: 'rgba(223, 223, 230, 1)',
                                        border: 'none',
                                        resize: 'none',
                                        marginBottom: '12px',
                                        paddingTop: '15px',
                                        paddingBottom: '15px',
                                        paddingLeft: '10px',
                                        boxSizing: 'border-box'
                                    }}
                                    type="text"
                                    value={complaint}
                                    onChange={(e) => setComplaint(e.target.value)}
                                    placeholder="Введите вашу жалобу"
                                    required
                                />
                                <button style={{
                                    width: '327px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                }} onClick={handleSubmit} type="submit">Отправить
                                </button>


                            </div>
                        </div>)}

                </div>
            </div>



            <div
                style={{
                    height: '122px',
                    minWidth: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    color: 'rgba(255, 255, 255, 1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                }}>
                <h2 style={{
                    fontSize: '18px',

                }}>{currentCard.cardQuestion}</h2>
            </div>


            <div style={{
                display: 'flex',
                flexGrow: '1',
                flexShrink: '0',
                backgroundColor: 'rgba(223, 223, 230, 1)',
            }}>


                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '100%',
                    flexGrow: '1',
                    flexShrink: '0',
                    backgroundColor: 'rgba(223, 223, 230, 1)',
                    paddingTop: '20px'

                }}>
                    {shuffledAnswers.map((answer, index) => (
                        <button style={{
                            border: 'none',
                            borderRadius: '20px',
                            width: '90%',
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            color: 'rgba(0, 0, 0, 1)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '15px 0 ',
                            marginBottom: '13.05px',

                            }} key={index} onClick={() => handleAnswer(answer)}>
                            <span style={{
                                fontSize: '16px',
                            }}>{answer}</span>
                        </button>
                    ))}

                    
                </div>
            </div>

        </div>/*ебаный див*/

        
    );
};

export default DisplayTest;