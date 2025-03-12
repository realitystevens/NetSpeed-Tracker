const resultDiv = document.getElementById('results')
const subTitle = document.getElementById('sub_title')
const button = document.querySelector('.button')
const buttonText = document.querySelector('.button-text')
const spinner = document.querySelector('.spinner')



function runSpeedTest() {
    resultDiv.style.display = 'none';
    subTitle.style.display = 'none'

    button.disabled = true
    spinner.style.display = 'inline-block'
    buttonText.textContent = 'Getting internet speed'
    

    fetch('/api/speedtest')
    .then(response => response.json())
    .then(data => {
        document.getElementById('download').innerText = data.download;
        document.getElementById('upload').innerText = data.upload;
        document.getElementById('ping').innerText = data.ping;

        resultDiv.style.display = 'grid';
        subTitle.style.display = 'block'
        spinner.style.display = 'none'
        button.disabled = false
        buttonText.textContent = 'Run Test again'   
        
        updateChart();
    });
}

function updateChart() {
    fetch('/api/history')
        .then(response => response.json())
        .then(data => {
            const labels = data.map((_, index) => `Speed test ${index + 1}`);
            const downloadData = data.map(result => result.download);
            const uploadData = data.map(result => result.upload);
            const pingData = data.map(result => result.ping);

            // Find the max value dynamically and add a buffer
            const maxValue = Math.max(...downloadData, ...uploadData, ...pingData);
            const buffer = maxValue * 0.2; // 20% extra space
            const yAxisMax = Math.ceil(maxValue + buffer);

            // Adjust step size to keep graph compact
            const stepSize = Math.ceil(yAxisMax / 10); // More labels for better spacing

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Download Speed (Mbps)',
                        data: downloadData,
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false,
                    },
                    {
                        label: 'Upload Speed (Mbps)',
                        data: uploadData,
                        borderColor: 'rgb(153, 102, 255)',
                        fill: false,
                    },
                    {
                        label: 'Ping (ms)',
                        data: pingData,
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false,
                    },
                ],
            };

            const config = {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: yAxisMax,
                            ticks: {
                                stepSize: stepSize, // Dynamically adjust step size
                            }
                        }
                    } 
                },
            };

            const chartElement = document.getElementById('speedTestChart');
            if (chartElement.chartInstance) {
                chartElement.chartInstance.destroy();
            }
            chartElement.chartInstance = new Chart(chartElement, config);
        });
}
