let textArray = [];
let selectedDictionaryName = '';

const appState = {
    timeStart: null,
    numberOfCharacters: 0,
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

function saveSessionData(fullAttemptTime, username, timeSpent, speed, numberOfCharacters) {
    if (!selectedDictionaryName) {
        console.error('Ошибка: не выбран словарь перед сохранением.');
        return;
    }

    let attemptTime = formatDateToMySQL(fullAttemptTime);
    console.log(attemptTime, timeSpent, username, speed, fullAttemptTime, numberOfCharacters);
    const data = {
        attemptTime: attemptTime,
        username: username,
        selectedDict: selectedDictionaryName,
        timeSpent: timeSpent,
        speed: speed,
        numberOfCharacters: numberOfCharacters
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

function getLanguage() {
    fetch('controllers/CodeController.php?action=getLanguages', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('prog-lang');
        
        select.innerHTML = ''; 
        data.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.text = language;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCodeBlock(selectDictionaryName) {
    if (!selectDictionaryName) return Promise.reject('No dictionary selected');

    return fetch('controllers/CodeController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dictionaryName: selectDictionaryName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) return Promise.reject(data.error);

        const codeBlock = document.querySelector('.sample');
        codeBlock.innerHTML = '';

        textArray = data.map(item => ({
            code: item.Code,
            highlightName: item.HighlightName
        }));

        return Promise.resolve();
    })
    .catch(error => Promise.reject(error));
}

function displayCodeSample(index) {
    const codeBlock = document.querySelector('.sample');
    const item = textArray[index];
    console.log(`highlightName ${item.highlightName} - code ${item.code}`);
    codeBlock.innerHTML = `<pre><code class="${item.highlightName}"></code></pre>`;
    codeBlock.querySelector('code').textContent = item.code;
    hljs.highlightBlock(codeBlock.querySelector('code'));
}

function highlightErrors(correctText, userInput) {
    let highlightedText = '';
    for (let i = 0; i < correctText.length; i++) {
        if (userInput[i] === correctText[i]) {
            highlightedText += correctText[i]; // Правильный символ остается без изменений
        } else {
            highlightedText += `<span class="error">${correctText[i] || ' '}</span>`; // Подсвечиваем ошибочный символ или отсутствующий символ как пробел
        }
    }
    document.getElementById('highlight').innerHTML = highlightedText;
}

// Очистка блока подсветки ошибок
function clearHighlight() {
    document.getElementById('highlight').style.display = 'none';
    document.getElementById('highlight').innerHTML = '';
}

// Обновление подсветки
function updateHighlight() {
    const userInput = document.getElementById('input').value;
    const currentText = textArray[appState.currentArrayIndex].code;
    highlightErrors(currentText, userInput);
}

// Обработчик ввода
function handleInput(event) {
    if (!appState.timeStart) {
        appState.timeStart = new Date();
    }

    const currentText = textArray[appState.currentArrayIndex].code;
    const userInput = event.target.value;

    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        
        if (userInput.replace(/\s+/g, '') === currentText.replace(/\s+/g, '')) {
            appState.numberOfCharacters += userInput.length;
            event.target.value = '';
            clearHighlight();

            if (appState.currentArrayIndex < textArray.length - 1) {
                appState.currentArrayIndex++;
                displayCodeSample(appState.currentArrayIndex);
            } else {
                endSession();
            }
        } else {
            // Показать блок с подсветкой ошибок
            document.getElementById('highlight').style.display = 'block';
            highlightErrors(currentText, userInput);
        }
    } else {
        // Скрыть блок с ошибками при начале нового ввода
        clearHighlight();
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
    console.log(`timeStart endSession ${appState.timeStart}`);
    if (!appState.timeStart) {
        console.error("Ошибка: timeStart не был установлен.");
        return;
    }

    const elapsed_time = (timeEnd - appState.timeStart) / 1000;
    const speed = appState.numberOfCharacters / (elapsed_time / 60);

    document.getElementById('time').textContent = `Время: ${elapsed_time.toFixed(1)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(2)} симв в мин`;
    document.getElementById('time').style.display = 'block';
    document.getElementById('speed').style.display = 'block';

    document.querySelector('.sample').style.display = 'none';
    document.getElementById('input').style.display = 'none';
    document.getElementById('again').style.display = 'block';
    document.getElementById('back-to-menu').style.display = 'block';

    saveSessionData(appState.timeStart, username, elapsed_time, speed, appState.numberOfCharacters);
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
        console.log("Resetting app state");
    
        // Сброс значений в объекте состояния
        appState.currentArrayIndex = 0;
        appState.timeStart = null;
        appState.numberOfCharacters = 0;
    
        const input = document.getElementById('input');
        input.removeEventListener('keydown', handleInput); // Удаляем все обработчики
    
        if (fullReset) {
            document.querySelector('.processing').style.display = 'none';
            document.querySelector('.preparation').style.display = 'block';
            document.getElementById('ready').style.display = 'block';
        } else { 
            setupInputHandler();
        }
    }
    
     
    
    getLanguage();

    document.getElementById('ready').addEventListener('click', function () {
        selectedDictionaryName = document.getElementById('prog-lang').value;

        document.querySelector('.processing').style.display = 'block';
        document.querySelector('.preparation').style.display = 'none';
        document.getElementById('ready').style.display = 'none';

        getCodeBlock(selectedDictionaryName).then(() => {
            setupInputHandler();
        });
    });

    document.getElementById('again').addEventListener('click', function () {
        resetApp(false);
    });

    document.getElementById('back-to-menu').addEventListener('click', function () {
        resetApp(true);
    });
});