<?php
require 'php/database.php';

// Pagination setup
$limit = 15;
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Get total number of bridges for pagination math
$totalQuery = $pdo->query("SELECT COUNT(*) FROM saved_bridges");
$totalBridges = $totalQuery->fetchColumn();
$totalPages = ceil($totalBridges / $limit);

// Fetch the bridges for the current page
$stmt = $pdo->prepare("SELECT id, name, src_url, dst_url, created_at FROM saved_bridges ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$bridges = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>List Bridges</title>

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
                text-sm px-4 py-2.5 focus:outline-none cursor-pointer
            }

            .blue-button-1 {
                @apply text-white bg-blue-500 dark:bg-blue-700 rounded-lg
                box-border border border-transparent hover:bg-blue-400 
                hover:dark:bg-blue-600 focus:ring-4 focus:ring-blue-600 
                focus:dark:ring-blue-800 shadow-xs font-medium leading-5
                text-sm px-4 py-1.5 focus:outline-none cursor-pointer
            }
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
                <p class="text-4xl font-semibold text-heading">Bridges</p>
                <a href="/pages/bridge/create" class="absolute right-1 w-fit green-button-1 cursor-pointer p-2">
                    Create New Bridge
                </a>
            </div>

            <div class="card-theme-1 flex-1 flex flex-col">
                <?php if (count($bridges) === 0): ?>
                    <div class="text-center text-gray-500 dark:text-gray-300 my-auto py-12">
                        <p class="text-xl">No bridges saved yet.</p>
                    </div>
                <?php else: ?>
                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-300 dark:bg-slate-700">
                                    <th class="py-3 px-4">Name</th>
                                    <th class="py-3 px-4">Get URL</th>
                                    <th class="py-3 px-4">Post URL</th>
                                    <th class="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($bridges as $bridge): ?>
                                    <tr class="border-t border-gray-300 dark:border-slate-500 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors">
                                        <td class="py-3 px-4 font-semibold"><?php echo htmlspecialchars($bridge['name']); ?></td>
                                        <td class="py-3 px-4 text-sm truncate max-w-xs text-gray-600 dark:text-gray-300"><?php echo htmlspecialchars($bridge['src_url']); ?></td>
                                        <td class="py-3 px-4 text-sm truncate max-w-xs text-gray-600 dark:text-gray-300"><?php echo htmlspecialchars($bridge['dst_url']); ?></td>
                                        <td class="py-3 px-3 text-right">
                                            <!-- This link sends the ID to index.php! -->
                                            <a href="/pages/bridge/view?id=<?php echo $bridge['id']; ?>" class="blue-button-1">
                                                Open
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Controls -->
                    <?php if ($totalPages > 1): ?>
                        <div class="flex justify-center items-center border-t border-gray-300 dark:border-slate-500">
                            <div class="m-4 flex gap-2">
                                <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                    <a href="?page=<?php echo $i; ?>" class="inline-flex items-center justify-center w-8 h-8 border rounded <?php echo $i === $page ? 'bg-indigo-500 text-white border-indigo-500' : 'border-gray-400 hover:bg-gray-300 dark:hover:bg-slate-500'; ?>">
                                        <?php echo $i; ?>
                                    </a>
                                <?php endfor; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </form>
    </main>
</body>
</html>