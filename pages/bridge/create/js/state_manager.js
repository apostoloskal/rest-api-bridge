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
    // Save bridge to database
    const btnSave = document.getElementById('btn-new-bridge');
    
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const nameInput = document.getElementById('bridge-name').value.trim();
            const srcUrl = document.getElementById('get-endpoint').value.trim();
            const dstUrl = document.getElementById('post-endpoint').value.trim();
            
            let headersObj = {};
            if (window.editorHeaders) {
                try {
                    let rawJson = window.editorHeaders.getValue() || '{}';
                    headersObj = safelyParseJSON(rawJson);
                } catch (e) {
                    alert("Invalid JSON in Headers box. Please fix it before saving.");
                    return;
                }
            }
            
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
                key_mappings: {},
                headers: headersObj
            };

            // Temporarily change button text so the user knows it's working
            const originalText = btnSave.innerText;
            btnSave.innerText = "Saving...";

            try {
                // Send the data to your PHP endpoint
                const response = await fetch('/php/create_bridge.php', {
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