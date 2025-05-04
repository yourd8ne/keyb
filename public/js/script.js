
const appState = {
    timeStart: null,
    userNumberOfCharacters: 0,
    currentArrayIndex: 0,
    numberOfChars: undefined,
    reset(fullReset = false) {
        this.timeStart = null;
        this.userNumberOfCharacters = 0;
        this.currentArrayIndex = 0;
        this.numberOfChars = undefined;

        if (fullReset) {
            textArray = [];
            selectedDictionaryName = '';
        }
    }
};

// Global variables
let textArray = [];
let selectedDictionaryName = '';
//let numberOfCodes;

// Utility functions
const createElement = (tag, attributes = {}, styles = {}) => {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    Object.assign(element.style, styles);
    return element;
};

const setAppStateClass = (stateClass) => {
    const preparation = document.querySelector('.preparation');
    const processing = document.querySelector('.processing');
    const output = document.querySelector('.output');
    const readyButton = document.getElementById('ready');
    const sample = document.querySelector('.sample');
    const againButton = document.getElementById('again');
    const backToMenuButton = document.getElementById('back-to-menu');

    // Сбрасываем состояния
    preparation.style.display = 'none';
    processing.style.display = 'none';
    output.style.display = 'none';
    readyButton.style.display = 'none';
    sample.setAttribute('inert', '');

    // Устанавливаем новое состояние
    if (stateClass === 'preparation') {
        preparation.style.display = 'block';
        readyButton.style.display = 'block';
    } else if (stateClass === 'processing') {
        processing.style.display = 'block';
        sample.removeAttribute('inert');
    } else if (stateClass === 'output') {
        output.style.display = 'block';
        againButton.style.display = 'block';
        backToMenuButton.style.display = 'block';
    }
};

const hideElements = (...ids) => {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
};

const showElements = (...ids) => {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'block';
    });
};

// Function to auto-expand the input field
const autoExpandInput = (inputElement) => {
    inputElement.style.height = 'auto'; // Сбрасываем высоту
    inputElement.style.height = `${inputElement.scrollHeight}px`; // Устанавливаем высоту на основе содержимого
};

const createInputField = () => {
    const inputContainer = document.getElementById('input-container');
    inputContainer.innerHTML = '';
    inputContainer.style.display = 'block';

    const mode = selectedDictionaryName === 'python' ? 'python' : 'text/x-c++src';
    
    // Safer way to get sample height
    let sampleHeight = 300;
    const sampleEditor = document.querySelector('.sample .CodeMirror');
    if (sampleEditor && sampleEditor.CodeMirror) {
        sampleHeight = sampleEditor.CodeMirror.getWrapperElement().offsetHeight;
    } else if (sampleEditor) {
        // Fallback if CodeMirror instance isn't directly available
        sampleHeight = sampleEditor.offsetHeight;
    }

    appState.editor = CodeMirror(inputContainer, {
        lineNumbers: true,
        theme: 'eclipse',
        mode: mode,
        autofocus: true,
        extraKeys: {
            "Enter": (cm) => handleInput(cm, {key: 'Enter'}) // Модифицируем обработчик Enter
        },
        viewportMargin: Infinity
    });

    // Устанавливаем высоту как у примера кода
    appState.editor.setSize(null, sampleHeight);
};

const displayCodeSample = (index) => {
    const codeBlock = document.querySelector('.sample');
    const item = textArray[index];
    if (!item) return;

    codeBlock.innerHTML = '';
    
    const mode = item.highlightName === 'python' ? 'python' : 'text/x-c++src';

    const sampleEditor = CodeMirror(codeBlock, {
        value: item.code,
        lineNumbers: true,
        theme: 'eclipse',
        mode: mode,
        readOnly: 'nocursor',
        viewportMargin: Infinity
    });

    // Возвращаем высоту редактора для использования в createInputField
    return sampleEditor.getWrapperElement().offsetHeight;
};

