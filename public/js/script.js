let textArray = [];

function getCodeBlock(selectElement) {
    const selectedLanguage = selectElement.value;
    fetch('backend_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `language=${selectedLanguage}`,
    })
    .then(response => response.json())
    .then(data => {
        if(data && data.text) {
            const insertBlock = document.getElementsByClassName('sample')[0];

            const lines = data.text.split('\n');
            const reqExp = '<br />';
            lines.forEach(line => {
                //console.log(line);
                textArray.push(line.replace(reqExp, ''));
            });

            insertBlock.style.display = 'block';
            for( let i = 0; i < textArray.length; i++)
                console.log(textArray[i]);
            insertBlock.innerHTML = textArray[0];
        }
        else {
            console.log('Error: Invalid data format');
        }
    })
}

window.addEventListener('load', function () {
    const selectElement = document.getElementById('prog-lang');


    document.getElementById('ready').addEventListener('click', function() {
        document.querySelector('.processing').style.display = 'block';
        document.querySelector('.preparation').style.display = 'none';
        document.getElementById('ready').style.display = 'none';

        // analogue of start button
        var time = document.getElementById('time');
        var speed = document.getElementById('speed');
        var time_start = new Date();
        var count;

        count = this.value.length;

        getCodeBlock(selectElement);// request to back to receive a code
        const input = document.getElementById('input');
        let currentIndex = 0;
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                console.log('enter');
                event.preventDefault();
                const insertBlock = document.getElementsByClassName('sample')[0];
                console.log(`current ${input.value.trim()}`, `from array ${textArray[currentIndex].trim()}`);
                
                if (input.value.trim() === textArray[currentIndex].trim()) {
                    if (currentIndex < textArray.length - 1) {
                        currentIndex++;
                        insertBlock.innerHTML = textArray[currentIndex];
                    }
                    else { // if the lines matched and this was the last line, complete time tracking and display the result
                        var time_end = new Date();
                        var elapsed_time = time_end - time_start;
                        var count = input.value.length;
                        var input_speed = count / (elapsed_time / 1000);
                        
                        console.log("Elapsed time:", elapsed_time);
                        console.log("Input speed:", input_speed);

                        
                        time.textContent = elapsed_time + ' ms';
                        speed.textContent = input_speed.toFixed(2) + ' cps';
                        insertBlock.value = '';
                    }
                }
                input.value = '';
            }
        });
    });
});
