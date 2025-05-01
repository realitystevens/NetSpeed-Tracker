const resultDiv = document.getElementById('results');
const historyTitle = document.getElementById('history-title');
const button = document.querySelector('.button');
const buttonText = document.querySelector('.button-text');
const spinner = document.querySelector('.spinner');
const historyList = document.querySelector('.history-list');

async function runSpeedTest() {
    // Hide results and historyTitle while loading
    resultDiv.style.display = 'none';
    historyTitle.style.display = 'none';

    // Disable button and show spinner
    button.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'Getting internet speed...';

    try {
        // Make request to Flask backend to run speed test
        const response = await fetch('/run-speedtest');
        const data = await response.json();

        // Update results section with the new data
        resultDiv.innerHTML = `
            <p><strong>Download Speed:</strong> ${data.download} Mbps</p>
            <p><strong>Upload Speed:</strong> ${data.upload} Mbps</p>
            <p><strong>Ping:</strong> ${data.ping} ms</p>
        `;
        resultDiv.style.display = 'block';

        // Update the history section
        const newHistoryItem = document.createElement('li');
        newHistoryItem.innerHTML = `
            <strong>Download:</strong> ${data.download} Mbps, 
            <strong>Upload:</strong> ${data.upload} Mbps, 
            <strong>Ping:</strong> ${data.ping} ms
        `;
        historyList.appendChild(newHistoryItem);

        // Show the historyTitle if hidden
        historyTitle.style.display = 'block';
    } catch (error) {
        console.error('Error running speed test:', error);
        alert('Failed to run speed test. Please try again.');
    } finally {
        // Re-enable the button and hide the spinner
        button.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = 'Check Speed';
    }
}