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

        // --- DRAG AND DROP MAPPING LOGIC ---

        const getContainer = document.getElementById('get-table-container');
        const postContainer = document.getElementById('post-table-container');

        // --- Global var that connects the get keys to the post keys
        let keyMappings = JSON.parse(localStorage.getItem('saved_key_mappings') || '{}');

        function updateGetTable() {
            try {
                const getObj = JSON.parse(editorGet.getValue());
                renderGetTable(getObj);

                try {
                    const postObj = JSON.parse(editorPost.getValue());
                    let postUpdated = false;
                    
                    // if the source payload (get endpoint) is changed/refreshed
                    // update any post payload's values based on the key mappings
                    for (const [postKey, getKey] of Object.entries(keyMappings)) {
                        if (postObj.hasOwnProperty(postKey) && getObj.hasOwnProperty(getKey)) { 
                            // if the keys of the mapping are both present
                            // sync the values
                            if (JSON.stringify(postObj[postKey]) !== JSON.stringify(getObj[getKey])) {
                                postObj[postKey] = getObj[getKey];
                                postUpdated = true;
                            }
                        }
                    }
                    
                    if (postUpdated) {
                        editorPost.setValue(JSON.stringify(postObj, null, 2));
                    }
                } catch (e) {} // Fails silently if POST JSON is invalid while typing

            } catch (error) {
                // Fails silently while user is typing invalid GET JSON
            }
        }

        function updatePostTable() {
            try {
                const data = JSON.parse(editorPost.getValue());
                renderPostTable(data);
            } catch (error) {
                // Fails silently while user is typing invalid JSON
            }
        }

        // Render GET table
        function renderGetTable(data) {
            getContainer.innerHTML = ''; 
            
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('div');
                row.className = "flex justify-between p-3 bg-white dark:bg-slate-700 border border-dashed border-gray-400 dark:border-slate-400 rounded-md cursor-grab hover:bg-gray-50 dark:hover:bg-slate-600 shadow-sm active:cursor-grabbing";
                row.draggable = true;
                
                row.innerHTML = `
                    <span class="font-semibold text-blue-600 dark:text-blue-400">${key}</span>
                    <span class="text-gray-500 dark:text-gray-300 truncate max-w-[50%]">${typeof value === 'object' ? '{...}' : value}</span>
                `;

                row.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', key);
                    e.dataTransfer.effectAllowed = 'copy';
                    row.classList.add('opacity-50');
                });

                row.addEventListener('dragend', () => row.classList.remove('opacity-50'));

                getContainer.appendChild(row);
            }
        }

        // Render POST Table
        function renderPostTable(data) {
            postContainer.innerHTML = ''; 
            
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('div');
                row.className = "flex justify-between p-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-500 rounded-md transition-colors duration-200";
                
                let mappingBadge = '';
                if (keyMappings[key]) {
                    mappingBadge = 
                    `<span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800" title="Mapped to GET key: ${keyMappings[key]}">
                        🔗 ${keyMappings[key]}
                        <button type="button" class="remove-mapping-btn ml-1.5 hover:text-red-500 dark:hover:text-red-400 font-bold focus:outline-none cursor-pointer text-sm leading-none" title="Remove binding">&times;</button>
                    </span>`;
                }

                row.innerHTML = `
                    <div class="flex items-center">
                        <span class="font-semibold text-green-600 dark:text-green-400">${key}</span>
                        ${mappingBadge}
                    </div>
                    <span class="text-gray-500 dark:text-gray-300 truncate max-w-[40%]">${typeof value === 'object' ? '{...}' : value}</span>
                `;

                row.addEventListener('dragover', (e) => {
                    e.preventDefault(); 
                    e.dataTransfer.dropEffect = 'copy';
                    row.classList.add('bg-green-50', 'dark:bg-slate-600', 'border-green-500'); 
                });

                row.addEventListener('dragleave', () => {
                    row.classList.remove('bg-green-50', 'dark:bg-slate-600', 'border-green-500');
                });

                row.addEventListener('drop', (e) => {
                    e.preventDefault();
                    row.classList.remove('bg-green-50', 'dark:bg-slate-600', 'border-green-500');

                    const draggedGetKey = e.dataTransfer.getData('text/plain');
                    
                    // Grab the actual value from the current GET JSON
                    let getObj = {};
                    try { getObj = JSON.parse(editorGet.getValue()); } catch (err) {}

                    if (getObj.hasOwnProperty(draggedGetKey)) {
                        // Save the mapping to memory!
                        keyMappings[key] = draggedGetKey;
                        localStorage.setItem('saved_key_mappings', JSON.stringify(keyMappings));

                        // Map the actual value into the POST JSON
                        data[key] = getObj[draggedGetKey];
                        
                        editorPost.setValue(JSON.stringify(data, null, 2));
                    }
                });

                // Listen for the "Remove Binding" button click
                const removeBtn = row.querySelector('.remove-mapping-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevents this click from interfering with drag-and-drop
                        
                        delete keyMappings[key];
                        localStorage.setItem('saved_key_mappings', JSON.stringify(keyMappings));
                        
                        renderPostTable(data); 
                    });
                }

                postContainer.appendChild(row);
            }
        }

        // Update JSON areas to local storage and from local storage

        if (!editorGet.getValue().trim() && localStorage.getItem('saved_get_json')) {
            editorGet.setValue(localStorage.getItem('saved_get_json'));
        }
        if (!editorPost.getValue().trim() && localStorage.getItem('saved_post_json')) {
            editorPost.setValue(localStorage.getItem('saved_post_json'));
        }

        localStorage.setItem('saved_get_json', editorGet.getValue());
        localStorage.setItem('saved_post_json', editorPost.getValue());

        editorGet.on('change', () => {
            localStorage.setItem('saved_get_json', editorGet.getValue());
            updateGetTable();
        });

        editorPost.on('change', () => {
            localStorage.setItem('saved_post_json', editorPost.getValue());
            updatePostTable();
        });

        updateGetTable();
        updatePostTable();

        // URL local storage persistence
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
                document.getElementById('get_endpoint').value = '';
                document.getElementById('post_endpoint').value = '';
                
                // Clear ALL LocalStorage items
                localStorage.removeItem('saved_get_json');
                localStorage.removeItem('saved_post_json');
                localStorage.removeItem('saved_get_url');
                localStorage.removeItem('saved_post_url');
                localStorage.removeItem('saved_key_mappings');
                keyMappings = {};

                // Reset tables
                document.getElementById('get-table-container').innerHTML = '<p class="text-center text-sm text-gray-500 mt-10">Waiting for valid GET JSON...</p>';
                document.getElementById('post-table-container').innerHTML = '<p class="text-center text-sm text-gray-500 mt-10">Waiting for valid POST JSON...</p>';
            });
        }
    }
});