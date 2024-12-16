let textArray = [];
let selectedDictionaryName = '';
let numberOfCodes;

const appState = {
    timeStart: null,
    userNumberOfCharacters: 0,
    currentArrayIndex: 0,
};

function formatDateToMySQL(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function saveSessionData(fullAttemptTime, username, timeSpent, speed, userNumberOfCharacters) {
    if (!selectedDictionaryName) {
        console.error('Ошибка: не выбран словарь перед сохранением.');
        return;
    }

    let attemptTime = formatDateToMySQL(fullAttemptTime);
    const codeIds = textArray.map(item => item.idCode);
    const data = {
        attemptTime: attemptTime,
        username: username,
        selectedDict: selectedDictionaryName,
        timeSpent: timeSpent,
        speed: speed,
        userNumberOfCharacters: userNumberOfCharacters,
        userNumberOfSnippets: textArray.length,
        idCodes: codeIds // Передаем массив ID кодов
    };

    console.log(data);

    fetch('controllers/SessionController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error('Error:', error);
        console.log('Server returned:', error.responseText);
    });
}

function getDictionaryInfo() {
    fetch('controllers/CodeController.php?action=getDictionariesInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const select = document.getElementById('prog-lang');
        if (!select) {
            console.error('Element with id "prog-lang" not found');
            return;
        }
        //console.log(data);
        select.innerHTML = '';
        data.forEach(language => {
            const option = document.createElement('option');
            option.value = language.Name;
            option.text = language.Name;
            select.appendChild(option);
            //console.log(`Словарь ${language.Name}, количество всего сниппетов ${language.NumberOfCodes}`);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCodeBlock(selectDictionaryName, selectedNumberOfCodes) {
    if (!selectDictionaryName || !selectedNumberOfCodes) return Promise.reject('No dictionary selected or number of codes not provided');

    // Тут можно что-то сделать с числом существующих кодов и с числом нужных пользователю 

    return fetch('controllers/CodeController.php?action=getCodes&dictionaryName=' + encodeURIComponent(selectDictionaryName) + '&numberOfCodes=' + selectedNumberOfCodes)
        .then(response => response.json())
        .then(data => {
            if (data.error) return Promise.reject(data.error);

            textArray = data.map(item => ({
                idCode: item.idCode, // Добавляем idCode
                code: item.Code,
                highlightName: item.HighlightName
            }));
            //console.log(textArray);
            // Используем idCode при необходимости
            // textArray.forEach(item => {
            //     console.log(`idCode: ${item.idCode}, Code: ${item.code}`);
            // });

            const codeBlock = document.querySelector('.sample');
            if (!codeBlock) return Promise.reject('Code block element not found');

            codeBlock.innerHTML = ''; // Очистка предыдущего вывода

            if (textArray.length === 1) {
                // Если одна строка, выводим её как один блок с подсветкой
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.className = textArray[0].highlightName;
                code.textContent = textArray[0].code;

                pre.appendChild(code);
                codeBlock.appendChild(pre);

                hljs.highlightBlock(code);
            } else {
                // Если несколько строк, выводим каждую отдельно
                textArray.forEach(item => {
                    const div = document.createElement('div');
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    code.className = item.highlightName;
                    code.textContent = item.code;

                    pre.appendChild(code);
                    div.appendChild(pre);
                    codeBlock.appendChild(div);

                    hljs.highlightBlock(code);
                });
            }

            return Promise.resolve();
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(error);
        });
}

function displayCodeSample(index) {
    const codeBlock = document.querySelector('.sample');
    const item = textArray[index];
    if (!item) return;

    codeBlock.innerHTML = '';
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = item.highlightName;
    code.textContent = item.code;

    pre.appendChild(code);
    codeBlock.appendChild(pre);

    hljs.highlightBlock(code);
}

function handleInput(event) {
    if (!appState.timeStart) {
        appState.timeStart = new Date();
    }

    const currentText = textArray[appState.currentArrayIndex].code.replace(/\s+/g, '');
    const userInput = event.target.value.replace(/\s+/g, '');

    const inputElement = event.target;

    inputElement.classList.remove('error', 'blink');

    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        //console.log(`Current Text: "${currentText}" | User Input: "${userInput}"`);
        if (userInput === currentText) {
            appState.userNumberOfCharacters += event.target.value.length;
            event.target.value = '';

            if (appState.currentArrayIndex < textArray.length - 1) {
                appState.currentArrayIndex++;
                displayCodeSample(appState.currentArrayIndex);
            } else {
                endSession();
            }
        } else {
            //console.log("Incorrect input. Please try again.");
            inputElement.classList.add('error');
            inputElement.classList.add('blink');
        }
    }
}

function setupInputHandler() {
    const input = document.getElementById('input');
    input.style.display = 'block';

    displayCodeSample(appState.currentArrayIndex);

    // Убираем предыдущий обработчик, если он был установлен ранее
    input.removeEventListener('keydown', handleInput);
    input.addEventListener('keydown', handleInput);
}

function endSession() {
    const timeEnd = new Date();
    //console.log(`timeStart endSession ${appState.timeStart}`);
    if (!appState.timeStart) {
        console.error("Ошибка: timeStart не был установлен.");
        return;
    }

    const elapsed_time = (timeEnd - appState.timeStart) / 1000;
    const speed = appState.userNumberOfCharacters / (elapsed_time / 60);

    document.getElementById('time').textContent = `Время: ${elapsed_time.toFixed(1)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(2)} симв в мин`;
    document.getElementById('time').style.display = 'block';
    document.getElementById('speed').style.display = 'block';

    document.querySelector('.sample').style.display = 'none';
    document.getElementById('input').style.display = 'none';
    document.getElementById('again').style.display = 'block';
    document.getElementById('back-to-menu').style.display = 'block';

    saveSessionData(appState.timeStart, username, elapsed_time, speed, appState.userNumberOfCharacters);
}

window.addEventListener('load', function () {
    function resetApp(fullReset = false) {
        document.getElementById('time').style.display = 'none';
        document.getElementById('speed').style.display = 'none';
        document.getElementById('again').style.display = 'none';
        document.getElementById('back-to-menu').style.display = 'none';
        document.getElementById('input').value = '';
        document.querySelector('.sample').style.display = 'block';

        // Лог для сброса состояния
        //console.log("Resetting app state");

        // Сброс значений в объекте состояния
        appState.currentArrayIndex = 0;
        appState.timeStart = null;
        appState.userNumberOfCharacters = 0;

        const input = document.getElementById('input');
        input.removeEventListener('keydown', handleInput); // Удаляем все обработчики

        if (fullReset) {
            document.querySelector('.processing').style.display = 'none';
            document.querySelector('.preparation').style.display = 'block';
            document.getElementById('ready').style.display = 'block';
            textArray = [];
            selectedDictionaryName = '';
            numberOfCodes = undefined;

        } else {
            setupInputHandler();
        }
    }

    getDictionaryInfo();

    document.getElementById('ready').addEventListener('click', function () {
        selectedDictionaryName = document.getElementById('prog-lang').value;
        const selectedNumberOfCodes = 3;// Выбор запрашиваемого количества сниппетов

        document.querySelector('.processing').style.display = 'block';
        document.querySelector('.preparation').style.display = 'none';
        document.getElementById('ready').style.display = 'none';

        getCodeBlock(selectedDictionaryName, selectedNumberOfCodes).then(() => {
            const inputContainer = document.getElementById('input-container');

            if (textArray.length > 1) {
                const inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.id = 'input';
                inputContainer.appendChild(inputElement);
            } else {
                const textareaElement = document.createElement('textarea');
                textareaElement.id = 'input';
                inputContainer.appendChild(textareaElement);
            }
            setupInputHandler();
        });
    });

    document.getElementById('again').addEventListener('click', function () {
        resetApp(false);
    });

    document.getElementById('back-to-menu').addEventListener('click', function () {
        resetApp(true);
        document.getElementById('input').remove();
    });
});