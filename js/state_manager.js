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

    // Store json payloads to local storage on modification
    editorGet.on('change', () => localStorage.setItem('saved_get_json', editorGet.getValue()));
    editorPost.on('change', () => localStorage.setItem('saved_post_json', editorPost.getValue()));

    // URL storage
    const getEndpoint = document.getElementById('get-endpoint');
    const postEndpoint = document.getElementById('post-endpoint');

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

    // Save bridge
    const btnSave = document.getElementById('btn-new-bridge');
    
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const nameInput = document.getElementById('bridge-name').value.trim();
            const srcUrl = document.getElementById('get-endpoint').value.trim();
            const dstUrl = document.getElementById('post-endpoint').value.trim();
            
            if (!nameInput) {
                alert("Please provide a name for this Bridge before saving.");
                return;
            }
            if (!srcUrl || !dstUrl) {
                alert("Both Get URL and Post URL must be filled out to save.");
                return;
            }

            // Construct the payload to match your MariaDB columns
            const payload = {
                name: nameInput,
                src_url: srcUrl,
                dst_url: dstUrl,
                key_mappings: window.keyMappings || {},
                headers: {} // Placeholder for future custom headers
            };

            // Temporarily change button text so the user knows it's working
            const originalText = btnSave.innerText;
            btnSave.innerText = "Saving...";

            try {
                // Send the data to your PHP endpoint
                const response = await fetch('php/save_bridge.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert("✅ " + result.message);
                    document.getElementById('bridge-name').value = ''; // clear name input on success
                } else {
                    alert("❌ Failed to save: " + result.message);
                }
            } catch (error) {
                console.error("Error saving bridge:", error);
                alert("❌ A network error occurred while saving.");
            } finally {
                // Restore button text
                btnSave.innerText = originalText;
            }
        });
    }
});