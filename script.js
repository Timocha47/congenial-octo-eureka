function changeImageWithAnimation(newSrc, newText, newColor) {
    const imageElement = document.getElementById('site-image');
    const textElement = document.getElementById('messedge');
    imageElement.classList.add('fade-out');
    setTimeout(() => {
        imageElement.src = newSrc;
        textElement.innerText = newText;
        textElement.style.color = newColor;
        imageElement.classList.remove('fade-out');
    }, 400);
}
function clicMe() {
    changeImageWithAnimation(
        'my-foto-2.jpg',
        'Ура! Текст и картинка плавно изменились! 🎉',
        '#28a745'
    );
}
function resetMe() {
    changeImageWithAnimation(
        'my-foto.jpg',
        'Привет! Я не писал код 3 месяца, но теперь я в деле!🚀',
        '#00008b'
    );
}