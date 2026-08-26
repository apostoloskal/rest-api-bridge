// Dynamic Url params extraction
function extractParams(urlStr) {
    const regex = /{([^}]+)}/g;
    const params = new Set();
    let match;
    
    while ((match = regex.exec(urlStr)) !== null) {
        params.add(match[1]);
    }
    return Array.from(params);
}

function renderDynamicParams() {
    const getUrl = document.getElementById('get-endpoint').value.trim();
    const postUrl = document.getElementById('post-endpoint').value.trim();
    
    const getParams = extractParams(getUrl);
    const postParams = extractParams(postUrl);
    
    const container = document.getElementById('dynamic-params-container');
    const getParamsDiv = document.getElementById('get-url-params-div');
    const postParamsDiv = document.getElementById('post-url-params-div');
    
    // If no {params} are found, hide the container and exit
    if (getParams.length === 0 && postParams.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');

    getParamsDiv.innerHTML = '<p class="italic text-gray-400 p-2">None</p>';
    postParamsDiv.innerHTML = '<p class="italic text-gray-400 p-2">None</p>';


    // --- HANDLE GET PARAMETERS ---
    const currentGetParams = Array.from(getParamsDiv.querySelectorAll('.dynamic-param-input'))
        .map(input => input.getAttribute('data-param').replace('get_', ''));
        
    // Only re-render GET column if the requested params changed
    if (JSON.stringify([...getParams].sort()) !== JSON.stringify(currentGetParams.sort())) {
        if (getParams.length === 0) {
            getParamsDiv.innerHTML = '<p class="italic text-gray-400 p-2">None</p>';
        } else {
            let getHtml = '';
            getParams.forEach(param => {
                getHtml += `
                    <div class="flex flex-col items-start">
                        <label class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">${param}:</label>
                        <input 
                            type="text" 
                            data-param="get_${param}" 
                            placeholder="Enter ${param}..." 
                            class="dynamic-param-input bg-white dark:bg-slate-700 
                            border border-gray-300 dark:border-slate-500 text-sm 
                            rounded-md block w-full px-3 py-2 focus:ring-indigo-500 
                            focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                `;
            });
            getParamsDiv.innerHTML = getHtml;
        }
    }

    // --- HANDLE POST PARAMETERS ---
    const currentPostParams = Array.from(postParamsDiv.querySelectorAll('.dynamic-param-input'))
        .map(input => input.getAttribute('data-param').replace('post_', ''));
        
    // Only re-render POST column if the requested params changed
    if (JSON.stringify([...postParams].sort()) !== JSON.stringify(currentPostParams.sort())) {
        if (postParams.length === 0) {
            postParamsDiv.innerHTML = '<p class="italic text-gray-400 p-2">None</p>';
        } else {
            let postHtml = '';
            postParams.forEach(param => {
                postHtml += `
                    <div class="flex flex-col items-start">
                        <label class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">${param}:</label>
                        <input 
                            type="text" 
                            data-param="post_${param}" 
                            placeholder="Enter ${param}..." 
                            class="dynamic-param-input bg-white dark:bg-slate-700 
                            border border-gray-300 dark:border-slate-500 text-sm 
                            rounded-md block w-full px-3 py-2 focus:ring-indigo-500 
                            focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                `;
            });
            postParamsDiv.innerHTML = postHtml;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const getEndpoint = document.getElementById('get-endpoint');
    const postEndpoint = document.getElementById('post-endpoint');

    if (getEndpoint && postEndpoint) {
        getEndpoint.addEventListener('input', renderDynamicParams);
        postEndpoint.addEventListener('input', renderDynamicParams);
        
        renderDynamicParams(); 
    }
});