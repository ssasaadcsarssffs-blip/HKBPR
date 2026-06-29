document.addEventListener('DOMContentLoaded', function() {
    
    var loadingScreen = document.getElementById('loading-screen');
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
    }, 2000);

    var navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.forEach(function(item) { item.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    var devModal = document.getElementById('login-modal');
    var btnLoginTrigger = document.getElementById('btn-login-trigger');
    var closeModal = document.querySelector('.close-modal');
    var btnSubmitLogin = document.getElementById('submit-login');
    var devPanel = document.getElementById('developer-panel');
    var btnLogout = document.getElementById('btn-logout');

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);                    
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const targetUserHash = "68c1cb27f7fef48be78f3032bc13d5069f168fbc5072049e2954a20b8be354aa";
    const targetPassHash = "96dcb71c4c92d3f73ce02046ffcbe62816f1b13ec85cdfb4334360e736fe0685";

    btnLoginTrigger.addEventListener('click', function() {
        devModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        devModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == devModal) { devModal.style.display = 'none'; }
    });

    btnSubmitLogin.addEventListener('click', async function() {
        var userInp = document.getElementById('username').value;
        var passInp = document.getElementById('password').value;

        var inputUserHash = await sha256(userInp);
        var inputPassHash = await sha256(passInp);

        if (inputUserHash === targetUserHash && inputPassHash === targetPassHash) {
            alert('Akses Pengembang Diterima! Fitur editing diaktifkan.');
            devModal.style.display = 'none';
            activateDeveloperMode();
        } else {
            alert('Username atau Password Pengembang Salah!');
        }
    });

    btnLogout.addEventListener('click', function() {
        alert('Mode Edit Dimatikan.');
        window.location.reload();
    });

    var containerCategories = document.getElementById('team-categories-container');
    var selectCategory = document.getElementById('select-category');
    var btnAddCategory = document.getElementById('btn-add-category');
    var btnAddMember = document.getElementById('btn-add-member');

    function activateDeveloperMode() {
        devPanel.classList.remove('hidden');
        btnLoginTrigger.textContent = '🛠️ Admin Active';
        updateCategorySelect();
        showDeleteButtons();
    }

    function updateCategorySelect() {
        selectCategory.innerHTML = '';
        var categories = document.querySelectorAll('.team-category');
        categories.forEach(function(cat) {
            var id = cat.getAttribute('data-category-id') || cat.querySelector('h3').textContent.replace(/\s+/g, '-').toLowerCase();
            if (!cat.getAttribute('data-category-id')) {
                cat.setAttribute('data-category-id', id);
            }
            var title = cat.querySelector('h3').textContent.replace(' ❌', '');
            var opt = document.createElement('option');
            opt.value = id;
            opt.textContent = title;
            selectCategory.appendChild(opt);
        });
    }

    function showDeleteButtons() {
        var cards = document.querySelectorAll('.member-card');
        cards.forEach(function(card) {
            if (!card.querySelector('.delete-btn-active')) {
                var delBtn = document.createElement('button');
                delBtn.className = 'delete-btn-active';
                delBtn.textContent = 'Hapus Anggota ❌';
                delBtn.addEventListener('click', function() {
                    if (confirm('Hapus anggota ini dari daftar?')) { card.remove(); }
                });
                card.appendChild(delBtn);
            }
        });

        var catHeaders = document.querySelectorAll('.team-category h3');
        catHeaders.forEach(function(header) {
            if (!header.querySelector('.delete-cat-btn-active')) {
                var delCatBtn = document.createElement('button');
                delCatBtn.className = 'delete-cat-btn-active';
                delCatBtn.textContent = 'Hapus Kategori ❌';
                delCatBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (confirm('PERINGATAN: Menghapus kategori ini akan menghapus seluruh anggota di dalamnya! Lanjutkan?')) {
                        header.parentElement.remove();
                        updateCategorySelect();
                    }
                });
                header.appendChild(delCatBtn);
            }
        });
    }

    btnAddCategory.addEventListener('click', function() {
        var titleInput = document.getElementById('new-cat-title').value.trim();
        if (!titleInput) { alert('Nama kategori tidak boleh kosong!'); return; }

        var safeId = titleInput.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();

        var newCatDiv = document.createElement('div');
        newCatDiv.className = 'team-category';
        newCatDiv.setAttribute('data-category-id', safeId);

        var h3 = document.createElement('h3');
        h3.textContent = titleInput;

        var grid = document.createElement('div');
        grid.className = 'team-grid';

        newCatDiv.appendChild(h3);
        newCatDiv.appendChild(grid);
        containerCategories.appendChild(newCatDiv);

        document.getElementById('new-cat-title').value = '';
        updateCategorySelect();
        showDeleteButtons();
        alert('Kategori "' + titleInput + '" berhasil ditambahkan!');
    });

    btnAddMember.addEventListener('click', function() {
        var targetCatId = selectCategory.value;
        var nameInput = document.getElementById('new-mem-name').value.trim();
        var roleInput = document.getElementById('new-mem-role').value.trim();
        var styleInput = document.getElementById('select-mem-style').value;

        if (!nameInput || !roleInput) { alert('Nama dan Jabatan wajib diisi!'); return; }

        var targetCategory = document.querySelector('.team-category[data-category-id="'+ targetCatId +'"]');
        if (!targetCategory) { alert('Kategori tujuan tidak ditemukan!'); return; }

        var gridContainer = targetCategory.querySelector('.team-grid');

        var card = document.createElement('div');
        card.className = 'member-card ' + styleInput;

        var memInfo = document.createElement('div');
        memInfo.className = 'member-info';

        var h4 = document.createElement('h4');
        h4.textContent = nameInput;

        var span = document.createElement('span');
        span.className = 'role';
        span.textContent = roleInput;

        memInfo.appendChild(h4);
        memInfo.appendChild(span);
        card.appendChild(memInfo);
        gridContainer.appendChild(card);

        document.getElementById('new-mem-name').value = '';
        document.getElementById('new-mem-role').value = '';

        showDeleteButtons();
        alert('Sukses menambahkan ' + nameInput + ' ke dalam daftar.');
    });
});
