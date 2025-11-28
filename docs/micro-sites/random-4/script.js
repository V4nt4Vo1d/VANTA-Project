document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = "0 0 20px #00e0ff55";
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = "none";
    });
});
