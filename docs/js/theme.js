function onChangeTheme(id) {
    let theme = document.getElementById('theme-style-link');
    theme.setAttribute('href', 'css/theme-' + id + '.css');
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme !== id) {
        localStorage.setItem('theme', id);
    }
}

(function(){
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        onChangeTheme(savedTheme);
    } else {
        // default theme
        onChangeTheme('simple');
    }
}());
