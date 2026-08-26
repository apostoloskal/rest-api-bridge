// Constuct final get url
function resolveDynamicGetUrl(rawGetUrl) {
    let finalGetUrl = rawGetUrl;
    const getInputs = document.getElementById('get-url-params-div').querySelectorAll('.dynamic-param-input');

    getInputs.forEach(input => {
        // Strip the "get_" prefix off the attribute to find the real {param} name
        const paramName = input.getAttribute('data-param').replace('get_', '');
        const regex = new RegExp(`{${paramName}}`, 'g');
        finalGetUrl = finalGetUrl.replace(regex, encodeURIComponent(input.value.trim()));
    });
    
    return finalGetUrl;
}

// Constuct final post url
function resolveDynamicPostUrl(rawPostUrl) {
    let finalPostUrl = rawPostUrl;
    const postInputs = document.getElementById('post-url-params-div').querySelectorAll('.dynamic-param-input');

    postInputs.forEach(input => {
        // Strip the "post_" prefix off the attribute to find the real {param} name
        const paramName = input.getAttribute('data-param').replace('post_', '');
        const regex = new RegExp(`{${paramName}}`, 'g');
        finalPostUrl = finalPostUrl.replace(regex, encodeURIComponent(input.value.trim()));
    });
    
    return finalPostUrl;
}


document.addEventListener('DOMContentLoaded', () => {

    const btnFetch = document.getElementById('btn-fetch-payload');

    if (btnFetch) {
        btnFetch.addEventListener('click', async (e) => {
            const rawGetUrl = document.getElementById('get-endpoint').value;
            const activeUrl = resolveDynamicGetUrl(rawGetUrl); // final resolved url to send to php
            
            // Check if there are any un-filled parameters left over
            if (activeUrl.includes('{') || activeUrl.includes('}')) {
                e.preventDefault();
                alert("Please fill out all dynamic URL parameters before fetching.");
                return;
            }
    
            document.getElementById('resolved-get-endpoint').value = activeUrl;
        });
    }
});