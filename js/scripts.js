// scripts.js
document.addEventListener("DOMContentLoaded", () => {
    const projectElements = document.querySelectorAll('.project');
    projectElements.forEach(el => {
        el.addEventListener("mouseover", () => el.classList.add("highlight"));
        el.addEventListener("mouseleave", () => el.classList.remove("highlight"));
    });
});
