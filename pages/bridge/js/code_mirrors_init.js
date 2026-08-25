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

    const textareaGet = document.getElementById('textarea-get');
    const textareaPost = document.getElementById('textarea-post');

    if (textareaGet && textareaPost) {
        const editorGet = CodeMirror.fromTextArea(textareaGet, editorOptions);
        const editorPost = CodeMirror.fromTextArea(textareaPost, editorOptions);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? "dracula" : "default";
            editorGet.setOption("theme", newTheme);
            editorPost.setOption("theme", newTheme);
        });

        window.editorGet = editorGet;
        window.editorPost = editorPost;
    }
});