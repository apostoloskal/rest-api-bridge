function safelyParseJSON(rawString) {
    if (!rawString) return {};
    
    // The Regex: Match a full string literal OR a trailing comma
    const cleanedString = rawString.replace(/"(?:[^"\\]|\\.)*"|,\s*([\]}])/g, (match, bracket) => {
        // If 'bracket' exists, we found a trailing comma! Return just the bracket.
        if (bracket) {
            return bracket;
        }
        // Otherwise, we matched a string literal. Return it completely untouched.
        return match;
    });

    return JSON.parse(cleanedString);
}

document.addEventListener('DOMContentLoaded', () => {
    const editorHeaders = window.editorHeaders;
    const editorGet = window.editorGet;
    const editorPost = window.editorPost;

    if (!editorHeaders || !editorGet || !editorPost) return;

    // Load bridge from url params
    const urlParams = new URLSearchParams(window.location.search);
    const bridgeId = urlParams.get('id');

    if (bridgeId) {
        // Fetch the configuration from the database
        fetch(`/php/load_bridge.php?id=${bridgeId}`)
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const data = result.data;

                    // Populate URL inputs
                    const getEp = document.getElementById('get-endpoint');
                    const postEp = document.getElementById('post-endpoint');
                    if (getEp) getEp.value = data.src_url;
                    if (postEp) postEp.value = data.dst_url;
                    
                    // Populate the Bridge Name input
                    const nameInput = document.getElementById('bridge-name');
                    if (nameInput) nameInput.value = data.name;

                    // Load headers
                    let headersObj = {};
                    if (typeof data.headers === 'string') {
                        headersObj = safelyParseJSON(data.headers);
                    } else if (data.headers) {
                        headersObj = data.headers;
                    }
                    
                    const headersString = JSON.stringify(headersObj, null, 2);
                    
                    window.editorHeaders.setValue(headersString);

                    // Load Key Mappings safely
                    window.keyMappings = typeof data.key_mappings === 'string' ? safelyParseJSON(data.key_mappings) : data.key_mappings;
                    if (!window.keyMappings) window.keyMappings = {};
                    
                    // Force-save everything to LocalStorage so it persists
                    localStorage.setItem('saved_bridge_name', data.name);
                    localStorage.setItem('saved_get_url', data.src_url);
                    localStorage.setItem('saved_post_url', data.dst_url);
                    localStorage.setItem('saved_key_mappings', JSON.stringify(window.keyMappings));
                    
                    // Clean up CodeMirror editors if they had junk in them
                    editorGet.setValue('');
                    editorPost.setValue('');
                    localStorage.removeItem('saved_get_json');
                    localStorage.removeItem('saved_post_json');
                } else {
                    alert("Could not load bridge: " + result.message);
                }
            })
            .catch(err => console.error("Error loading bridge:", err));
    }

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

    // Bridge details storage
    const bridgeName = document.getElementById('bridge-name');
    const getEndpoint = document.getElementById('get-endpoint');
    const postEndpoint = document.getElementById('post-endpoint');

    if (bridgeName && getEndpoint && postEndpoint) {
        if (!bridgeName.value && localStorage.getItem('saved_bridge_name')) {
            bridgeName.value = localStorage.getItem('saved_bridge_name');
        }
        if (!getEndpoint.value && localStorage.getItem('saved_get_url')) {
            getEndpoint.value = localStorage.getItem('saved_get_url');
        }
        if (!postEndpoint.value && localStorage.getItem('saved_post_url')) {
            postEndpoint.value = localStorage.getItem('saved_post_url');
        }

        bridgeName.addEventListener('input', () => {
            localStorage.setItem('saved_bridge_name', bridgeName.value);
        });

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
            if(bridgeName) bridgeName.value = '';
            if(getEndpoint) getEndpoint.value = '';
            if(postEndpoint) postEndpoint.value = '';
            
            // Clear ALL LocalStorage items
            localStorage.removeItem('saved_get_json');
            localStorage.removeItem('saved_post_json');
            localStorage.removeItem('saved_bridge_name');
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
                const response = await fetch('/php/save_bridge.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                } else {
                    alert("Failed to save: " + result.message);
                }
            } catch (error) {
                console.error("Error saving bridge:", error);
                alert("A network error occurred while saving.");
            } finally {
                // Restore button text
                btnSave.innerText = originalText;
            }
        });
    }
});