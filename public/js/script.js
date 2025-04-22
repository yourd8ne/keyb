// State management
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
let numberOfCodes;

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
    inputContainer.innerHTML = ''; // Очищаем контейнер

    if (textArray.length > 1) {
        // Если несколько строк кода, используем input
        const inputElement = document.createElement('input');
        inputElement.id = 'input';
        inputElement.type = 'text';
        inputContainer.appendChild(inputElement);

        // Сохраняем ссылку на input в глобальное состояние
        appState.editor = inputElement;

        // Устанавливаем фокус на input
        inputElement.focus();

        // Отображаем первую строку кода
        displayCodeSample(appState.currentArrayIndex);
    } else if (textArray.length === 1) {
        // Если один большой блок кода, используем textarea
        const textareaElement = document.createElement('textarea');
        textareaElement.id = 'input';
        textareaElement.style.resize = 'none'; // Запрещаем изменение размера
        textareaElement.style.height = `${document.querySelector('.sample').offsetHeight - 2}px`; // Высота равна высоте блока кода
        inputContainer.appendChild(textareaElement);

        // Сохраняем ссылку на textarea в глобальное состояние
        appState.editor = textareaElement;

        // Устанавливаем фокус на textarea
        textareaElement.focus();

        // Отображаем весь код
        displayCodeSample(0);
    }
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

const getNumberOfCodes = async () => {
    try {
        const data = await fetchData('controllers/CodeController.php?action=getNumberOfCodes');
        numberOfCodes = data.NumberOfCodes;
    } catch (error) {
        console.error('Error fetching number of codes:', error);
    }
};

const getCodeBlock = async (dictionaryName, numCodes) => {
    if (!dictionaryName || !numCodes) throw new Error('No dictionary selected or number of codes not provided');

    const data = await fetchData(`controllers/CodeController.php?action=getCodes&dictionaryName=${encodeURIComponent(dictionaryName)}&numberOfCodes=${numCodes}`);
    textArray = data.map(item => ({
        idCode: item.idCode,
        code: item.Code,
        highlightName: item.HighlightName
    }));

    const codeBlock = document.querySelector('.sample');
    if (!codeBlock) throw new Error('Code block element not found');
    codeBlock.style.display = 'block';
    appState.numberOfChars = textArray.reduce((total, item) => total + item.code.length, 0);
    codeBlock.innerHTML = '';

    textArray.forEach(item => {
        const pre = createElement('pre', {}, { margin: '0' });
        const code = createElement('code', { className: item.highlightName, textContent: item.code }, { display: 'block' });
        pre.appendChild(code);
        codeBlock.appendChild(pre);
        hljs.highlightBlock(code);
    });
};

// UI functions
const displayCodeSample = (index) => {
    const codeBlock = document.querySelector('.sample');
    const item = textArray[index];
    if (!item) return;

    codeBlock.innerHTML = ''; // Очищаем блок
    const pre = createElement('pre');
    const code = createElement('code', { className: item.highlightName, textContent: item.code });
    pre.appendChild(code);
    codeBlock.appendChild(pre);
    hljs.highlightBlock(code); // Подсвечиваем код
};

const setupInputHandler = () => {
    const editor = appState.editor;
    editor.addEventListener('keydown', handleInput); // Добавляем обработчик событий
    editor.focus(); // Устанавливаем фокус на поле ввода
};

const handleInput = (event) => {
    if (!appState.timeStart) appState.timeStart = new Date();

    const currentText = textArray[appState.currentArrayIndex].code.trim(); // Текущая строка кода
    const userInput = appState.editor.value.trim(); // Ввод пользователя

    const isTextarea = appState.editor.tagName.toLowerCase() === 'textarea';

    // Условие для проверки ввода
    if ((isTextarea && event.key === 'Enter' && event.shiftKey) || (!isTextarea && event.key === 'Enter')) {
        event.preventDefault(); // Предотвращаем стандартное поведение Enter

        if (userInput === currentText) {
            appState.userNumberOfCharacters += userInput.length;
            appState.editor.value = ''; // Очищаем поле ввода

            if (appState.currentArrayIndex < textArray.length - 1) {
                appState.currentArrayIndex++;
                displayCodeSample(appState.currentArrayIndex); // Отображаем следующую строку
            } else {
                endSession(); // Завершаем попытку
            }
        } else {
            appState.editor.classList.add('error'); // Подсвечиваем ошибку
            setTimeout(() => appState.editor.classList.remove('error'), 1000); // Убираем подсветку через 1 секунду
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
    document.getElementById('time').textContent = `Время: ${elapsedTime.toFixed(1)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(2)} симв в мин`;
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
    await getNumberOfCodes();
    await getDictionaryInfo();
    document.getElementById('ready').addEventListener('click', async () => {
        selectedDictionaryName = document.getElementById('prog-lang').value;

        if (!selectedDictionaryName) {
            alert('Пожалуйста, выберите словарь!');
            return;
        }

        setAppStateClass('processing'); // Устанавливаем состояние обработки

        await getCodeBlock(selectedDictionaryName, numberOfCodes);
        createInputField(); // Создаём поле ввода
        setupInputHandler(); // Настраиваем обработчик ввода
    });

    document.getElementById('again').addEventListener('click', async () => {
        appState.reset(false);
        setAppStateClass('processing');

        await getCodeBlock(selectedDictionaryName, numberOfCodes);
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