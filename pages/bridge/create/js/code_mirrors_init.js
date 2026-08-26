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

    const getHeaders = document.getElementById('get-payload-headers');
    const postHeaders = document.getElementById('post-payload-headers');

    if (getHeaders && postHeaders) {
        const getEditorHeaders = CodeMirror.fromTextArea(getHeaders, editorOptions);
        const postEditorHeaders = CodeMirror.fromTextArea(postHeaders, editorOptions);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? "dracula" : "default";
            getEditorHeaders.setOption("theme", newTheme);
            postEditorHeaders.setOption("theme", newTheme);
        });

        const defaultHeaders = JSON.stringify({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer YOUR_TOKEN_HERE"
        }, null, 2);

        getEditorHeaders.setValue(defaultHeaders);
        postEditorHeaders.setValue(defaultHeaders);

        window.getEditorHeaders = getEditorHeaders;
        window.postEditorHeaders = postEditorHeaders;
    }
});