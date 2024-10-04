let textArray = [];
let selectLang = '';

function getCodeBlock(selectDictionaryName) {
    return fetch('controllers/CodeController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dictionaryName: selectDictionaryName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            return Promise.reject(data.error);
        } else if (data) {
            const codeBlock = document.querySelector('.sample');
            textArray = []; // очищаем textArray
            selectLang = '';
            selectLang = data.HighliteName;
            const lines = data.Code.split('\n');
            lines.forEach(line => {
                textArray.push(line.trim());
            });
            
            // Обновляем блок кода
            codeBlock.innerHTML = `<pre><code class="language-${selectLang}">${textArray[0]}</code></pre>`;

            // Инициализация Highlight.js
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });

            document.querySelector('.processing').style.display = 'block';
            document.querySelector('.preparation').style.display = 'none';
            document.getElementById('ready').style.display = 'none';

            return Promise.resolve(); // Вернуть успешное завершение
        } else {
            console.log('Error: Invalid data format', data);
            return Promise.reject('Invalid data format');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return Promise.reject(error);
    });
}

function formatDateToMySQL(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function saveSessionData(fullAttemptTime, username, selectLang, timeSpent, speed) {
    let attemptTime = formatDateToMySQL(fullAttemptTime);
    const data = {
        attemptTime: attemptTime,
        username: username,
        selectLang: selectLang,
        timeSpent: timeSpent,
        speed: speed
    };
    fetch('controllers/SessionController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
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


function getAttempts() {
    fetch('controllers/CodeController.php?action=getAttempts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // const select = document.getElementById('prog-lang');
        // data.forEach(language => {
        //     const option = document.createElement('option');
        //     option.value = language.name;
        //     option.text = language.name;
        //     select.appendChild(option);
        // });
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

window.addEventListener('load', function () {
    function resetApp(fullReset = false) {
        // Скрываем блоки результатов
        document.getElementById('time').style.display = 'none';
        document.getElementById('speed').style.display = 'none';
        document.getElementById('again').style.display = 'none';
        document.getElementById('back-to-menu').style.display = 'none';

        // Сбрасываем ввод
        const input = document.getElementById('input');
        input.value = '';
        document.querySelector('.sample').innerHTML = '';

        // Если это полный сброс (для возврата в меню)
        if (fullReset) {
            document.querySelector('.processing').style.display = 'none';
            document.querySelector('.preparation').style.display = 'block';
            document.getElementById('ready').style.display = 'block';
        } else {
            // Получаем новый текст и восстанавливаем обработчики для кнопки "Again"
            const newLang = document.getElementById('prog-lang').value;
            getCodeBlock(newLang).then(() => {
                setupInputHandler(); // Восстанавливаем обработчики ввода
            });
        }
    }

    getLanguage();

    function setupInputHandler() {
        const input = document.getElementById('input');
        const sample = document.querySelector('.sample');
        input.style.display = 'block';
        sample.style.display = 'block';
        
        let currentIndex = 0;
        let time_start;
        let count = 0;

        // Удаляем старый обработчик, если есть, и добавляем новый
        input.removeEventListener('keydown', handleInput);
        input.addEventListener('keydown', handleInput);

        function handleInput(event) {
            if (!time_start) {
                time_start = new Date();
            }

            if (event.key === 'Enter') {
                event.preventDefault();

                if (input.value.trim() === textArray[currentIndex].trim()) {
                    count += input.value.length;
                    if (currentIndex < textArray.length - 1) {
                        currentIndex++;
                        // Обновление блока кода с подсветкой синтаксиса
                        sample.innerHTML = `<pre><code class="language-${selectLang}">${textArray[currentIndex]}</code></pre>`;
                        hljs.highlightBlock(sample.querySelector('code'));
                    } else {
                        const time_end = new Date();
                        const elapsed_time = (time_end - time_start) / 1000;
                        const input_speed = count / (elapsed_time / 60);

                        sample.style.display = 'none';
                        input.style.display = 'none';
                        document.getElementById('time').style.display = 'block';
                        document.getElementById('speed').style.display = 'block';
                        document.getElementById('time').textContent = 'Время: ' + elapsed_time.toFixed(1) + ' с';
                        document.getElementById('speed').textContent = 'Скорость: ' + input_speed.toFixed(2) + ' симв в мин';

                        // Сохранение данных сессии
                        saveSessionData(time_start, username, selectLang, elapsed_time, input_speed);

                        // Показ кнопок "Again" и "Back to Menu"
                        document.getElementById('again').style.display = 'block';
                        document.getElementById('back-to-menu').style.display = 'block';
                    }
                }
                input.value = '';
            }
        }
    }

    // Обработчик для кнопки "Ready"
    document.getElementById('ready').addEventListener('click', function () {
        document.querySelector('.processing').style.display = 'block';
        document.querySelector('.preparation').style.display = 'none';
        document.getElementById('ready').style.display = 'none';

        // Скрываем и показываем нужные элементы
        document.getElementById('time').style.display = 'none';
        document.getElementById('speed').style.display = 'none';
        document.querySelector('.sample').style.display = 'block';
        document.getElementById('input').style.display = 'block';

        // Получение языка программирования и кода
        const selectDictionaryName = document.getElementById('prog-lang').value;
        getCodeBlock(selectDictionaryName).then(() => {
            setupInputHandler(); // Восстанавливаем обработчики ввода
        });
    });

    // Обработчик для кнопки "Again"
    document.getElementById('again').addEventListener('click', function () {
        resetApp(false); // Перезапуск без полного сброса
    });

    // Обработчик для кнопки возврата в меню
    document.getElementById('back-to-menu').addEventListener('click', function () {
        resetApp(true); // Полный сброс для возврата в меню
    });
});