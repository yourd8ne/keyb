let textArray = [];
let selectedDictionaryName = '';

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
        return; // Предотвращаем вызов, если словарь не выбран
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

        // Заполнение массива `textArray`
        textArray = data.map(item => ({
            code: item.Code,
            highlightName: item.HighlightName
        }));

        return Promise.resolve();
    })
    .catch(error => Promise.reject(error));
}

function displayCodeSample(index) {
    //console.log(index);
    const codeBlock = document.querySelector('.sample');
    const item = textArray[index];
    console.log(`highlightName ${item.highlightName} - code ${item.code}`);
    codeBlock.innerHTML = `<pre><code class="${item.highlightName}"></code></pre>`;
    codeBlock.querySelector('code').textContent = item.code;
    hljs.highlightBlock(codeBlock.querySelector('code'));
}

function setupInputHandler() {
    const input = document.getElementById('input');
    input.style.display = 'block';
    let currentArrayIndex = 0;
    let timeStart;
    let numberOfCharacters = 0;

    displayCodeSample(currentArrayIndex);

    // Убираем предыдущий обработчик
    input.removeEventListener('keydown', handleInput);
    input.addEventListener('keydown', handleInput);

    function handleInput(event) {
        if (!timeStart) {
            timeStart = new Date();
        }

        if (textArray.length === 1) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                //console.log('big code');
                // Убираем лишние пробелы и переводим строки к единому виду
                const currentText = textArray[currentArrayIndex].code.replace(/\s/g, '');
                const userInput = input.value.replace(/\s/g, '');                
                //console.log(`Текущий фрагмент (currentText): "${currentText}", Введено (userInput): "${userInput}"`);
    
                if (userInput === currentText) {
                    numberOfCharacters += input.value.length;
                    input.value = '';
    
                    endSession(timeStart, numberOfCharacters);
                } else {
                    console.log("Неправильный ввод. Попробуйте еще раз.");
                }
            }
        }
        else if (textArray.length > 1) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                //console.log('array strings code');
                // Убираем лишние пробелы и переводим строки к единому виду
                const currentText = textArray[currentArrayIndex].code.replace(/\s+/g, '');
                const userInput = input.value.replace(/\s+/g, '');

                //console.log(`Текущий фрагмент (currentText): "${currentText}", Введено (userInput): "${userInput}"`);
    
                if (userInput === currentText) {
                    numberOfCharacters += input.value.length;
                    input.value = '';
    
                    if (currentArrayIndex < textArray.length - 1) {
                        currentArrayIndex++;
                        displayCodeSample(currentArrayIndex);
                    } else {
                        endSession(timeStart, numberOfCharacters);
                    }
                } else {
                    console.log("Неправильный ввод. Попробуйте еще раз.");
                }
            }
        }
        else {
            console.log('Error with textArray.lenght');
        }
    }
}

// Функция завершения сессии
function endSession(timeStart, numberOfCharacters) {
    const timeEnd = new Date();
    const elapsed_time = (timeEnd - timeStart) / 1000;
    const speed = numberOfCharacters / (elapsed_time / 60);

    document.getElementById('time').textContent = `Время: ${elapsed_time.toFixed(1)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(2)} симв в мин`;
    document.getElementById('time').style.display = 'block';
    document.getElementById('speed').style.display = 'block';

    document.querySelector('.sample').style.display = 'none';
    document.getElementById('input').style.display = 'none';
    document.getElementById('again').style.display = 'block';
    document.getElementById('back-to-menu').style.display = 'block';

    console.log(elapsed_time, speed, username);
    saveSessionData(timeStart, username, elapsed_time, speed, numberOfCharacters);
}

window.addEventListener('load', function () {
    function resetApp(fullReset = false) {
        document.getElementById('time').style.display = 'none';
        document.getElementById('speed').style.display = 'none';
        document.getElementById('again').style.display = 'none';
        document.getElementById('back-to-menu').style.display = 'none';
        document.getElementById('input').value = '';
        document.querySelector('.sample').innerHTML = '';

        if (fullReset) {
            document.querySelector('.processing').style.display = 'none';
            document.querySelector('.preparation').style.display = 'block';
            document.getElementById('ready').style.display = 'block';
        } else {
            selectedDictionaryName = document.getElementById('prog-lang').value;
            getCodeBlock(selectedDictionaryName).then(() => {
                setupInputHandler();
            });
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