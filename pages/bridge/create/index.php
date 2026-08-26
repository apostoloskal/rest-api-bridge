<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Bridge</title>

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

            .green-button-1 {
                @apply text-white bg-green-600 rounded-lg
                box-border border border-transparent hover:bg-green-400 
                hover:dark:bg-green-700 focus:ring-4 focus:ring-green-600 
                focus:dark:ring-green-800 shadow-xs font-medium leading-5
                text-sm px-4 py-1.5 focus:outline-none cursor-pointer
            }

            .button-gray-1 {
                @apply bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 
                text-white px-4 py-1 rounded-md text-sm shadow-xs font-medium
            }

            .card-theme-2 {
                @apply shadow-md bg-gray-300 dark:bg-slate-800 rounded-lg
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
            <div class="relative flex items-center justify-center p-4">
                <a href="/" class="absolute left-1 button-gray-1 inline-block ml-4">
                    Back
                </a>
                <p class="text-4xl font-semibold text-heading">Create Bridge</p>
            </div>

            <!-- Bridge Connection Details -->
            <div class="flex-1 flex flex-col card-theme-1 m-4 p-2">
                <div class="relative flex items-center justify-center pb-2 border-b border-gray-300 dark:border-slate-500">
                    <p class="text-2xl font-semibold text-heading">Bridge Details</p>
                    <button type="button" id="btn-new-bridge" class="absolute right-1 inline-block ml-4 green-button-1">
                        Save Bridge
                    </button>
                </div>

                <div class="flex-1 flex flex-row">
                    <div class="w-1/2 flex flex-col">
                        <div class="flex flex-col items-center card-theme-2 p-4 m-2"> 
                            <label for="bridge-name" class="mb-2">Bridge Name</label>
                            <input
                            name="bridge-name"
                            id="bridge-name"
                            placeholder="Bridge name"
                            required
                            class="bg-white dark:bg-slate-700 border border-gray-300 
                            dark:border-slate-500 text-sm rounded-md block w-full 
                            px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 
                            focus:outline-none"
                            />
                        </div>

                        <div class="flex flex-col items-center card-theme-2 p-4 m-2"> 
                            <label for="get-endpoint" class="mb-2">Get URL</label>
                            <input
                            name="get-endpoint"
                            id="get-endpoint"
                            placeholder="Get endpoint url"
                            required
                            class="bg-white dark:bg-slate-700 border border-gray-300 
                            dark:border-slate-500 text-sm rounded-md block w-full 
                            px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 
                            focus:outline-none"
                            />
                        </div>

                        <div class="flex flex-col items-center card-theme-2 p-4 m-2"> 
                            <label for="post-endpoint" class="mb-2">Post URL</label>
                            <input
                            name="post-endpoint"
                            id="post-endpoint"
                            placeholder="Post endpoint url"
                            required
                            class="bg-white dark:bg-slate-700 border border-gray-300 
                            dark:border-slate-500 text-sm rounded-md block w-full 
                            px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 
                            focus:outline-none"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col w-1/2 p-2 border-l border-gray-300 dark:border-slate-500">
                        <p class="text-center text-xl font-semibold text-heading pb-2">Payload Headers (JSON)</p>
                        <div class="w-full h-full text-left">
                            <textarea id="textarea-headers" name="headers-json"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </main>
    <script type="module" src="/pages/bridge/create/js/main.js"></script>
</body>
</html>