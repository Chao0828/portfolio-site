fetch("works.csv")
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        // \r\n (Windows) と \n (Mac/Linux) どちらの改行でも正しく分割する
        var rows = data.trim().split(/\r?\n/);

        // 1行目は見出し (空白を取り除く)
        var headers = rows[0].split(",").map(h => h.trim());

        // 2行目以降は作品データにする
        var works = rows.slice(1).map(function(row) {
            var values = row.split(",");
            var work = {};
            headers.forEach(function(header, index) {
                // undefinedにならないよう、値が存在するか確認して空白を取り除く
                work[header] = values[index] ? values[index].trim() : "";
            });
            return work;
        });

        var grid = document.getElementById("works-grid");
        var categorySelect = document.getElementById("category");
        var sortSelect = document.getElementById("sort");

        // カテゴリ一覧を作る
        var categories = [];
        works.forEach(function(work) {
            if (work.category && !categories.includes(work.category)) {
                categories.push(work.category);
            }
        });

        categories.forEach(function(category) {
            var option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // 作品を表示する関数
        function displayWorks() {
            var selectedCategory = categorySelect.value;
            var sortType = sortSelect.value;
            var filteredWorks = works.slice();

            // カテゴリ絞り込み
            if (selectedCategory !== "all") {
                filteredWorks = filteredWorks.filter(function(work) {
                    return work.category === selectedCategory;
                });
            }

            // ソート
            if (sortType === "new") {
                filteredWorks.sort(function(a, b) {
                    return Number(b.year) - Number(a.year);
                });
            } else if (sortType === "old") {
                filteredWorks.sort(function(a, b) {
                    return Number(a.year) - Number(b.year);
                });
            } else if (sortType === "title") {
                filteredWorks.sort(function(a, b) {
                    return a.title.localeCompare(b.title, "ja");
                });
            }

            // 画面を空にして描画
            grid.innerHTML = "";

            filteredWorks.forEach(function(work) {
                var card = document.createElement("article");
                card.className = "work-card";

                card.innerHTML =
                    '<a href="' + work.link + '">' +
                        '<img src="' + work.image + '" alt="' + work.title + '">' +
                        '<div class="work-info">' +
                            '<p class="work-category">' + work.category + '</p>' +
                            '<h4>' + work.title + '</h4>' +
                            '<p>' + work.description + '</p>' +
                            '<p class="work-year">' + work.year + '</p>' +
                        '</div>' +
                    '</a>';

                grid.appendChild(card);
            });
        }

        displayWorks();

        categorySelect.addEventListener("change", displayWorks);
        sortSelect.addEventListener("change", displayWorks);
    })
    .catch(function(error) {
        console.error("CSVの読み込みに失敗しました:", error);
    });

// --- ダークモード切り替え ---
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        toggle.textContent = "☀️";
    } else {
        toggle.textContent = "🌙";
    }
});