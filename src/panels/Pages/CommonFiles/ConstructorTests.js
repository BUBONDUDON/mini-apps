import React, { useEffect, useState } from "react";
import { supabase } from "../../../utils/Server/supabase";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
//import './ConstructorTests.css';

export const ConstructorTests = ({onResult, panelName, fetchedUser, masCards =[], forEdit}) => {
  //навигация по страничкам .JS
  const navigator = useRouteNavigator();
  //Для модального окна с доп инфой о картине
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  //Столбцы таблицы test
  const [testName, setTestName] = useState("");
  const [testInfo, setTestInfo] = useState("");
  const [testPic, setTestPic] = useState();
  const [testVkId, setTestVkId] = useState(null);
  //Массив карточек вопросов теста
  const [cards, setCards] = useState(masCards);
  // Индекс текущего вопроса
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Используем useEffect для обновления testVkId, когда fetchedUser изменяется
  useEffect(() => {
    if (fetchedUser && fetchedUser.id) {
      setTestVkId(fetchedUser.id);
    }
  }, [fetchedUser]);
  //Сохранение картинки файлом в хук, от туда в в тест
  const handleTestImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTestPic(file);
    }
  };
  //Функция увеличения массива неправильных ответов, для корректной отрисовки инпутов ответов на вопрос
  const addAnswerInput = () => {
    if (wrongAnswers.length < 3) {
      setWrongAnswers([...wrongAnswers, ""]);
    } else {
      alert("Достигнут лимит на добавление ответов");
    }
  };
  //Словарь + замена кирилицы на латин буквы
  const transliterate = (str) => {
    const map = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya" };
    return str.split("").map((char) => map[char] || char).join("");
  };
  //Отправка юзер инпута в БД:
  //1 тест -> test
  //2 карточки теста -> testCard
  //3 картинка -> storage -> testId -> card.index
  //4 загрузка картинки в карточку теста в столбец cardPicture
  const SendToDatabase = async (cards = []) => {
    const sanitizedTestPictureName = transliterate(testPic.name).replace(/\s+/g, "_");
    // Сохранение теста в таблицу test
    const { data: testData, error: testError } = await supabase
      .from("test")
      .insert([{ categoryId: 7, testName: testName, testInfo: testInfo, vkId: testVkId }])
      .select("testId")
      .single();

    if (testError) {
      console.error("Ошибка при добавлении теста:", testError);
      return;
    }

    const testId = testData.testId;
    if (!testId) {
      console.error("testId не был получен");
      return;
    }

    const { error: pictureError } = await supabase.storage
      .from("testsPictures")
      .upload(`${testId}/${sanitizedTestPictureName}`, testPic);

    if (pictureError) {
      console.error("Ошибка при загрузке изображения:", pictureError);
      return;
    }
    // Обновление строки теста с URL картинки
    const { error: updateError } = await supabase
      .from("test")
      .update({
        testPic: `https://dlwsyaejkqgzawbzypmc.supabase.co/storage/v1/object/public/testsPictures/${testId}/${sanitizedTestPictureName}`,
      })
      .eq("testId", testId);

    if (updateError) {
      console.error("Ошибка при обновлении теста с URL картинки:", updateError);
      return;
    }

    for (const card of cards) {
      // Загрузка изображения в storage -> testId -> testCardId
      const testCardId = cards.indexOf(card);
      if (card.cardPicture) {
        const sanitizedCardPictureName = transliterate(card.cardPicture.name).replace(/\s+/g, "_");
        const { error: pictureError } = await supabase.storage
          .from("cardpictures")
          .upload(`${testData.testId}/${testCardId}/${sanitizedCardPictureName}`, card.cardPicture);

        if (pictureError) {
          console.error("Ошибка при загрузке изображения:", pictureError);
          return;
        }
        // Сохранение данных карточки в таблицу testCard
        const { error: cardError } = await supabase.from("testCard").insert([{
          testId: testId,
          cardQuestion: card.cardQuestion,
          cardPicture: `https://dlwsyaejkqgzawbzypmc.supabase.co/storage/v1/object/public/cardpictures/${testData.testId}/${testCardId}/${sanitizedCardPictureName}`,
          cardCorrectAnswer: card.cardCorrectAnswer,
          cardWrongAnswer1: card.cardWrongAnswers[0],
          cardWrongAnswer2: card.cardWrongAnswers[1] || null,
          cardWrongAnswer3: card.cardWrongAnswers[2] || null,
          cardPictureName: card.cardPictureName || null,
          cardPictureAuthor: card.cardPictureAuthor || null,
          cardPictureCountry: card.cardPictureCountry || null,
          cardPictureDescription: card.cardPictureDescription || null,
          cardPictureDateOfCreation: card.cardPictureDateOfCreation || null
        }]);

        if (cardError) {
          console.error("Ошибка при добавлении карточки:", cardError);
          return;
        }
      }
    }
    console.log("Данные успешно отправлены!");
  };
  //Прокид активной панели для функций страничек
  const handleResult = (result) => {
    setActivePanel(result);
  };
  // Функция для обновления карточки по индексу
  const updateCard = (index, newCard) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index] = newCard;
      return updatedCards;
    });
  };

  //Далее
  const handleNext = () => {
    // Проверка на заполненность полей текущей карточки
    const currentCard = cards[currentQuestionIndex];

    if (!currentCard.cardQuestion || !currentCard.cardCorrectAnswer || !currentCard.cardWrongAnswers[0]) {
      alert("Пожалуйста, заполните вопрос, правильный ответ и первый неправильный ответ.");
      return;
    }

    // Переход к следующей карточке, если это возможно
    if (currentQuestionIndex < cards.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Вы находитесь на последней карточке.");
    }
  };
  //Назад
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  // Пример функции для обновления карточки
  const handleCardChange = (field, value) => {
    updateCard(currentQuestionIndex, {
      ...cards[currentQuestionIndex],
      [field]: value,
    });
  };
  //Закончить тест
  const handleFinishTest = async () => {
    if (cards.length === 0) {
      alert("Добавьте хотя бы один вопрос перед завершением теста.");
      return;
    }

    await SendToDatabase(cards);
    setCards([]); // Сбросить массив карточек
    navigator.replace("/");
  };
  //Обновление всех полей
  const handleInputChange = (field, value, index) => {
    const updatedCards = [...cards];
    if (updatedCards[currentQuestionIndex]) {
      if (field === 'cardQuestion') {
        updatedCards[currentQuestionIndex].cardQuestion = value;
      } else if (field === 'cardPicture') {
        updatedCards[currentQuestionIndex].cardPicture = value;
      } else if (field === 'cardCorrectAnswer') {
        updatedCards[currentQuestionIndex].cardCorrectAnswer = value;
      } else if (field === 'cardWrongAnswers') {
        updatedCards[currentQuestionIndex].cardWrongAnswers[index] = value;
      } else if (field === 'cardPictureName') {
        updatedCards[currentQuestionIndex].cardPictureName = value;
      } else if (field === 'cardPictureAuthor') {
        updatedCards[currentQuestionIndex].cardPictureAuthor = value;
      } else if (field === 'cardPictureCountry') {
        updatedCards[currentQuestionIndex].cardPictureCountry = value;
      } else if (field === 'cardPictureDescription') {
        updatedCards[currentQuestionIndex].cardPictureDescription = value;
      } else if (field === 'cardPictureDateOfCreation') {
        updatedCards[currentQuestionIndex].cardPictureDateOfCreation = value;
      }
    }
    setCards(updatedCards);
  };
  useEffect(() => {
    console.log(cards);
  }, [cards]);
  return (
    <>
      <div style={{
        width: '100%',
        height: '100%',
        margin: '0',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        scrollbarWidth: 'none',
        background: 'white',
      }}>


        <div
          style={{
            display: 'flex',
            background: 'black',
            color: 'white',
            fontSize: '18px',
            height: '56px',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0'
          }}>
          <button
            onClick={() => onResult(panelName)}
            style={{
              background: "none",
              width: '11px',
              height: '20px',
              border: 'none',
              float: 'left',
              paddingLeft: '29.6px'
            }}><img src="Back_Icon_White1.svg"></img></button>
          <div style={{
            margin: '0 auto',
            paddingRight: '29.6px',
            fontSize: '18px'
          }}>Конструктор тестов</div>
        </div>
        <div style={{
          width: '100%',
          height: '103px',
          backgroundColor: 'rgba(223, 223, 230, 1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <input
            type="text"
            required
            autoCapitalize="on"
            spellCheck='true'
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Название"
            style={{
              boxSizing: 'border-box',
              width: '90%',
              border: 'none',
              height: '60px',
              borderRadius: '20px',
              color: 'black',
              fontSize: '20px',
              fontWeight: '400',
              paddingLeft: '19px',
              paddingRight: '22.69px',
              backgroundImage: 'url(pencil_black.svg)',
              backgroundRepeat: 'no-repeat',
              outline: 'none',
              backgroundPositionX: '98%',
              backgroundPositionY: 'center',
            }} />
        </div>



        <textarea
          required
          autoCapitalize="on"
          spellCheck='true'

          value={testInfo}
          onChange={(e) => setTestInfo(e.target.value)}
          placeholder="Краткая информация о тесте"
          style={{
            resize: 'none',
            boxSizing: 'border-box',
            minHeight: '60px',
            height: '60px',
            maxHeight: '145px',
            color: 'white',
            backgroundColor: 'black',
            fontSize: "16px",
            borderRadius: '0',
            padding: '20px 0 20px 39px',
            marginBottom: '20px'

          }}
        />


        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(223, 223, 230, 1)',
          height: '238px',
          width: '100%',
          overflow: 'hidden'
        }}>
          <input
            required
            type="file"
            accept="image/*"
            onChange={handleTestImageUpload}
            style={{ display: "none" }}
            id="test-image-upload"
          />
          <label htmlFor="test-image-upload" style={{
            textAlign: 'center',
            cursor: 'pointer',
          }}>
            {testPic ? (
              <img src={URL.createObjectURL(testPic)} alt="Preview" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} />
            ) : (
              <div style={{
                color: 'black',

              }}>Картинка теста</div>
            )}
          </label>
        </div>

        <input
          required
          autoCapitalize="on"
          spellCheck='true'
          value={cards[currentQuestionIndex]?.cardQuestion || ''}
          onChange={(e) => handleInputChange('cardQuestion', e.target.value)}
          placeholder={`Вопрос ${currentQuestionIndex + 1}/${cards.length}`}
          style={{
            boxSizing: 'border-box',
            color: 'white',
            backgroundColor: 'black',
            width: '90%',
            borderRadius: '20px',
            fontSize: '18px',
            resize: 'none',
            border: 'none',
            height: '60px',
            alignContent: 'center',
            textAlign: 'center',
            margin: '20px auto'
          }}
          inputStyle={{
            color: 'white',
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(223, 223, 230, 1)',
          height: '238px',
          width: '100%',
          overflow: 'hidden'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('cardPicture', e.target.files[0])}
            style={{ display: "none" }}
            id="card-image-upload"
          />
          <label htmlFor="card-image-upload">
            {cards[currentQuestionIndex]?.cardPicture ? (
              <img src={!forEdit ? URL.createObjectURL(cards[currentQuestionIndex]?.cardPicture) : cards[currentQuestionIndex]?.cardPicture} alt="Preview" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'

              }} />
            ) : (
              <div style={{
                color: 'black'
              }}>Картинка</div>
            )}
          </label>
        </div>


        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}/*-------------- */>
          <button style={{
            boxSizing: 'border-box',
            width: '90%',
            height: '44px',
            border: 'none',
            fontSize: '18px',
            color: 'rgba(117, 117, 117, 1)',
            background: 'black',
            borderRadius: '20px',
            marginBottom: '41px',
          }} onClick={handleOpen}>Доп. информация</button>
        </div>
        {isOpen && (/*форма  */
          <div style={{
            position: 'fixed',
            top: '10px',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5
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
                  color: 'black',
                  marginRight: '23px'

                }}>Дополнительная информация</h2>

                <button style={{
                  border: 'none',
                  background: 'none',
                  width: '24px',
                  height: '24px',
                }} type="button"
                  onClick={
                    () => {
                      handleClose()
                    }}
                >
                  <img src='button_close.svg'></img>
                </button>
              </div>

              <textarea
                style={{
                  boxSizing: 'border-box',
                  padding: '15px',
                  paddingRight: '0',
                  paddingLeft: '10px',
                  height: '44px',
                  width: '327px',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '10px',
                  display: 'inline-block',
                  backgroundColor: 'rgba(223, 223, 230, 1)',
                  border: 'none',
                  resize: 'none',
                  marginBottom: '12px',
                  color: 'black'
                }}
                type="text"
                value={cards[currentQuestionIndex]?.cardPictureName}
                onChange={(e) => handleInputChange('cardPictureName', e.target.value)}
                placeholder="Введите название"
                required
                autoCapitalize="on"
                spellCheck='true'
              />
              <textarea
                style={{
                  color: 'black',
                  boxSizing: 'border-box',
                  padding: '15px',
                  paddingRight: '0',
                  paddingLeft: '10px',
                  height: '44px',
                  width: '327px',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '10px',
                  display: 'inline-block',
                  backgroundColor: 'rgba(223, 223, 230, 1)',
                  border: 'none',
                  resize: 'none',
                  marginBottom: '12px'
                }}
                type="text"
                value={cards[currentQuestionIndex]?.cardPictureAuthor}
                onChange={(e) => handleInputChange('cardPictureAuthor', e.target.value)}
                placeholder="Введите автора картины"
                required
                autoCapitalize="on"
                spellCheck='true'
              />
              <textarea
                style={{
                  boxSizing: 'border-box',
                  padding: '15px',
                  paddingRight: '0',
                  paddingLeft: '10px',
                  height: '44px',
                  width: '327px',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '10px',
                  display: 'inline-block',
                  backgroundColor: 'rgba(223, 223, 230, 1)',
                  border: 'none',
                  resize: 'none',
                  marginBottom: '12px',
                  color: 'black'
                }}
                type="text"
                value={cards[currentQuestionIndex]?.cardPictureCountry}
                onChange={(e) => handleInputChange('cardPictureCountry', e.target.value)}
                placeholder="Введите страну"
                required
                autoCapitalize="on"
                spellCheck='true'
              />
              <textarea
                style={{
                  boxSizing: 'border-box',
                  padding: '15px',
                  paddingRight: '0',
                  paddingLeft: '10px',
                  height: '44px',
                  width: '327px',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '10px',
                  display: 'inline-block',
                  backgroundColor: 'rgba(223, 223, 230, 1)',
                  border: 'none',
                  resize: 'none',
                  marginBottom: '12px',
                  color: 'black'
                }}
                type="text"
                value={cards[currentQuestionIndex]?.cardPictureDateOfCreation}
                onChange={(e) => handleInputChange('cardPictureDateOfCreation', e.target.value)}
                placeholder="Введите дату создания"
                required
                autoCapitalize="on"
                spellCheck='true'
              />
              <textarea
                style={{
                  color: 'black',
                  boxSizing: 'border-box',
                  padding: '15px',
                  paddingRight: '0',
                  paddingLeft: '10px',
                  height: '44px',
                  width: '327px',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '10px',
                  display: 'inline-block',
                  backgroundColor: 'rgba(223, 223, 230, 1)',
                  border: 'none',
                  resize: 'none',
                  marginBottom: '12px'
                }}
                type="text"
                value={cards[currentQuestionIndex]?.cardPictureDescription}
                onChange={(e) => handleInputChange('cardPictureDescription', e.target.value)}
                placeholder="Введите доп инфу"
                required
                autoCapitalize="on"
                spellCheck='true'
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
              }} type="submit"
                onClick={
                  () => {
                    handleClose()
                  }}
              >Готово
              </button>
            </div>
          </div>)}

        <input
          required
          autoCapitalize="on"
          spellCheck='true'
          placeholder="Правильный ответ"
          value={cards[currentQuestionIndex]?.cardCorrectAnswer || ''}
          onChange={(e) => handleInputChange('cardCorrectAnswer', e.target.value)}
          style={{
            boxSizing: 'border-box',
            border: 'none',
            background: 'black',
            textAlign: 'center',
            width: '90%',
            height: '44px',
            borderRadius: '20px',
            margin: '0 auto',
            fontSize: '18px',
            color: 'white'
          }}
        />

        {cards[currentQuestionIndex]?.cardWrongAnswers.map((answer, index) => (
          <form key={index} style={{
            display: 'flex',
            marginTop: '13px'
          }}>
            <input
              required
              autoCapitalize="on"
              spellCheck='true'
              type="text"
              value={answer}
              onChange={(e) => handleInputChange('cardWrongAnswers', e.target.value, index)}
              placeholder={`Неправильный ответ ${index + 1}`}
              style={{
                boxSizing: 'border-box',
                color: 'black',
                width: '90%',
                background: 'rgba(223, 223, 230, 1)',
                borderRadius: '20px',
                textAlign: 'center',
                border: 'none',
                margin: '0 auto',
                fontSize: '18px',
                height: '44px'
              }}
            />
          </form>
        ))}


        <button
          onClick={addAnswerInput}
          disabled={cards[currentQuestionIndex]?.cardWrongAnswers.length >= 3}
          style={{
            boxSizing: 'border-box',
            margin: '0 auto',
            width: 28,
            height: 28,
            padding: 0,
            borderRadius: "50%",
            backgroundColor: "black",
            color: "white",
            fontSize: 24,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginTop: '13px'
          }}
        >
          +
        </button>




        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          width: '90%',
          alignItems: "center",
          margin: '20px auto',
        }}>
          <button
            onClick={handleBack}
            mode="primary"
            style={{
              boxSizing: 'border-box',
              backgroundColor: "black", // Серый фон кнопки
              color: "white",
              borderRadius: "20px",
              padding: "0 30px",
              fontSize: "18px",
              border: "none",
              marginRight: '10px',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "44px"
            }}
          >
            Назад
          </button>

          <button
            onClick={handleNext}
            mode="primary"
            style={{
              boxSizing: 'border-box',
              backgroundColor: "black",
              color: "white",
              borderRadius: "20px",
              padding: "0 30px",
              fontSize: "18px",
              border: "none",
              display: "flex",
              justifyContent: "center",
              height: '44px',
              alignItems: "center",
            }}
          >
            Далее
          </button>
        </div>

        <button
          onClick={handleFinishTest}
          mode="primary"
          style={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "20px",
            padding: "12px 24px",
            fontSize: "18px",
            border: "none",
            boxSizing: 'border-box',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: '0 auto',
            marginBottom: '137px',
            width: '90%',
          }}
        >
          Закончить тест
        </button>
      </div>
    </>
  )
}
