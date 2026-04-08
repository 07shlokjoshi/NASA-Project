const API_KEY = "FxdKcgCL4qmGFAXeYAyG4DcO4ABGg2EHZhyBnbay";
const container = document.querySelector(".boxes");

let preferHD = localStorage.getItem("preferHD") === "true";

const hdToggle = document.getElementById("hdToggle");
hdToggle.checked = preferHD;

hdToggle.addEventListener("change", () => {
    preferHD = hdToggle.checked;
    localStorage.setItem("preferHD", preferHD);
    loadAPOD();
});

async function loadAPOD(date = null) {
    try {
        container.innerHTML = "Loading...";

        let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        url += date ? `&date=${date}` : `&count=9`;

        const res = await fetch(url);
        const data = await res.json();

        const items = Array.isArray(data) ? data : [data];
        container.innerHTML = "";

        items.forEach(item => {
            const box = document.createElement("div");
            box.classList.add("box");

            const shortText = item.explanation.slice(0, 120) + "...";
            let isHD = preferHD;

            let mediaHTML = "";

            if (item.media_type === "image") {
                const initialSrc = preferHD && item.hdurl ? item.hdurl : item.url;

                mediaHTML = `
                    <img src="${initialSrc}" class="media">
                    <button class="toggle-hd">${preferHD ? "Normal" : "HD"}</button>
                `;
            } else {
                mediaHTML = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
            }

            box.innerHTML = `
                ${mediaHTML}
                <div class="box-content">
                    <h3>${item.title}</h3>
                    <p class="desc">${shortText}</p>
                    <span class="read-more">Read More</span>
                </div>
            `;

            // Read More
            const desc = box.querySelector(".desc");
            const readBtn = box.querySelector(".read-more");

            let expanded = false;
            readBtn.onclick = () => {
                expanded = !expanded;
                desc.textContent = expanded ? item.explanation : shortText;
                readBtn.textContent = expanded ? "Show Less" : "Read More";
            };

            // Per-card HD toggle
            if (item.media_type === "image") {
                const img = box.querySelector(".media");
                const btn = box.querySelector(".toggle-hd");

                btn.onclick = () => {
                    isHD = !isHD;
                    img.src = isHD && item.hdurl ? item.hdurl : item.url;
                    btn.textContent = isHD ? "Normal" : "HD";
                };
            }

            container.appendChild(box);
        });

    } catch (err) {
        container.innerHTML = "Failed to load data.";
        console.error(err);
    }
}

function filterByDate() {
    const date = document.getElementById("dateInput").value;
    if (date) loadAPOD(date);
}

// Initial load
loadAPOD();
