const TIMEUPDATE_INTERVAL = 1000 * 30;
const TEMPERATUREUPDATE_INTERVAL = 1000 * 60 * 5;

class TimedateWidget {
    constructor() {
        this.temperature = "...";
        
        // DOM objects
        this.timeElement = document.querySelector("#time");
        this.dateElement = document.querySelector("#date");
        this.temperatureElement = document.querySelector("#temperature");

        this.updateTime();
        this.updateTemperature();

        setInterval(this.updateTime.bind(this), TIMEUPDATE_INTERVAL);
        setInterval(this.updateTemperature.bind(this), TEMPERATUREUPDATE_INTERVAL);
    }

    updateTime() {
        const date = new Date();
        this.time = date.toLocaleTimeString('en-uk', { hour: '2-digit', minute: '2-digit' });
        this.date = date.toLocaleDateString('en-uk', { weekday: 'long', month: 'long', day: 'numeric' });

        this.render();
    }

    async updateTemperature() {
        // Get the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Fetch the temperature using the user's coordinates
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const data = await response.json();

                // Extract the temperature from the API response
                this.temperature = `${data.current_weather.temperature}°C`;  // Assuming the API returns temperature in Celsius

                this.render();
            }, (error) => {
                console.error("Error getting location: ", error);
                this.temperature = "Location unavailable";
                this.render();
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            this.temperature = "N/A";
            this.render();
        }
    }

    render() {
        this.timeElement.textContent = this.time;
        this.dateElement.textContent = this.date;
        this.temperatureElement.textContent = this.temperature;
    }
}

const widget = new TimedateWidget();
