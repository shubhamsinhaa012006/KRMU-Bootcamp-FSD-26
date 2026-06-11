
const API_KEY = 'e631661bf59312badf7a113ff6ae2403';

// DOM Elements
const heroSearchInput = document.getElementById('hero-search-input');
const dashSearchInput = document.getElementById('dash-search-input');
const dashboard = document.getElementById('weather-dashboard');
const skeletonLoader = document.getElementById('skeleton-loader');
const initialState = document.getElementById('initial-state');
const toastContainer = document.getElementById('toast-container');

// Navigation Elements
const topNav = document.getElementById('top-nav');
const navHomeBtn = document.getElementById('nav-home-btn');

let isDashboardView = false;

// Global Keyboard Shortcut
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isDashboardView) {
            dashSearchInput.focus();
        } else {
            heroSearchInput.focus();
        }
    }
});

// Trigger search for both inputs
function handleSearch(e, inputEl) {
    if (e.key === 'Enter') {
        const city = inputEl.value.trim();
        if (city) {
            fetchWeather(city);
            inputEl.blur();
        }
    }
}

heroSearchInput.addEventListener('keypress', (e) => handleSearch(e, heroSearchInput));
dashSearchInput.addEventListener('keypress', (e) => handleSearch(e, dashSearchInput));

// Navigation Listeners
navHomeBtn.addEventListener('click', resetToHome);

function resetToHome() {
    heroSearchInput.value = '';
    dashSearchInput.value = '';
    transitionToState('initial');
}

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(city) {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        showToast('Please add your API key in script.js');
        return;
    }

    transitionToState('skeleton');

    try {
        // Fetch current weather and 5-day forecast concurrently
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
        ]);

        const data = await weatherRes.json();
        
        if (weatherRes.ok) {
            dashSearchInput.value = '';
            updateUI(data);
            
            if (forecastRes.ok) {
                const forecastData = await forecastRes.json();
                renderForecast(processForecast(forecastData));
            } else {
                document.getElementById('forecast-stack').innerHTML = '<div class="forecast-card" style="width:100%;"><span class="forecast-day">Forecast unavailable</span></div>';
            }
        } else {
            showToast(data.message);
            if (isDashboardView) {
                transitionToState('dashboard');
            } else {
                transitionToState('initial');
            }
        }
    } catch (err) {
        showToast('Network error. Please try again.');
        if (isDashboardView) {
            transitionToState('dashboard');
        } else {
            transitionToState('initial');
        }
    }
}

// Manage UI SPA states with smooth opacity and positioning
function transitionToState(state) {
    initialState.classList.add('hidden');
    dashboard.classList.add('hidden');
    skeletonLoader.classList.add('hidden');

    if (state === 'initial') {
        isDashboardView = false;
        topNav.classList.add('hidden');
        initialState.classList.remove('hidden');
        if (window.weatherSimulator) {
            window.weatherSimulator.setWeather(800, '01d'); // Default clear day theme
        }
        
    } else if (state === 'skeleton') {
        topNav.classList.remove('hidden');
        skeletonLoader.classList.remove('hidden');
        
    } else if (state === 'dashboard') {
        isDashboardView = true;
        topNav.classList.remove('hidden');
        dashboard.classList.remove('hidden');
    }
}

// Elegant Toast Notification
function showToast(message) {
    toastContainer.textContent = message.charAt(0).toUpperCase() + message.slice(1);
    toastContainer.classList.add('show');
    setTimeout(() => {
        toastContainer.classList.remove('show');
    }, 3500);
}

// Premium Number Counter Animation
function animateValue(obj, start, end, duration) {
    if (obj._animationId) {
        window.cancelAnimationFrame(obj._animationId);
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        obj.innerHTML = Math.floor(ease * (end - start) + start);
        if (progress < 1) {
            obj._animationId = window.requestAnimationFrame(step);
        }
    };
    obj._animationId = window.requestAnimationFrame(step);
}