// API functions
const fetchData = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const getDictionaryInfo = async () => {
    try {
        const data = await fetchData('controllers/CodeController.php?action=getDictionariesInfo');
        const select = document.getElementById('prog-lang');
        if (!select) throw new Error('Element with id "prog-lang" not found');

        select.innerHTML = '';
        data.forEach(language => {
            const option = createElement('option', { value: language.Name, text: language.Name });
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching dictionary info:', error);
    }
};


const getCodeBlock = async (dictionaryName) => {
    if (!dictionaryName) throw new Error('No dictionary selected');
    const data = await fetchData(`controllers/CodeController.php?action=getCodes&dictionaryName=${encodeURIComponent(dictionaryName)}`);
    
    textArray = data.map(item => ({
        idCode: item.idCode,
        code: item.Code,
        highlightName: item.highlightName || (dictionaryName === 'python' ? 'python' : 'cpp')
    }));

    const codeBlock = document.querySelector('.sample');
    codeBlock.style.display = 'block';
    appState.numberOfChars = textArray.reduce((total, item) => total + item.code.length, 0);
    codeBlock.innerHTML = '';

    // Если один элемент - показываем весь код
    if (textArray.length === 1) {
        displayCodeSample(0);
    } 
    // Если несколько элементов - показываем первый
    else if (textArray.length > 1) {
        displayCodeSample(0);
    }
};

const setupInputHandler = () => {
    const editor = appState.editor;
    if (!editor) {
        console.error('Ошибка: editor не инициализирован.');
        return;
    }
    // Заменяем addEventListener на правильный метод CodeMirror
    editor.on('keydown', handleInput); // Используем CodeMirror's event system
    editor.focus(); // Устанавливаем фокус на поле ввода
};

const handleInput = (editor, event) => {
    // Проверяем, была ли нажата клавиша Enter
    if (event.keyCode === 13 || event.key === 'Enter') {
        if (!appState.timeStart) appState.timeStart = new Date();
        
        const currentItem = textArray[appState.currentArrayIndex];
        const currentText = currentItem.code.trim();
        const userInput = editor.getValue().trim();

        if (userInput === currentText) {
            appState.userNumberOfCharacters += userInput.length;
            editor.setValue('');

            // Если несколько элементов и не последний - показываем следующий
            if (textArray.length > 1 && appState.currentArrayIndex < textArray.length - 1) {
                appState.currentArrayIndex++;
                displayCodeSample(appState.currentArrayIndex);
                // Обновляем высоту поля ввода
                const sampleHeight = document.querySelector('.sample .CodeMirror').getWrapperElement().offsetHeight;
                editor.setSize(null, sampleHeight);
            } 
            // Если последний элемент - завершаем сессию
            else {
                endSession();
            }
        } else {
            editor.display.wrapper.classList.add('error');
            setTimeout(() => editor.display.wrapper.classList.remove('error'), 1000);
        }
    }
};

const endSession = () => {
    const timeEnd = new Date();
    if (!appState.timeStart) {
        console.error("Ошибка: timeStart не был установлен.");
        return;
    }
    // Рассчитываем статистику
    const elapsedTime = (timeEnd - appState.timeStart) / 1000;
    const totalCharCount = textArray.reduce((total, item) => total + item.code.length, 0);
    const speed = totalCharCount / (elapsedTime / 60);
    const numberOfLines = textArray.length === 1
    ? textArray[0].code.split('\n').length // Если один блок, считаем строки
    : textArray.length; // Если несколько блоков, считаем их количество
    // Отображаем статистику
    document.getElementById('numberOfCodes').textContent = `Количество кодов: ${numberOfLines}`;
    document.getElementById('numberOfChars').textContent = `Количество символов из словаря: ${appState.numberOfChars}`;
    document.getElementById('time').textContent = `Время: ${Math.round(elapsedTime)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(1)} символов в минунуту`;
    // Скрываем ненужные элементы
    document.querySelector('.sample').style.display = 'none';
    document.getElementById('input').style.display = 'none';
    // Показываем блок с результатами
    setAppStateClass('output'); // Переключаемся в состояние вывода статистики
    // Сохраняем данные сессии
    saveSessionData(appState.timeStart, username, elapsedTime, speed, appState.userNumberOfCharacters, numberOfLines);
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

const saveSessionData = (fullAttemptTime, username, timeSpent, speed, userNumberOfCharacters, numberOfLines) => {
    if (!selectedDictionaryName) {
        console.error('Ошибка: не выбран словарь перед сохранением.');
        return;
    }
    const attemptTime = formatDateToMySQL(fullAttemptTime);
    const codeIds = textArray.map(item => item.idCode);
    const data = {
        attemptTime: attemptTime,
        username: username,
        selectedDict: selectedDictionaryName,
        timeSpent: timeSpent,
        speed: speed,
        userNumberOfCharacters: userNumberOfCharacters,
        userNumberOfSnippets: numberOfLines,
        idCodes: codeIds // Передаем массив ID кодов
    };
    fetch('controllers/SessionController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(error => {
        console.error('Error:', error);
        console.log('Server returned:', error.responseText);
    });
};

const resetApp = (fullReset = false) => {
    if (fullReset) {
        // Возвращаемся в состояние подготовки
        setAppStateClass('preparation');
        const input = document.getElementById('input');
        if (input) {
            input.value = '';
            input.removeEventListener('keydown', handleInput);
        }
        appState.reset(fullReset);
        // Очищаем контейнеры
        document.getElementById('input-container').innerHTML = '';
        document.querySelector('.sample').innerHTML = '';
    } else {
        // Возвращаемся в состояние обработки
        setAppStateClass('processing');
        setupInputHandler();
    }
};

// Event listeners
window.addEventListener('load', async () => {
    //await getNumberOfCodes();
    await getDictionaryInfo();
    document.getElementById('ready').addEventListener('click', async () => {
        selectedDictionaryName = document.getElementById('prog-lang').value;

        if (!selectedDictionaryName) {
            alert('Пожалуйста, выберите словарь!');
            return;
        }

        setAppStateClass('processing'); // Устанавливаем состояние обработки

        await getCodeBlock(selectedDictionaryName);
        createInputField(); // Создаём поле ввода
        setupInputHandler(); // Настраиваем обработчик ввода
    });

    document.getElementById('again').addEventListener('click', async () => {
        appState.reset(false);
        setAppStateClass('processing');

        await getCodeBlock(selectedDictionaryName);
        createInputField(); // Создаём поле ввода
        setupInputHandler(); // Настраиваем обработчик ввода
    });

    document.getElementById('back-to-menu').addEventListener('click', () => {
        // Полный сброс приложения
        resetApp(true);
        // Сбрасываем контейнеры для ввода и примеров кода
        document.getElementById('input-container').innerHTML = '';
        document.querySelector('.sample').innerHTML = '';
    });
});