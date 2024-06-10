let textArray = [];

function getCodeBlock(selectLang) {
    fetch('controllers/CodeController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language: selectLang }),
    })
    .then(response => response.json())
    .then(data => {
        if(data && data.text) {
            const codeBlock = document.querySelector('.sample');
            textArray = [];

            const lines = data.text.split('\n');
            lines.forEach(line => {
                textArray.push(line.trim());
            });

            codeBlock.innerText = textArray[0];

            document.querySelector('.processing').style.display = 'block';
            document.querySelector('.preparation').style.display = 'none';
            document.getElementById('ready').style.display = 'none';
        }
        else {
            console.log('Error: Invalid data format');
        }
    })
    .catch(error => console.error('Error:', error));
}

function saveSessionData(currentData, username, selectLang, attemptTime, speed) {
    const data = {
        currentData: currentData,
        username: username,
        selectLang: selectLang,
        attemptTime: attemptTime,
        speed: speed
    }
    fetch('controllers/SessionController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

window.addEventListener('load', function () {
    document.getElementById('ready').addEventListener('click', function() {
        document.querySelector('.processing').style.display = 'block';
        document.querySelector('.preparation').style.display = 'none';
        document.getElementById('ready').style.display = 'none';

        var time = document.getElementById('time');
        var speed = document.getElementById('speed');

        const selectLang = document.getElementById('prog-lang').value;
        getCodeBlock(selectLang);
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
                        sample.innerText = textArray[currentIndex];
                    } else {
                        var time_end = new Date();
                        var elapsed_time = (time_end - time_start) / 1000;

                        var input_speed = count / (elapsed_time / 60);
                        
                        time.textContent = elapsed_time.toFixed(1) + ' с';
                        speed.textContent = input_speed.toFixed(2) + ' символов/мин';
                        input.value = '';

                        //saveSessionData(time_start, username, selectLang, elapsed_time, input_speed);
                    }
                }
                input.value = '';
            }
        });
    });
});
