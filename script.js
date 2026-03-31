const url = "https://api.nasa.gov/planetary/apod?count=10&api_key=DEMO_KEY";

async function loadAPOD() {
    try {
        const res = await fetch(url);
        const data = await res.json();

        const container = document.querySelector(".boxes");

        data.forEach(item => {
            const box = document.createElement("div");
            box.classList.add("box");

            let media;

            if (item.media_type === "image") {
                media = `<img src="${item.url}" alt="${item.title}">`;
            } else {
                media = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
            }

            box.innerHTML = `
                ${media}
                <div class="box-content">
                    <h3>${item.title}</h3>
                    <p>${item.explanation}</p>
                </div>
            `;

            container.appendChild(box);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

loadAPOD();