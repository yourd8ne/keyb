const appState = {
    timeStart: null,
    userNumberOfCharacters: 0,
    currentArrayIndex: 0,
    numberOfChars: undefined,
    
    totalAttemptErrors: 0,
    totalErrors: 0,
    totalAttempts: 0,
    correctChars: 0,
    backspaceCount: 0,
    
    reset(fullReset = false) {
        this.timeStart = null;
        this.userNumberOfCharacters = 0;
        this.currentArrayIndex = 0;
        this.numberOfChars = undefined;
        
        this.totalAttemptErrors = 0;
        this.totalErrors = 0;
        this.totalAttempts = 0;
        this.correctChars = 0;
        this.backspaceCount = 0;

        if (fullReset) {
            textArray = [];
            selectedDictionaryName = '';
        }
    }
};

let textArray = [];
let selectedDictionaryName = '';

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

    const mainHeader = document.getElementById('main-header');

    preparation.style.display = 'none';
    processing.style.display = 'none';
    output.style.display = 'none';
    readyButton.style.display = 'none';
    sample.setAttribute('inert', '');

    if (stateClass === 'preparation') {
        mainHeader.textContent = 'Практика набора кода';
        preparation.style.display = 'block';
        readyButton.style.display = 'block';
    } else if (stateClass === 'processing') {
        mainHeader.style.display = 'none';
        processing.style.display = 'block';
        sample.removeAttribute('inert');
    } else if (stateClass === 'output') {
        mainHeader.textContent = 'Результаты попытки';
        mainHeader.style.display = 'block';
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

function addHintToEditor(editor, hintText, isMultiLine = false) {
    // Устанавливаем атрибут с подсказкой для первой строки
    const setHint = () => {
        const lineElement = editor.getLineHandle(0).lineDiv;
        lineElement.firstChild.setAttribute('data-hint', hintText);
    };

    // Обновляем состояние подсказки
    const updateHint = () => {
        if (editor.getValue() === '') {
            setHint();
        }
    };

    // Обработчики событий
    editor.on('change', updateHint);
    editor.on('focus', updateHint);
    editor.on('blur', updateHint);

    // Инициализация
    updateHint();
}

const createMultiLineEditor = (container, mode, lineCount) => {
    
    const editor = CodeMirror(container, {
        lineNumbers: false,
        theme: 'eclipse',
        mode: mode,
        autofocus: true,
        extraKeys: {
            "Shift-Enter": (cm) => checkInput(cm),
            "Ctrl-Enter": (cm) => checkInput(cm)
        },
        viewportMargin: Infinity,
        lineWrapping: false,
        readOnly: false,
        indentUnit: 4,
        tabSize: 4,
        electricChars: false
    });

    editor.getWrapperElement().classList.add('multiline-editor');
    addHintToEditor(editor, "Проверка кода на Shift+Enter, Ctrl+Enter", true);
    
    const lineHeight = 24;
    editor.setSize(null, lineCount * lineHeight);
    
    editor.on("beforeChange", function(cm, change) {
        const newlineCount = change.text.join("").split('\n').length - 1;
        if (newlineCount > 0) {
            change.cancel();
        }
    });
    
    return editor;
};

const createSingleLineEditor = (container, mode) => {
    const editor = CodeMirror(container, {
        lineNumbers: false,
        theme: 'eclipse',
        mode: mode,
        autofocus: true,
        extraKeys: {
            "Enter": (cm) => checkInput(cm)
        },
        viewportMargin: Infinity,
        lineWrapping: false,
        indentUnit: 4,
        indentWithTabs: true,
        tabSize: 4,
        electricChars: true
    });

    addHintToEditor(editor, "Проверка кода на Enter", false);
    
    editor.setSize(null, 28);
    editor.getWrapperElement().style.overflow = 'hidden';
    
    return editor;
};

function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // замена
                    matrix[i][j - 1] + 1,     // вставка
                    matrix[i - 1][j] + 1      // удаление
                );
            }
        }
    }

    // Учитываем разницу в длине строк как одну ошибку
    if (Math.abs(a.length - b.length) > 0) {
        return Math.min(matrix[b.length][a.length], matrix[b.length][a.length] + 1);
    }

    return matrix[b.length][a.length];
}

function countMismatchedCharacters(a, b) {
    let mismatches = 0;
    const minLength = Math.min(a.length, b.length);

    for (let i = 0; i < minLength; i++) {
        if (a[i] !== b[i]) {
            mismatches++;
        }
    }

    // Учитываем разницу в длине строк как одну ошибку
    if (Math.abs(a.length - b.length) > 0) {
        mismatches += 1;
    }

    return mismatches;
}

