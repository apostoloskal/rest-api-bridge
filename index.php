<?php 
    include 'php/rest_api_methods.php'; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>

    <!-- CodeMirror Core CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">

    <!-- CodeMirror Core JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>

    <!-- CodeMirror JSON/JavaScript Mode -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>

    <!-- CodeMirror Dracula Dark Theme -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/dracula.min.css">

    <!-- Tailwind CSS -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
        @theme {
            --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                'Segoe UI Symbol', 'Noto Color Emoji';
        }

        @layer base {
            body {
                @apply bg-gray-50 text-gray-900 text-lg dark:bg-slate-800 dark:text-slate-50;
            }
        }

        @layer components {
            .card-theme-1 {
                @apply shadow-md bg-gray-200 dark:bg-slate-600 rounded-lg
            }

            .fetch-button-1 {
                @apply text-white bg-green-500 dark:bg-green-700 rounded-lg
                box-border border border-transparent hover:bg-green-400 
                hover:dark:bg-green-600 focus:ring-4 focus:ring-green-600 
                focus:dark:ring-green-800 shadow-xs font-medium leading-5
                text-sm px-4 py-2.5 focus:outline-none cursor-pointer
            }

            .post-button-1 {
                @apply text-white bg-blue-500 dark:bg-blue-700 rounded-lg
                box-border border border-transparent hover:bg-blue-400 
                hover:dark:bg-blue-600 focus:ring-4 focus:ring-blue-600 
                focus:dark:ring-blue-800 shadow-xs font-medium leading-5
                text-sm px-4 py-2.5 focus:outline-none cursor-pointer
            }

            .clear-button-1 {
                @apply bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-sm
            }

            .table-theme-1 {
                @apply bg-gray-300 dark:bg-slate-800 focus:outline-none rounded-lg
                box-border border border-transparent focus:ring-2 focus:ring-gray-400
                focus:dark:ring-slate-800 shadow-xs text-sm
            }
        }
    </style>

    <style>
        .CodeMirror {
            height: 100% !important;
            font-family: monospace;
            font-size: medium;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            cursor: text;
        }
    </style>

    <script>
        // Prevent browser from resubmitting the form on page refresh (F5)
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    </script>

</head>
<body class="min-h-screen flex flex-col">
    <main>
        <form method="POST" class="flex-1 flex flex-col max-w-5xl m-auto">
            <div class="w-full items-center p-4">
                <p class="text-center text-4xl font-semibold text-heading">Bridge</p>
            </div>
            <div class="w-full text-right">
                <button type="button" id="btn-clear" class="clear-button-1 cursor-pointer mr-4">
                    Clear All
                </button>
            </div>
            <!-- Fetch and Post inputs -->
            <div class="flex-1 flex flex-row justify-evenly p-4">
                <div class="w-1/2 flex flex-row card-theme-1 m-4 p-4">
                    <div class="w-full flex flex-col items-center">
                        <label for="get_endpoint" class="mb-2">Get URL</label>
                        <input
                        name="get_endpoint"
                        id="get_endpoint"
                        placeholder="Get endpoint url"
                        value="<?php echo isset($_POST['get_endpoint']) ? htmlspecialchars($_POST['get_endpoint']) : ''; ?>"
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body
                        focus:outline-none"
                        />
                    </div>
                    <div class="w-1/3 min-w-24 items-center p-4">
                        <button type="submit" name="action" value="fetch" class="w-full mt-4 fetch-button-1">Fetch</button>
                    </div>
                </div>
                <div class="w-1/2 flex flex-row card-theme-1 m-4 p-4">
                    <div class="w-full flex flex-col items-center">
                        <label for="post_endpoint" class="mb-2">Post URL</label>
                        <input
                        name="post_endpoint"
                        id="post_endpoint"
                        placeholder="Post endpoint url"
                        value="<?php echo isset($_POST['post_endpoint']) ? htmlspecialchars($_POST['post_endpoint']) : ''; ?>"
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body
                        focus:outline-none"
                        />
                    </div>
                    <div class="w-1/3 min-w-24 items-center p-4">
                        <button type="submit" name="action" value="post" class="w-full mt-4 post-button-1">Post</button>
                    </div>
                </div>
            </div>
            <!-- JSON Text Area -->
            <div class="flex-1 flex flex-col card-theme-1 m-4 p-2 pt-4">
                <div class="w-full items-center pb-2">
                    <p class="text-center text-2xl font-semibold text-heading">JSON</p>
                </div>
                
                <!-- Code Mirror Text Areas -->
                <div class="flex-1 flex flex-row min-h-[400px]"> 
                    
                    <div class="flex flex-col w-1/2 p-2">
                        <p class="text-center text-xl font-semibold text-heading pb-2">GET</p>
                        <div class="w-full h-full text-left">
                            <textarea id="textarea-get" name="get_json"><?php echo htmlspecialchars($fetchedJson ?? ''); ?></textarea>
                        </div>
                    </div>
                    
                    <div class="flex flex-col w-1/2 p-2">
                        <p class="text-center text-xl font-semibold text-heading pb-2">POST</p>
                        <div class="w-full h-full text-left">
                            <textarea id="textarea-post" name="post_json"><?php echo htmlspecialchars($_POST['post_json'] ?? ''); ?></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Mapping -->
            <div class="flex-1 flex flex-col card-theme-1 m-4 p-2 pt-4">
                <div class="w-full flex justify-between items-center px-4 pb-2 border-b border-gray-300 dark:border-slate-500">
                    <p class="text-2xl font-semibold text-heading">Visual Mapper</p>
                </div>
                
                <div class="flex-1 flex flex-row min-h-[300px] mt-4"> 
                    <div class="flex flex-col w-1/2 p-2 border-r border-gray-300 dark:border-slate-500">
                        <p class="text-center text-xl font-semibold text-heading pb-2">GET Data (Drag from here)</p>
                        <div id="get-table-container" class="w-full h-full flex flex-col gap-2 overflow-y-auto table-theme-1 p-2">
                            <p class="text-center text-sm text-gray-500 mt-10">Waiting for valid GET JSON...</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col w-1/2 p-2">
                        <p class="text-center text-xl font-semibold text-heading pb-2">POST Payload (Drop here)</p>
                        <div id="post-table-container" class="w-full h-full flex flex-col gap-2 overflow-y-auto table-theme-1 p-2">
                            <p class="text-center text-sm text-gray-500 mt-10">Waiting for valid POST JSON...</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </main>

    <!-- Code Mirror initialization script -->
    <script src="js/scripts.js"></script>
</body>
</html>