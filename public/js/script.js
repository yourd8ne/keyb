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
            console.log(data.Code);

            const codeBlock = document.querySelector('.sample');
            textArray = []; // очищаем textArray
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
    getLanguage();
    document.getElementById('ready').addEventListener('click', function() {
        document.querySelector('.processing').style.display = 'block';
        document.querySelector('.preparation').style.display = 'none';
        document.getElementById('ready').style.display = 'none';

        var time = document.getElementById('time');
        var speed = document.getElementById('speed');

        time.style.display = 'none';
        speed.style.display = 'none';

        const selectDictionaryName = document.getElementById('prog-lang').value;
        //console.log(selectDictionaryName)
        getCodeBlock(selectDictionaryName);
        const input = document.getElementById('input');
        
        let currentIndex = 0;
        var time_start;
        var count = 0;
        const sample = document.querySelector('.sample');
        input.addEventListener('keydown', function(event) {
            if (!time_start) {
                time_start = new Date();
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                
                if (input.value.trim() === textArray[currentIndex].trim()) {
                    count = count + input.value.length;
                    if (currentIndex < textArray.length - 1) {
                        currentIndex++;
                        // Обновление блока кода с подсветкой синтаксиса
                        sample.innerHTML = `<pre><code class="language-${selectLang}">${textArray[currentIndex]}</code></pre>`;
                        hljs.highlightBlock(sample.querySelector('code'));
                    } else {
                        var time_end = new Date();
                        var elapsed_time = (time_end - time_start) / 1000;

                        var input_speed = count / (elapsed_time / 60);
                        sample.style.display = 'none';
                        input.style.display = 'none';
                        time.style.display = 'block';
                        speed.style.display = 'block';
                        time.textContent = 'Время: ' + elapsed_time.toFixed(1) + ' с';
                        speed.textContent = 'Скорость: ' + input_speed.toFixed(2) + ' симв в мин';
                        sample.innerHTML = '';

                        saveSessionData(time_start, username, selectLang, elapsed_time, input_speed);
                        
                        const again = document.getElementById('again');
                        const backToMenu = document.getElementById('back-to-menu');

                        again.style.display = 'block';
                        backToMenu.style.display = 'block'; // Показать кнопку возврата в меню

                        again.addEventListener('click', function() {
                            again.style.display = 'none';
                            backToMenu.style.display = 'none'; // Скрыть кнопку возврата в меню
                            document.querySelector('.processing').style.display = 'none';
                            document.querySelector('.preparation').style.display = 'block';
                            document.getElementById('ready').style.display = 'block';
                        
                            // Сброс значений
                            time.style.display = 'none';
                            speed.style.display = 'none';
                            currentIndex = 0;
                            count = 0;
                            time_start = null;
                        
                            // Очистка ввода
                            input.value = '';
                        
                            // Получение языка
                            const newLang = document.getElementById('prog-lang').value;
                        
                            // Вызов getCodeBlock() и ожидание загрузки текста
                            getCodeBlock(newLang).then(() => {
                                console.log('textArray after getCodeBlock:', textArray); // Логируем содержимое textArray
                        
                                // Проверка, что textArray заполнен
                                if (textArray.length > 0) {
                                    // Показ блока sample (если вдруг он был скрыт)
                                    sample.style.display = 'block';
                                    input.style.display = 'block';
                                    // Обновление отображаемого текста
                                    sample.innerHTML = `<pre><code class="language-${newLang}">${textArray[currentIndex]}</code></pre>`;
                                    hljs.highlightBlock(sample.querySelector('code'));
                                } else {
                                    console.error('textArray is empty. Check if getCodeBlock() works correctly.');
                                }
                            }).catch(error => {
                                console.error('Failed to load code block:', error);
                            });
                        });

                        // Обработчик для кнопки возврата в меню
                        backToMenu.addEventListener('click', function() {
                            document.querySelector('.processing').style.display = 'none';
                            document.querySelector('.preparation').style.display = 'block';
                            document.getElementById('ready').style.display = 'block';
                            backToMenu.style.display = 'none';
                            again.style.display = 'none';
                            time.style.display = 'none';
                            speed.style.display = 'none';
                            input.value = '';
                            sample.innerHTML = '';
                        });
                    }
                }
                input.value = '';
            }
        });
    });
});