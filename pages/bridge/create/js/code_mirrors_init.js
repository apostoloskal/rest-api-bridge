document.addEventListener('DOMContentLoaded', () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = systemPrefersDark ? "dracula" : "default";

    const editorOptions = {
        mode: "application/json",
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 2,
        lineWrapping: true,
        theme: currentTheme
    };

    const textareaHeaders = document.getElementById('textarea-headers');

    if (textareaHeaders) {
        const editorHeaders = CodeMirror.fromTextArea(textareaHeaders, editorOptions);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? "dracula" : "default";
            editorHeaders.setOption("theme", newTheme);
        });

        const defaultHeaders = JSON.stringify({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer YOUR_TOKEN_HERE"
        }, null, 2);

        editorHeaders.setValue(defaultHeaders);

        window.editorHeaders = editorHeaders;
    }
});