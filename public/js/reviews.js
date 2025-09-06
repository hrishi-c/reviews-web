const dropdown = document.getElementById("customDropdown");
const selected = dropdown.querySelector(".selected");
const options = dropdown.querySelector(".options");

selected.addEventListener("click", () => {
    options.style.display = options.style.display === "block" ? "none" : "block";
});

options.querySelectorAll("div").forEach((option) => {
    option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        window.location.href = "/reviews?sort=" + option.dataset.value;
    });
});

document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) options.style.display = "none";
});