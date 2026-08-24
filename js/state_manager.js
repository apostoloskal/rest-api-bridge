document.addEventListener('DOMContentLoaded', () => {
    const editorGet = window.editorGet;
    const editorPost = window.editorPost;

    if (!editorGet || !editorPost) return;

    // JSON storage
    if (!editorGet.getValue().trim() && localStorage.getItem('saved_get_json')) {
        editorGet.setValue(localStorage.getItem('saved_get_json'));
    }
    if (!editorPost.getValue().trim() && localStorage.getItem('saved_post_json')) {
        editorPost.setValue(localStorage.getItem('saved_post_json'));
    }

    localStorage.setItem('saved_get_json', editorGet.getValue());
    localStorage.setItem('saved_post_json', editorPost.getValue());

    // Update jsons on modify
    editorGet.on('change', () => localStorage.setItem('saved_get_json', editorGet.getValue()));
    editorPost.on('change', () => localStorage.setItem('saved_post_json', editorPost.getValue()));

    // URL storage
    const getEndpoint = document.getElementById('get_endpoint');
    const postEndpoint = document.getElementById('post_endpoint');

    if (getEndpoint && postEndpoint) {
        if (!getEndpoint.value && localStorage.getItem('saved_get_url')) {
            getEndpoint.value = localStorage.getItem('saved_get_url');
        }
        if (!postEndpoint.value && localStorage.getItem('saved_post_url')) {
            postEndpoint.value = localStorage.getItem('saved_post_url');
        }

        getEndpoint.addEventListener('input', () => {
            localStorage.setItem('saved_get_url', getEndpoint.value);
        });

        postEndpoint.addEventListener('input', () => {
            localStorage.setItem('saved_post_url', postEndpoint.value);
        });
    }

    // Clear fields and storage
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            // Clear CodeMirror editors
            editorGet.setValue('');
            editorPost.setValue('');
            
            // Clear Input fields
            if(getEndpoint) getEndpoint.value = '';
            if(postEndpoint) postEndpoint.value = '';
            
            // Clear ALL LocalStorage items
            localStorage.removeItem('saved_get_json');
            localStorage.removeItem('saved_post_json');
            localStorage.removeItem('saved_get_url');
            localStorage.removeItem('saved_post_url');
            localStorage.removeItem('saved_key_mappings');

            window.keyMappings = {};

            // Reset tables
            document.getElementById('get-table-container').innerHTML = '<p class="text-center text-sm text-gray-500 mt-10">Waiting for valid GET JSON...</p>';
            document.getElementById('post-table-container').innerHTML = '<p class="text-center text-sm text-gray-500 mt-10">Waiting for valid POST JSON...</p>';
        });
    }
});