// Update DOM elements with API data
function updateUI(data) {
    document.getElementById('city-name').textContent = data.name;
    
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', dateOptions);
    
    document.getElementById('weather-condition').textContent = capitalizeFirstLetter(data.weather[0].description);
    document.getElementById('feels-like').textContent = Math.round(data.main.feels_like);
    
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    const visib = data.visibility ? (data.visibility / 1000).toFixed(1) : '>10';
    document.getElementById('visibility').textContent = `${visib} km`;
    
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);

    // Smooth Temperature Counter
    const tempEl = document.getElementById('temperature');
    const currentTemp = parseInt(tempEl.textContent) || 0;
    const targetTemp = Math.round(data.main.temp);
    animateValue(tempEl, currentTemp, targetTemp, 1500);

    // Apply Cinematic Weather Themes
    const weatherId = data.weather[0].id;
    const iconCode = data.weather[0].icon;
    if (window.weatherSimulator) {
        window.weatherSimulator.setWeather(weatherId, iconCode);
    }

    // Smooth transition reveal
    setTimeout(() => {
        transitionToState('dashboard');
    }, 600);
}

function formatTime(unixTime, offset) {
    const d = new Date((unixTime + offset) * 1000);
    let hours = d.getUTCHours();
    let minutes = d.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function capitalizeFirstLetter(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// --- Forecast Processing & Rendering ---
function processForecast(data) {
    const daily = {};
    const timezoneOffset = data.city.timezone;
    
    // Get "today" in the city's local timezone
    const todayDate = new Date((Date.now() / 1000 + timezoneOffset) * 1000);
    const today = todayDate.getUTCDay(); // 0-6 index
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = days[today];

    data.list.forEach(item => {
        // Apply city timezone offset to UTC timestamp
        const localTime = new Date((item.dt + timezoneOffset) * 1000);
        const dayIndex = localTime.getUTCDay();
        const dayName = days[dayIndex];
        
        // Skip today to show future forecast
        if (dayName === todayStr) return;

        if (!daily[dayName]) {
            daily[dayName] = {
                day: dayName,
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min,
                weatherId: item.weather[0].id,
                iconCode: item.weather[0].icon,
                desc: item.weather[0].description,
                humidity: item.main.humidity,
                wind: item.wind.speed
            };
        } else {
            daily[dayName].temp_max = Math.max(daily[dayName].temp_max, item.main.temp_max);
            daily[dayName].temp_min = Math.min(daily[dayName].temp_min, item.main.temp_min);
            // Grab midday weather condition
            if (item.dt_txt.includes("12:00:00")) {
                daily[dayName].weatherId = item.weather[0].id;
                daily[dayName].iconCode = item.weather[0].icon;
                daily[dayName].desc = item.weather[0].description;
            }
        }
    });

    return Object.values(daily).slice(0, 7); // Up to available days (usually 5 from this endpoint)
}

function renderForecast(dailyData) {
    const stack = document.getElementById('forecast-stack');
    stack.innerHTML = '';

    dailyData.forEach((dayData, index) => {
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        
        let iconSvg = getSVGIconStr(dayData.weatherId, dayData.iconCode);

        card.innerHTML = `
            <span class="forecast-day">${dayData.day}</span>
            <div class="forecast-icon">${iconSvg}</div>
            <div class="forecast-temp">
                <span class="temp-max">${Math.round(dayData.temp_max)}°</span>
                <span class="temp-min">${Math.round(dayData.temp_min)}°</span>
            </div>
            <span class="forecast-cond">${capitalizeFirstLetter(dayData.desc)}</span>
            <div class="forecast-extra">
                <div class="extra-row">
                    <span>Humidity</span>
                    <span>${dayData.humidity}%</span>
                </div>
                <div class="extra-row">
                    <span>Wind</span>
                    <span>${(dayData.wind * 3.6).toFixed(1)} km/h</span>
                </div>
            </div>
        `;

        // Apple wallet physics interaction
        card.addEventListener('click', (e) => {
            // If already expanded, collapse it
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                return;
            }
            // Collapse all others
            document.querySelectorAll('.forecast-card').forEach(c => c.classList.remove('expanded'));
            // Expand this one
            card.classList.add('expanded');
        });

        stack.appendChild(card);
    });
}
function initForecastBounce() {

    const forecastSection = document.querySelector('.forecast-section');

    const forecastStack = document.getElementById('forecast-stack');

    if (!forecastSection || !forecastStack) return;

    forecastSection.addEventListener('click', (e) => {

        if (e.target.closest('.forecast-card')) return;

        forecastStack.animate(

            [

                { transform: 'translateY(0px)' },

                { transform: 'translateY(18px)' },

                { transform: 'translateY(0px)' }

            ],

            {

                duration: 550,

                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

            }

        );

    });

}
// Helper to return SVG string instead of injecting to DOM directly
function getSVGIconStr(weatherId, iconCode) {
    let type = 'cloud';
    let isDay = iconCode ? iconCode.includes('d') : true;

    if (weatherId >= 200 && weatherId < 300) type = 'thunderstorm';
    else if (weatherId >= 300 && weatherId < 600) type = 'rain';
    else if (weatherId >= 600 && weatherId < 700) type = 'snow';
    else if (weatherId >= 700 && weatherId < 800) type = 'mist';
    else if (weatherId === 800) type = isDay ? 'sun' : 'moon';
    else if (weatherId > 800) type = 'cloud';

    const stroke = "rgba(255,255,255,0.95)";
    if (type === 'sun') {
        return `<div style="width:30px; height:30px; background: radial-gradient(circle at 30% 30%, #fffacd 0%, #ffd700 40%, #ff8c00 100%); border-radius: 50%; box-shadow: 0 0 10px rgba(255,140,0,0.5);"></div>`;
    }
    
    // ... we reuse the SVG icons ...
    if (type === 'cloud') return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`;
    if (type === 'rain') return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path><path d="M8 13v9"></path><path d="M16 13v9"></path><path d="M12 15v9"></path></svg>`;
    if (type === 'snow') return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12h-4"></path><path d="M4 12h4"></path><path d="M12 20v-4"></path><path d="M12 4v4"></path><path d="m17.5 17.5-2.5-2.5"></path><path d="m6.5 6.5 2.5 2.5"></path><path d="m17.5 6.5-2.5 2.5"></path><path d="m6.5 17.5 2.5-2.5"></path></svg>`;
    if (type === 'thunderstorm') return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path><path d="M13 13l-3 5h4l-3 5"></path></svg>`;
    if (type === 'mist') return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>`;
    if (type === 'moon') return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    return '';
}

// --- Cinematic Canvas Weather Simulator ---
class WeatherSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.clouds = [];
        this.weatherType = 'clear';
        this.isDay = true;
        this.time = 0;
        this.lightningTimer = 0;
        this.lightningFlash = 0;
        
        // Colors for smooth gradient transitions
        this.colors = { top: [15, 32, 39], bottom: [44, 83, 100] };
        this.targetColors = { top: [15, 32, 39], bottom: [44, 83, 100] };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
        
        this.setWeather(800, '01d'); // Default clear day
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    setWeather(weatherId, iconCode) {
        this.isDay = iconCode ? iconCode.includes('d') : true;
        
        // Map OpenWeatherMap ID to type
        if (weatherId >= 200 && weatherId < 300) this.weatherType = 'thunderstorm';
        else if (weatherId >= 300 && weatherId < 600) this.weatherType = 'rain';
        else if (weatherId >= 600 && weatherId < 700) this.weatherType = 'snow';
        else if (weatherId >= 700 && weatherId < 800) this.weatherType = 'fog';
        else if (weatherId === 800) this.weatherType = 'clear';
        else if (weatherId > 800) this.weatherType = 'clouds';
        
        // Define target background gradients
        if (this.weatherType === 'thunderstorm') {
            this.targetColors = { top: [20, 30, 48], bottom: [36, 59, 85] };
            this.spawnParticles('rain', 800);
            this.spawnClouds(10, 0.4);
        } else if (this.weatherType === 'rain') {
            this.targetColors = { top: [44, 62, 80], bottom: [52, 152, 219] };
            this.spawnParticles('rain', 500);
            this.spawnClouds(8, 0.3);
        } else if (this.weatherType === 'snow') {
            this.targetColors = { top: [224, 234, 252], bottom: [207, 222, 243] };
            this.spawnParticles('snow', 400);
            this.spawnClouds(4, 0.2);
        } else if (this.weatherType === 'fog') {
            this.targetColors = { top: [117, 127, 154], bottom: [215, 221, 232] };
            this.spawnParticles('fog', 0); // No particles, just volumetric clouds
            this.spawnClouds(15, 0.1);
        } else if (this.weatherType === 'clear') {
            if (this.isDay) {
                this.targetColors = { top: [246, 211, 101], bottom: [253, 160, 133] };
            } else {
                this.targetColors = { top: [15, 32, 39], bottom: [44, 83, 100] };
            }
            this.spawnParticles('dust', 100);
            this.clouds = []; // Clear clouds
        } else if (this.weatherType === 'clouds') {
            if (this.isDay) {
                this.targetColors = { top: [142, 158, 171], bottom: [238, 242, 243] };
            } else {
                this.targetColors = { top: [58, 96, 115], bottom: [22, 34, 42] };
            }
            this.spawnParticles('dust', 50);
            this.spawnClouds(12, 0.25);
        }
    }
    
    spawnParticles(type, count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: Math.random() * 0.8 + 0.2, // Depth (0.2 to 1)
                vx: type === 'snow' ? (Math.random() - 0.5) : type === 'dust' ? (Math.random() - 0.5) * 0.5 : (Math.random() * 2 + 1), // Wind x
                vy: type === 'rain' ? (Math.random() * 15 + 10) : type === 'snow' ? (Math.random() * 2 + 1) : (Math.random() - 0.5) * 0.5,
                len: type === 'rain' ? Math.random() * 20 + 10 : 0,
                radius: type === 'snow' ? Math.random() * 3 + 1 : type === 'dust' ? Math.random() * 2 : 0,
                type: type
            });
        }
    }
    
    spawnClouds(count, opacityBase) {
        this.clouds = [];
        for (let i = 0; i < count; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.5),
                radius: Math.random() * 200 + 150,
                vx: (Math.random() * 0.5 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
                opacity: opacityBase + Math.random() * 0.1
            });
        }
    }
    
    lerpColor(current, target, rate) {
        return current.map((c, i) => {
            const diff = target[i] - c;
            return c + diff * rate;
        });
    }
    
    update() {
        this.time++;
        
        // Interpolate background colors
        this.colors.top = this.lerpColor(this.colors.top, this.targetColors.top, 0.02);
        this.colors.bottom = this.lerpColor(this.colors.bottom, this.targetColors.bottom, 0.02);
        
        // Lightning logic
        if (this.weatherType === 'thunderstorm') {
            if (this.lightningTimer <= 0) {
                if (Math.random() > 0.98) {
                    this.lightningFlash = 1.0;
                    this.lightningTimer = Math.random() * 200 + 100;
                }
            }
            this.lightningTimer--;
            if (this.lightningFlash > 0) {
                this.lightningFlash -= 0.05;
            }
        } else {
            this.lightningFlash = 0;
        }
        
        // Update particles
        for (let p of this.particles) {
            let windX = p.vx;
            if (p.type === 'snow') {
                windX += Math.sin(this.time * 0.01 + p.y * 0.01) * 1.5;
            }
            
            p.x += windX * p.z;
            p.y += p.vy * p.z;
            
            // Wrap around
            if (p.y > this.height) {
                p.y = -20;
                p.x = Math.random() * this.width;
            }
            if (p.x > this.width) p.x = 0;
            if (p.x < 0) p.x = this.width;
        }
        
        // Update procedural clouds
        for (let c of this.clouds) {
            c.x += c.vx;
            if (c.x > this.width + c.radius) c.x = -c.radius;
            if (c.x < -c.radius) c.x = this.width + c.radius;
        }
    }
    
    draw() {
        const ctx = this.ctx;
        
        // Draw Background Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, `rgb(${Math.round(this.colors.top[0])}, ${Math.round(this.colors.top[1])}, ${Math.round(this.colors.top[2])})`);
        gradient.addColorStop(1, `rgb(${Math.round(this.colors.bottom[0])}, ${Math.round(this.colors.bottom[1])}, ${Math.round(this.colors.bottom[2])})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw Sun or Moon
        if (this.weatherType === 'clear' || this.weatherType === 'clouds') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            if (this.isDay) {
                // Sun
                const sunX = this.width * 0.3;
                const sunY = this.height * 0.3;
                const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 300);
                sunGrad.addColorStop(0, 'rgba(255, 255, 200, 1)');
                sunGrad.addColorStop(0.2, 'rgba(255, 200, 100, 0.6)');
                sunGrad.addColorStop(1, 'rgba(255, 150, 50, 0)');
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.arc(sunX, sunY, 300, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Moon
                const moonX = this.width * 0.7;
                const moonY = this.height * 0.2;
                ctx.fillStyle = 'rgba(200, 220, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(moonX, moonY, 40, 0, Math.PI * 2);
                ctx.fill();
                // Moon glow
                const moonGrad = ctx.createRadialGradient(moonX, moonY, 40, moonX, moonY, 150);
                moonGrad.addColorStop(0, 'rgba(150, 200, 255, 0.3)');
                moonGrad.addColorStop(1, 'rgba(150, 200, 255, 0)');
                ctx.fillStyle = moonGrad;
                ctx.fill();
            }
            ctx.restore();
        }
        
        // Draw Procedural Clouds
        for (let c of this.clouds) {
            ctx.save();
            const cloudGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
            const r = this.isDay ? 255 : 100;
            const g = this.isDay ? 255 : 110;
            const b = this.isDay ? 255 : 130;
            cloudGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${c.opacity})`);
            cloudGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = cloudGrad;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Draw Particles
        for (let p of this.particles) {
            ctx.beginPath();
            if (p.type === 'rain') {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + p.z * 0.3})`;
                ctx.lineWidth = p.z * 1.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.vx * p.z * 2, p.y + p.len * p.z);
                ctx.stroke();
            } else if (p.type === 'snow') {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + p.z * 0.5})`;
                ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'dust') {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + p.z * 0.2})`;
                ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw Lightning Flash
        if (this.lightningFlash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningFlash * 0.8})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }
    
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Initialize global simulator after DOM is fully loaded or at bottom of script
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('cinematic-canvas');

    if (canvas) {
        window.weatherSimulator = new WeatherSimulator('cinematic-canvas');
    }

    initForecastBounce();
});

// 3D Tilt Effect on Dashboard Left Elements
const glassPanels = document.querySelectorAll('.dashboard-left .glass-panel');
document.addEventListener('mousemove', (e) => {
    if (!isDashboardView) return;
    
    // Smooth, subtle 3D rotation based on mouse position
    const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
    
    glassPanels.forEach(panel => {
        panel.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
});

document.addEventListener('mouseleave', () => {
    glassPanels.forEach(p => {
        p.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
});

// Set initial theme and state
transitionToState('initial');
