const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const list = document.querySelector(".response-section .cities");
const msg = document.querySelector(".msg");

const apiKey = 'dc38f29bd027f8f93eaf1b41339aef48';

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  const listItems = list.querySelectorAll(".response-section .city");
  const listItemsArray = Array.from(listItems);

  if(listItemsArray.length > 0) {
    // шукаємо чи вже існує картка дял вказаного юзером міста в пошуку
    const dublicate = listItemsArray.find(el => {

      if(inputVal.includes(",")) {
        if(inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0];
          const content = el.querySelector(".city-name span").textContent.toLowerCase();
          return inputVal === content; 
        } else {
          const cityData = el.querySelector(".city-name").dataset.name.toLowerCase();
          return inputVal.toLowerCase() === cityData;
        }

      } else {
         // дістаємо для поточної картки її значення міста
        const cityName = el.querySelector(".city-name span").textContent.toLowerCase();
        // порівнюємо значення яке юзер ввів в пошуку зі значенням з поточної картки 
        return inputVal.toLowerCase() === cityName;
      }

    });

    if(dublicate) {
      msg.textContent = `You already know the weather for ${inputVal}`;
      form.reset();
      input.focus();
      return;
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add('city');

      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;

      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city"
    });

  form.reset();
  input.focus();
  msg.textContent = "";
})