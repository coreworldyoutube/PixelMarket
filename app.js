/* =========================================================
   LOAD JSON
   ========================================================= */

async function loadCollection() {

    const response =
        await fetch(
            "./elements.json",
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            `elements.json を読み込めませんでした: ${response.status}`
        );
    }

    return await response.json();
}


/* =========================================================
   NULL ELEMENT
   ========================================================= */

function nullElement() {

    const div =
        document.createElement("div");

    div.className = "null";

    div.textContent = "Null";

    return div;
}


/* =========================================================
   TEXTURE AREA
   ========================================================= */

function textureElement(item) {

    const area =
        document.createElement("div");

    area.className = "image-area";


    /*
       texture が設定されている場合
    */

    if (item.texture) {

        const img =
            document.createElement("img");

        img.className = "texture";

        img.src = item.texture;

        img.alt = item.name;


        /*
           画像が存在しなかった場合
        */

        img.onerror = () => {

            area.replaceChildren(
                nullElement()
            );

        };


        area.appendChild(img);

    } else {

        area.appendChild(
            nullElement()
        );

    }


    return area;
}


/* =========================================================
   ELEMENT CARD
   ========================================================= */

function createElementCard(item) {

    const card =
        document.createElement("div");

    card.className = "element";

    card.title = item.name;


    /*
       原子番号
    */

    const number =
        document.createElement("div");

    number.className = "atomic-number";

    number.textContent =
        item.number ?? "";


    /*
       元素記号
    */

    const symbol =
        document.createElement("div");

    symbol.className = "symbol";

    symbol.textContent =
        item.symbol;


    /*
       名前
    */

    const name =
        document.createElement("div");

    name.className = "name";

    name.textContent =
        item.name;


    /*
       カードへ追加
    */

    card.append(
        number,
        symbol,
        textureElement(item),
        name
    );


    return card;
}


/* =========================================================
   SERIES MARKER
   ========================================================= */

function createMarker(series) {

    const marker =
        document.createElement("div");

    marker.className =
        "series-marker";

    marker.textContent =
        series.marker;


    /*
       小さい説明
    */

    const label =
        document.createElement("small");

    label.textContent =
        series.label;


    marker.appendChild(label);


    /*
       クリックするとシリーズへ
       スクロール
    */

    marker.style.cursor = "pointer";

    marker.addEventListener(
        "click",
        () => {

            const target =
                document.getElementById(
                    `series-${series.id}`
                );

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );


    return marker;
}


/* =========================================================
   PERIODIC TABLE
   ========================================================= */

function renderPeriodicTable(data) {

    const table =
        document.querySelector(
            "#periodic-table"
        );


    /*
       念のため空にする
    */

    table.replaceChildren();


    /*
       通常の周期表を生成
    */

    for (const item of data.elements) {

        const card =
            createElementCard(item);


        card.style.gridColumn =
            item.group;

        card.style.gridRow =
            item.period;


        table.appendChild(card);
    }


    /*
       La / Ac の位置に
       (1) / (2) を置く
    */

    for (const series of data.series) {

        const marker =
            createMarker(series);


        let row;


        if (series.id === "lanthanides") {

            row = 6;

        } else if (series.id === "actinides") {

            row = 7;

        } else {

            continue;

        }


        /*
           3族の位置
        */

        marker.style.gridColumn = 3;

        marker.style.gridRow = row;


        table.appendChild(marker);
    }
}


/* =========================================================
   SERIES
   ========================================================= */

function renderSeries(data) {

    const root =
        document.querySelector(
            "#series-root"
        );


    root.replaceChildren();


    for (const series of data.series) {

        const section =
            document.createElement(
                "section"
            );

        section.className =
            "collection-section";

        section.id =
            `series-${series.id}`;


        /*
           タイトル
        */

        const title =
            document.createElement("h2");

        title.className =
            "section-title";

        title.textContent =
            `${series.marker} ${series.label}`;


        /*
           グリッド
        */

        const grid =
            document.createElement("div");

        grid.className =
            "series-table";


        /*
           左側ラベル
        */

        const label =
            document.createElement("div");

        label.className =
            "series-label";

        label.textContent =
            series.label;


        grid.appendChild(label);


        /*
           15元素
        */

        for (const item of series.items) {

            grid.appendChild(
                createElementCard(item)
            );

        }


        section.append(
            title,
            grid
        );


        root.appendChild(section);
    }
}


/* =========================================================
   CATEGORY CARD
   ========================================================= */

function createCategoryCard(item) {

    const card =
        document.createElement("div");

    card.className =
        "category-item";

    card.title =
        item.name;


    /*
       シンボル
    */

    const symbol =
        document.createElement("div");

    symbol.className =
        "symbol";

    symbol.textContent =
        item.symbol ?? "";


    /*
       種類
    */

    const type =
        document.createElement("div");

    type.className =
        "item-type";

    type.textContent =
        item.type ?? "ITEM";


    /*
       名前
    */

    const name =
        document.createElement("div");

    name.className =
        "name";

    name.textContent =
        item.name;


    card.append(
        symbol,
        textureElement(item),
        type,
        name
    );


    return card;
}


/* =========================================================
   CATEGORIES
   ========================================================= */

function renderCategories(data) {

    const root =
        document.querySelector(
            "#categories-root"
        );


    root.replaceChildren();


    /*
       categories が無くてもエラーにしない
    */

    for (
        const category
        of data.categories ?? []
    ) {

        const section =
            document.createElement(
                "section"
            );

        section.className =
            "collection-section";


        /*
           タイトル
        */

        const title =
            document.createElement("h2");

        title.className =
            "section-title";

        title.textContent =
            category.label;


        /*
           説明
        */

        const description =
            document.createElement("p");

        description.className =
            "section-description";

        description.textContent =
            category.description ?? "";


        /*
           アイテム一覧
        */

        const grid =
            document.createElement("div");

        grid.className =
            "category-grid";


        for (
            const item
            of category.items ?? []
        ) {

            grid.appendChild(
                createCategoryCard(item)
            );

        }


        section.append(
            title,
            description,
            grid
        );


        root.appendChild(section);
    }
}


/* =========================================================
   MAIN
   ========================================================= */

async function main() {

    const data =
        await loadCollection();


    /*
       ページタイトル
    */

    document.title =
        data.title;


    document.querySelector(
        "#title"
    ).textContent =
        data.title;


    document.querySelector(
        "#subtitle"
    ).textContent =
        data.subtitle;


    /*
       描画
    */

    renderPeriodicTable(data);

    renderSeries(data);

    renderCategories(data);
}


/* =========================================================
   ERROR HANDLING
   ========================================================= */

main().catch(error => {

    console.error(error);


    const errorBox =
        document.querySelector(
            "#error"
        );


    errorBox.hidden = false;


    errorBox.textContent =
        "データを読み込めませんでした。elements.json が index.html と同じフォルダにあるか確認してください。";
});