const checkInput = (editor) => {
    const currentItem = textArray[appState.currentArrayIndex];
    const currentText = currentItem.code;
    const userInput = editor.getValue();
    console.log(currentText);
    console.log(userInput);

    appState.totalAttempts++;

    if (userInput === currentText) {
        appState.correctChars += currentText.length;
        appState.userNumberOfCharacters += currentText.length;
        editor.setValue('');

        if (textArray.length > 1 && appState.currentArrayIndex < textArray.length - 1) {
            appState.currentArrayIndex++;
            displayCodeSample(appState.currentArrayIndex);
            setTimeout(() => {
                editor.focus();
            }, 0);
        } else {
            endSession();
        }
    } else {
        appState.totalAttemptErrors++;
        const distance = levenshteinDistance(userInput, currentText);
        appState.totalErrors += distance;
        appState.userNumberOfCharacters += userInput.length;
        appState.correctChars += currentText.length - distance;
        editor.getWrapperElement().classList.add('cm-error');
        setTimeout(() => {
            editor.getWrapperElement().classList.remove('cm-error');
        }, 1000);
    }
};

function addHintToEditor(editor, hintText) {
    const hintElement = document.createElement('div');
    hintElement.className = 'cm-hint-text';
    hintElement.textContent = hintText;
    editor.display.wrapper.appendChild(hintElement);
    
    // Обновляем видимость подсказки
    const updateHint = () => {
        hintElement.style.opacity = editor.getValue() ? '0' : '1';
    };
    
    // Инициализируем подсказку
    updateHint();
    
    // Следим за изменениями
    editor.on('change', updateHint);
    editor.on('focus', () => {
        hintElement.style.opacity = editor.getValue() ? '0' : '0.7';
    });
    editor.on('blur', updateHint);
}

const createInputField = () => {
    const inputContainer = document.getElementById('input-container');
    inputContainer.innerHTML = '';
    inputContainer.style.display = 'block';

    const mode = selectedDictionaryName === 'python' ? 'python' : 'text/x-c++src';
    const lineCount = getSampleLineCount();

    if (textArray.length === 1) {
        appState.editor = createMultiLineEditor(inputContainer, mode, lineCount);
    } else {
        appState.editor = createSingleLineEditor(inputContainer, mode);
    }
    
    const sampleEditor = document.querySelector('.sample .CodeMirror');
    if (sampleEditor && sampleEditor.CodeMirror) {
        const height = sampleEditor.CodeMirror.getWrapperElement().offsetHeight;
        appState.editor.setSize(null, height);
    }
};

const getSampleLineCount = () => {
    const sampleEditor = document.querySelector('.sample .CodeMirror');
    if (sampleEditor && sampleEditor.CodeMirror) {
        return sampleEditor.CodeMirror.lineCount();
    }
    return 1;
};

const displayCodeSample = (index) => {
    const codeBlock = document.querySelector('.sample');
    const item = textArray[index];
    if (!item) return;

    codeBlock.innerHTML = '';
    
    // Определяем режим подсветки на основе highlightName
    const modeMap = {
        'python': 'python',
        'cpp': 'text/x-c++src',
        'java': 'text/x-java',
        'kotlin': 'text/x-kotlin',
        'javascript': 'javascript',
        // добавьте другие языки по необходимости
    };
    
    const mode = modeMap[item.highlightName] || 'text/x-c++src';
    const isSingleLineMode = textArray.length > 1;
    const lineCount = isSingleLineMode ? 1 : item.code.split('\n').length;

    const sampleEditor = CodeMirror(codeBlock, {
        value: item.code,
        lineNumbers: false,
        theme: 'eclipse',
        mode: mode,
        readOnly: 'nocursor',
        viewportMargin: Infinity,
        lineWrapping: false,
    });

    sampleEditor.setSize(null, lineCount * 24);
    
    if (appState.editor) {
        appState.editor.setSize(null, lineCount * 24);
        appState.editor.refresh();
    }

    return sampleEditor;
};

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

    if (textArray.length === 1) {
        displayCodeSample(0);
    } else if (textArray.length > 1) {
        displayCodeSample(0);
    }
};

const setupInputHandler = () => {
    const editor = appState.editor;
    if (!editor) {
        console.error('Error: editor not initialized.');
        return;
    }
    
    const firstInputHandler = () => {
        if (!appState.timeStart) {
            appState.timeStart = new Date();
            editor.off('change', firstInputHandler);
        }
    };
    
    editor.on('change', firstInputHandler);
    
    // Обработчик для подсчета backspace
    editor.on('keydown', (cm, event) => {
        if (event.key === 'Backspace') {
            appState.backspaceCount++;
        }
        handleInput(cm, event);
    });
    
    editor.focus();
};

