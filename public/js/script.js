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

const createMultiLineEditor = (container, mode, lineCount) => {
    const editor = CodeMirror(container, {
        lineNumbers: true,
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
    
    editor.setSize(null, 28);
    editor.getWrapperElement().style.overflow = 'hidden';
    
    return editor;
};

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
        // console.log(userInput, currentText);
        // console.log(distance, appState.totalErrors, appState.userNumberOfCharacters, appState.correctChars);
        editor.getWrapperElement().classList.add('cm-error');
        setTimeout(() => {
            editor.getWrapperElement().classList.remove('cm-error');
        }, 1000);
    }
};

// const normalizeWhitespace = (str) => {
//     return str
//         .replace(/\t/g, '    ')
//         .trim()
//         .replace(/\s+/g, ' ');
// };

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
    
    const mode = item.highlightName === 'python' ? 'python' : 'text/x-c++src';
    const isSingleLineMode = textArray.length > 1;
    const lineCount = isSingleLineMode ? 1 : item.code.split('\n').length;

    const sampleEditor = CodeMirror(codeBlock, {
        value: item.code,
        lineNumbers: !isSingleLineMode,
        theme: 'eclipse',
        mode: mode,
        readOnly: 'nocursor',
        viewportMargin: Infinity,
        lineWrapping: false
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

    return matrix[b.length][a.length];
}

const endSession = () => {
    if (!appState.timeStart) {
        console.error("Error: timeStart not set.");
        return;
    }
    
    const timeEnd = new Date();
    const elapsedTime = Math.max((timeEnd - appState.timeStart) / 1000, 0.1);
    const totalCharCount = textArray.reduce((total, item) => total + item.code.length, 0);
    const speed = totalCharCount / (elapsedTime / 60);
    
    // Процент ошибок: сколько раз пользователь ошибался при отправке строки (Enter)
    // Формула: (количество неверных попыток / общее количество попыток) * 100%
    const errorRate = (appState.totalErrors / appState.totalAttempts) * 100;
    // Чистота набора: процент правильно введённых символов от общего объёма кода
    // Формула: (верно введённые символы / общее количество символов в образце) * 100%
    const cleanliness = (appState.correctChars / totalCharCount) * 100;
    // Индекс грязности: количество ошибок на 1000 символов кода
    // Умножение на 1000 даёт удобную для восприятия метрику (например, "5 ошибок на 1000 символов")
    // Формула: (общее количество ошибок / общее количество символов) * 1000
    const dirtinessIndex = (appState.totalErrors / appState.userNumberOfCharacters) * 1000;
    
    document.getElementById('numberOfCodes').textContent = `Количество кодов: ${textArray.length}`;
    document.getElementById('numberOfChars').textContent = `Количество символов: ${appState.numberOfChars}`;
    document.getElementById('time').textContent = `Время: ${Math.trunc(elapsedTime)} с`;
    document.getElementById('speed').textContent = `Скорость: ${speed.toFixed(1)} символов в минуту`;
    document.getElementById('error-rate').textContent = `Процент ошибок: ${errorRate.toFixed(1)}%`;
    document.getElementById('cleanliness').textContent = `Чистота набора: ${cleanliness.toFixed(1)}%`;
    document.getElementById('dirtiness').textContent = `Индекс грязности: ${dirtinessIndex.toFixed(1)}`;
    // Количество нажатий Backspace: показывает, как часто пользователь исправлял ввод до проверки
    // Важно: учитываются только исправления, не приведшие к ошибке (ошибочные попытки уже учтены в errorRate)
    document.getElementById('backspaces').textContent = `Исправлений (Backspace): ${appState.backspaceCount}`;
    
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