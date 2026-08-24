document.addEventListener('DOMContentLoaded', () => {
    const editorGet = window.editorGet;
    const editorPost = window.editorPost;

    if (!editorGet || !editorPost) return;

    const getContainer = document.getElementById('get-table-container');
    const postContainer = document.getElementById('post-table-container');

    // --- Global var that connects the get keys to the post keys
    window.keyMappings = JSON.parse(localStorage.getItem('saved_key_mappings') || '{}');

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
                        // if the keys of the visual mapping are both present
                        // in the two json payloads, sync the values
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
            row.className = "flex justify-between p-3 bg-white dark:bg-slate-700 border border-dashed border-gray-400 dark:border-slate-500 rounded-md cursor-grab hover:bg-gray-50 dark:hover:bg-slate-600 shadow-sm active:cursor-grabbing";
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

    editorGet.on('change', updateGetTable);
    editorPost.on('change', updatePostTable);

    updateGetTable();
    updatePostTable();
});