const handleInput = (editor, event) => {
    const shouldCheck = 
        (textArray.length > 1 && event.key === 'Enter') || 
        (textArray.length === 1 && (event.ctrlKey || event.shiftKey) && event.key === 'Enter');
    
    if (shouldCheck) {
        event.preventDefault();
        checkInput(editor);
    }
};

const endSession = () => {
    if (!appState.timeStart) {
        console.error("Error: timeStart not set.");
        return;
    }

    const timeEnd = new Date();
    const elapsedTime = Math.max((timeEnd - appState.timeStart) / 1000, 0.1);
    const totalCharCount = textArray.reduce((total, item) => total + item.code.length, 0);
    const speed = totalCharCount / (elapsedTime / 60);

    // Чистота набора: процент правильно введённых символов от общего объёма кода
    const cleanliness = Math.min((appState.correctChars / totalCharCount) * 100, 100);

    // Индекс грязности: количество ошибок на 1000 символов кода
    console.log(appState.totalErrors, appState.userNumberOfCharacters);
    const dirtinessIndex = (appState.totalErrors / Math.max(appState.userNumberOfCharacters, 1)) * 1000;

    // Коэффициент ошибок
    const errorCoefficient = (appState.totalErrors / Math.max(appState.userNumberOfCharacters, 1)) * 100;

    // Коэффициент исправлений
    const correctionCoefficient = (appState.backspaceCount / Math.max(appState.userNumberOfCharacters, 1)) * 100;

    document.getElementById('numberOfCodes').textContent = `Количество кодов: ${textArray.length}`;
    document.getElementById('numberOfChars').textContent = `Количество символов: ${appState.numberOfChars}`;
    document.getElementById('time').textContent = `Время: ${Math.trunc(elapsedTime)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(1)} символов в минуту`;
    document.getElementById('cleanliness').textContent = `Чистота набора: ${cleanliness.toFixed(1)}%`;
    document.getElementById('dirtiness').textContent = `Индекс грязности: ${dirtinessIndex.toFixed(1)}`;
    document.getElementById('backspaces').textContent = `Исправлений (Backspace): ${appState.backspaceCount}`;
    document.getElementById('error-coefficient').textContent = `Коэффициент ошибок: ${errorCoefficient.toFixed(1)}%`;
    document.getElementById('correction-coefficient').textContent = `Коэффициент исправлений: ${correctionCoefficient.toFixed(1)}%`;

    document.querySelector('.sample').style.display = 'none';
    document.getElementById('input-container').style.display = 'none';

    setAppStateClass('output');

    saveSessionData(
        appState.timeStart,
        username,
        elapsedTime,
        speed,
        appState.userNumberOfCharacters,
        textArray.length,
        dirtinessIndex,
        appState.backspaceCount
    );
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

const saveSessionData = (
    fullAttemptTime, 
    username, 
    timeSpent, 
    speed, 
    userNumberOfCharacters, 
    numberOfLines,
    dirtinessIndex,
    backspaceCount
) => {
    if (!selectedDictionaryName) {
        console.error('Error: dictionary not selected before saving.');
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
        idCodes: codeIds,
        dirtinessIndex: dirtinessIndex,
        backspaceCount: backspaceCount
    };
    
    fetch('controllers/SessionController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(error => {
        console.error('Error:', error);
    });
};

const resetApp = (fullReset = false) => {
    if (fullReset) {
        setAppStateClass('preparation');
        const input = document.getElementById('input');
        if (input) {
            input.value = '';
            input.removeEventListener('keydown', handleInput);
        }
        appState.reset(fullReset);
        document.getElementById('input-container').innerHTML = '';
        document.querySelector('.sample').innerHTML = '';
    } else {
        setAppStateClass('processing');
        setupInputHandler();
    }
};

// Event listeners
window.addEventListener('load', async () => {
    await getDictionaryInfo();
    setAppStateClass('preparation');
    document.getElementById('ready').addEventListener('click', async () => {
        selectedDictionaryName = document.getElementById('prog-lang').value;

        if (!selectedDictionaryName) {
            alert('Пожалуйста, выберите словарь!');
            return;
        }

        setAppStateClass('processing');
        await getCodeBlock(selectedDictionaryName);
        createInputField();
        setupInputHandler();
    });

    document.getElementById('again').addEventListener('click', async () => {
        appState.reset(false);
        setAppStateClass('processing');
        await getCodeBlock(selectedDictionaryName);
        createInputField();
        setupInputHandler();
    });

    document.getElementById('back-to-menu').addEventListener('click', () => {
        resetApp(true);
        document.getElementById('input-container').innerHTML = '';
        document.querySelector('.sample').innerHTML = '';
    });
});