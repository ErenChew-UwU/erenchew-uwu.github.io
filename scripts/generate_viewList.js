const listEl = document.getElementById('videoList');
const viewer = document.getElementById('viewer');
const viewList = window.viewListJson;

// ====== 读取 JSON 并生成列表 ======
fetch(viewList)
  .then(res => res.json())
  .then(data => {
    const items = data.content;

    // 1) 按 date 从新到旧排序
    items.sort((a, b) => b.date.localeCompare(a.date));

    items.forEach(itemData => {
      const item = document.createElement('div');
      item.className = 'video-item';

      // === 取 type 前缀（video / text） ===
      const typePrefix = itemData.type.split('-')[0];   // video 或 text
      const typeFull = itemData.type;                  // video-youtube, text-only...

      // 存到 dataset，方便点击时判断
      item.dataset.type = typeFull;

      // 封面处理
      let coverUrl = itemData.coverImg;
      if (typeFull === 'video-youtube' && !coverUrl) {
        coverUrl = `https://img.youtube.com/vi/${itemData.source}/hqdefault.jpg`;
      }

      // 多行描述
      const descLines = Array.isArray(itemData.descripsion)
        ? itemData.descripsion
        : [itemData.descripsion];

      const descHTML = descLines
        .map(line => `<div class="video-desc">${line}</div>`)
        .join('');

      // 生成卡片 HTML（统一样式）
      item.innerHTML = `
        <div class="video-cover" style="background-image:url('${coverUrl}')"></div>
        <div class="video-info-overlay">
          <div class="video-title">${itemData.title}</div>
          ${descHTML}
        </div>
        <div class="video-info-wrapper">
          <div class="video-info">
            <div class="video-title">${itemData.title}</div>
            ${descHTML}
          </div>
        </div>
        <div class="arrow">›</div>
      `;

      // 额外存 source / location
      item.dataset.source = JSON.stringify(itemData.source);
      if (itemData.location) item.dataset.location = itemData.location;

      listEl.appendChild(item);
    });
  })
  .catch(err => {
    console.error('Failed to load json', err);
    viewer.innerHTML =
      '<div class="placeholder" style="color:red;font-size: 80px;">Failed to load JSON file</div>';
  });

// ====== 点击卡片展示内容 ======
listEl.addEventListener('click', (e) => {
  const item = e.target.closest('.video-item');
  if (!item) return;

  viewer.innerHTML = '';
  const type = item.dataset.type;
  const source = JSON.parse(item.dataset.source);

  let element;

  // -------- 视频类 ----------
  if (type === 'video-youtube') {
    element = document.createElement('iframe');
    element.src = `https://www.youtube.com/embed/${source}?autoplay=1&rel=0`;
    element.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    element.allowFullscreen = true;
  }

  else if (type === 'video-local') {
    element = document.createElement('video');
    element.src = source;
    element.controls = true;
    element.autoplay = true;
    element.style.width = '100%';
    element.style.height = '100%';
  }

  // -------- 文字页面：text-only ----------
  else if (type === 'text-only' || type === 'text-web') {
    const container = document.createElement('div');
    container.className = 'text-view';

    // 背景
    container.style.backgroundImage = `url('${source.background}')`;

    // 遮罩
    const overlay = document.createElement('div');
    overlay.className = 'text-view-overlay';
    
    // 标题
    const title = document.createElement('div');
    title.className = 'text-title';
    title.textContent = item.querySelector('.video-title').textContent;
    
    // 描述
    const desc = document.createElement('div');
    desc.className = 'text-desc';
    // 只抓 video-cover 那一份描述，並「直接複製 HTML」
    const coverDesc = item.querySelector('.video-info-overlay').querySelectorAll('.video-desc');
    
    desc.innerHTML = coverDesc && coverDesc.length
    ? Array.from(coverDesc)
    .map(d => d.outerHTML)   // 🔹 關鍵：複製完整 HTML 結構
    .join('')
    : '';
    
    // 正文（可滚动）
    const textsBox = document.createElement('div');
    textsBox.className = 'text-body';
    textsBox.innerHTML = source.texts.map(t => `<p>${t}</p>`).join('');
    
    container.appendChild(overlay);
    container.appendChild(title);
    container.appendChild(desc);
    container.appendChild(textsBox);

    // -------- text-web：右下角按钮 ----------
    if (type === 'text-web') {
      const btn = document.createElement('a');
      btn.className = 'text-link-btn';
      btn.textContent = 'View Page';
      btn.href = item.dataset.location;
      container.appendChild(btn);
    }

    element = container;
  }

  viewer.appendChild(element);

  document.querySelectorAll('.video-item').forEach(el =>
    el.classList.remove('active')
  );
  item.classList.add('active');
});



// JSON 例子
// {"date": "20220317", "type": "video-youtube", "title": "Game Guide - The Battle Cats", "descripsion": ["17 March 2022","This is a line of descripsion"], "source": "Jw09Zp5JaS8", "coverImg": ""}
// {"date": "20220317", "type": "video-local", "title": "Game Guide - The Battle Cats", "descripsion": ["17 March 2022","This is a line of descripsion"], "source": "assets/video.mp4", "coverImg": "asstes/videoCover.png"}
// {"date": "20220317", "type": "text-only", "title": "Game Guide - The Battle Cats", "descripsion": ["17 March 2022","This is a line of descripsion"], "source": {"background": "assets/logo.png", "texts": ["This is a line of words.","This is a line of words."]}, "coverImg": "assets/logo.png"}
// {"date": "20220317", "type": "text-web", "title": "Game Guide - The Battle Cats", "descripsion": ["17 March 2022","This is a line of descripsion"], "source": {"background": "assets/logo.png", "texts": ["This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words.","This is a line of words."]}, "coverImg": "assets/logo.png", "location": "pages/uwu/index.html"}