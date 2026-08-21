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

        function updateGetTable() {
            try {
                const data = JSON.parse(editorGet.getValue());
                renderGetTable(data);
            } catch (error) {
                // Fails silently while user is typing invalid JSON
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
                    e.dataTransfer.setData('text/plain', typeof value === 'object' ? JSON.stringify(value) : value);
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
                
                row.innerHTML = `
                    <span class="font-semibold text-green-600 dark:text-green-400">${key}</span>
                    <span class="text-gray-500 dark:text-gray-300 truncate max-w-[50%]">${typeof value === 'object' ? '{...}' : value}</span>
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
                    
                    let draggedValue = e.dataTransfer.getData('text/plain');
                    try { draggedValue = JSON.parse(draggedValue); } catch (e) {}

                    data[key] = draggedValue;
                    
                    editorPost.setValue(JSON.stringify(data, null, 2));
                });

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

                // Reset tables
                document.getElementById('get-table-container').innerHTML = '<p class="text-center text-sm text-gray-500 mt-10">Waiting for valid GET JSON...</p>';
                document.getElementById('post-table-container').innerHTML = '<p class="text-center text-sm text-gray-500 mt-10">Waiting for valid POST JSON...</p>';
            });
        }
    }
});