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

function constructPostPayloadFromKeyMappings() {
    if (!window.keyMappings || !window.editorPost || !window.editorGet) return;

    let getObj = {};
    if (window.editorGet) {
        getObj = safelyParseJSON(window.editorGet.getValue());
    }

    let postObj = {};
    for (const [postKey, getKey] of Object.entries(window.keyMappings)) {
        if (getObj.hasOwnProperty(getKey)) {
            postObj[postKey] = getObj[getKey];
        } else {
            postObj[postKey] = '{Key is missing: ' + getKey + '}';
        }
    }

    window.editorPost.setValue(JSON.stringify(postObj, null, 2));
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
                    if (getEp) {
                        getEp.value = data.src_url;
                        getEp.dispatchEvent(new Event('input')); // clear url param fields
                    }
                    if (postEp) {
                        postEp.value = data.dst_url
                        postEp.dispatchEvent(new Event('input')); // clear url param fields
                    };
                    
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
                    localStorage.setItem('saved_key_mappings', JSON.stringify(window.keyMappings));

                    // Automatically build the post payload from defined mappings
                    constructPostPayloadFromKeyMappings();
                    
                } else {
                    alert("Could not load bridge: " + result.message);
                }
            })
            .catch(err => console.error("Error loading bridge:", err));
    }

    // Get Payload JSON persistence
    if (!editorGet.getValue().trim() && localStorage.getItem('saved_get_json')) {
        editorGet.setValue(localStorage.getItem('saved_get_json'));
    }

    // Load request payloads on page load
    localStorage.setItem('saved_get_json', editorGet.getValue());

    // Store any changes made to the request payloads
    editorGet.on('change', () => localStorage.setItem('saved_get_json', editorGet.getValue()));


    // Update Bridge Details
    const btnDetailsUpdate = document.getElementById('btn-update-bridge-details');
    
    if (btnDetailsUpdate) {
        btnDetailsUpdate.addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const bridgeId = urlParams.get('id');

            if (!bridgeId) {
                alert("Cannot update: No Bridge ID found in the URL.");
                return;
            }

            const nameInput = document.getElementById('bridge-name').value.trim();
            const srcUrl = document.getElementById('get-endpoint').value.trim();
            const dstUrl = document.getElementById('post-endpoint').value.trim();
            
            let headersObj = {};
            if (window.editorHeaders) {
                try {
                    headersObj = safelyParseJSON(window.editorHeaders.getValue());
                } catch (e) {
                    alert("Invalid JSON in Headers box. Please fix it before updating.");
                    return;
                }
            }
            
            if (!nameInput || !srcUrl || !dstUrl) {
                alert("Please fill out Name, Get URL, and Post URL.");
                return;
            }

            // Construct the payload WITH the ID
            const payload = {
                id: bridgeId, 
                name: nameInput,
                src_url: srcUrl,
                dst_url: dstUrl,
                headers: headersObj
            };

            const originalText = btnDetailsUpdate.innerText;
            btnDetailsUpdate.innerText = "Updating...";

            try {
                // Send it to the new UPDATE endpoint
                const response = await fetch('/php/update_bridge_details.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                } else {
                    alert("Failed to update: " + result.message);
                }
            } catch (error) {
                console.error("Error updating bridge:", error);
                alert("A network error occurred while updating.");
            } finally {
                btnDetailsUpdate.innerText = originalText;
            }
        });
    }

    // Update Bridge Key Mappings
    const btnKeyMappingsUpdate = document.getElementById('btn-update-key-mappings');
    
    if (btnKeyMappingsUpdate) {
        btnKeyMappingsUpdate.addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const bridgeId = urlParams.get('id');

            if (!bridgeId) {
                alert("Cannot update: No Bridge ID found in the URL.");
                return;
            }

            // Construct the payload WITH the ID
            const payload = {
                id: bridgeId, 
                key_mappings: window.keyMappings
            };

            const originalText = btnKeyMappingsUpdate.innerText;
            btnKeyMappingsUpdate.innerText = "Updating...";

            try {
                // Send it to the new UPDATE endpoint
                const response = await fetch('/php/update_bridge_key_mappings.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                } else {
                    alert("Failed to update: " + result.message);
                }
            } catch (error) {
                console.error("Error updating bridge:", error);
                alert("A network error occurred while updating.");
            } finally {
                btnKeyMappingsUpdate.innerText = originalText;
            }
        });
    }
});