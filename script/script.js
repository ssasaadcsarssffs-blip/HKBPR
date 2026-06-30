document.addEventListener('DOMContentLoaded', function() {
    
    var loadingScreen = document.getElementById('loading-screen');
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
    }, 1500);

    var devModal = document.getElementById('login-modal');
    var btnLoginTrigger = document.getElementById('btn-login-trigger');
    var closeModal = document.querySelector('.close-modal');
    var btnSubmitLogin = document.getElementById('submit-login');
    var devPanel = document.getElementById('developer-panel');
    var btnLogout = document.getElementById('btn-logout');
    var containerCategories = document.getElementById('team-categories-container');
    var selectCategory = document.getElementById('select-category');
    var btnAddCategory = document.getElementById('btn-add-category');
    var btnAddMember = document.getElementById('btn-add-member');

    var isDevMode = false;

    var defaultData = [
        {
            id: "clergy",
            title: "Pimpinan & Pendeta (Clergy)",
            members: [
                { name: "Pdt. David Simarmata, M.Th", role: "Ephorus dan Pengurus HKBPR", style: "highlight" },
                { name: "Pdt. Henry Auden Azen Mountbatten Crosby M.Th, S.Fil., S.S, S.Psi.", role: "Founder RCC dan Pendeta", style: "" },
                { name: "Pdt. Nihon Sinaga", role: "Pendeta dan Pengembang Website HKBPR", style: "" },
                { name: "Pdt. Frederick Matthew", role: "Pendeta", style: "" },
                { name: "Pdt. Domi Silalahi", role: "Pendeta", style: "" }
            ]
        },
        {
            id: "majelis",
            title: "Majelis Tahbisan (Sintua & Diakones)",
            members: [
                { name: "St. Raymond Rajagukguk", role: "Developer dan Sintua", style: "highlight" },
                { name: "St. Rendy Siagian", role: "Sintua, Pemimpin Cyber Security & Tim Pengembang Website", style: "highlight" },
                { name: "St. Abraham Purba", role: "Sintua & Ketua Tim Disiplin", style: "highlight" },
                { name: "St. Rendy Adicipto", role: "Sintua dan Secretariat Huria", style: "" },
                { name: "St. Morieno Hutagalung", role: "Sintua", style: "" },
                { name: "St. Heber Pasaribu", role: "Sintua", style: "" },
                { name: "Diak. Elsa Nababan", role: "Diakones", style: "" }
            ]
        },
        {
            id: "candidacy",
            title: "Calon Pelayan (Candidacy)",
            members: [
                { name: "CPdt. Eufratha Sihaloho S.Th", role: "Calon Pendeta", style: "candidate" },
                { name: "CPdt. Dr. Joel Alfian Sitinjak", role: "Calon Pendeta", style: "candidate" },
                { name: "CPdt. Reinhard Situmorang", role: "Calon Pendeta", style: "candidate" },
                { name: "Cst. Nonie Tambunan", role: "Calon Sintua", style: "candidate" },
                { name: "CGr. Andra Nichole Sianturi", role: "Calon Guru Huria", style: "candidate" }
            ]
        },
        {
            id: "laity",
            title: "Saudara & Jemaat (Laity)",
            members: [
                { name: "Lucas VL. Nababan, D.Min", role: "Saudara / Saudagar", style: "laity" }
            ]
        }
    ];

    var currentData = JSON.parse(localStorage.getItem('hkbpr_team_data')) || defaultData;

    function autoSaveData() {
        localStorage.setItem('hkbpr_team_data', JSON.stringify(currentData));
    }

    function renderDOM() {
        if (!containerCategories) return; 
        containerCategories.innerHTML = '';
        
        currentData.forEach(function(cat) {
            var catDiv = document.createElement('div');
            catDiv.className = 'team-category';
            catDiv.setAttribute('data-category-id', cat.id);

            var h3 = document.createElement('h3');
            h3.textContent = cat.title;

            if (isDevMode) {
                var delCatBtn = document.createElement('button');
                delCatBtn.className = 'delete-cat-btn-active';
                delCatBtn.textContent = 'Hapus Kategori ❌';
                delCatBtn.style.marginLeft = '15px';
                delCatBtn.addEventListener('click', function() {
                    if (confirm('Hapus seluruh kategori "' + cat.title + '"?')) {
                        currentData = currentData.filter(item => item.id !== cat.id);
                        autoSaveData();
                        renderDOM();
                        updateCategorySelect();
                    }
                });
                h3.appendChild(delCatBtn);
            }

            var grid = document.createElement('div');
            grid.className = 'team-grid';

            cat.members.forEach(function(member, mIdx) {
                var card = document.createElement('div');
                card.className = 'member-card ' + member.style;

                var info = document.createElement('div');
                info.className = 'member-info';

                var h4 = document.createElement('h4');
                h4.textContent = member.name;

                var span = document.createElement('span');
                span.className = 'role';
                span.textContent = member.role;

                info.appendChild(h4);
                info.appendChild(span);
                card.appendChild(info);

                if (isDevMode) {
                    var delBtn = document.createElement('button');
                    delBtn.className = 'delete-btn-active';
                    delBtn.textContent = 'Hapus Anggota ❌';
                    delBtn.addEventListener('click', function() {
                        cat.members.splice(mIdx, 1);
                        autoSaveData();
                        renderDOM();
                    });
                    card.appendChild(delBtn);
                }

                grid.appendChild(card);
            });

            catDiv.appendChild(h3);
            catDiv.appendChild(grid);
            containerCategories.appendChild(catDiv);
        });
    }

    function updateCategorySelect() {
        if (!selectCategory) return;
        selectCategory.innerHTML = '';
        currentData.forEach(function(cat) {
            var opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.title;
            selectCategory.appendChild(opt);
        });
    }

    renderDOM();

    if (btnLoginTrigger && devModal) {
        btnLoginTrigger.addEventListener('click', function() {
            devModal.style.display = 'flex';
        });
    }

    if (closeModal && devModal) {
        closeModal.addEventListener('click', function() {
            devModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (devModal && e.target == devModal) { devModal.style.display = 'none'; }
    });

    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener('click', function() {
            var userInp = document.querySelector('#login-modal input[id="username"]').value.trim();
            var passInp = document.querySelector('#login-modal input[id="password"]').value.trim();

            if (userInp === 'DeveloperHKBPR' && passInp === 'DevHKBPRwebsite') {
                alert('LOGIN BERHASIL! Fitur Auto-Save Aktif.');
                if (devModal) devModal.style.display = 'none';
                isDevMode = true;
                if (devPanel) devPanel.classList.remove('hidden');
                if (btnLoginTrigger) btnLoginTrigger.textContent = '🛠️ Admin Active';
                
                renderDOM();
                updateCategorySelect();
            } else {
                alert('Username atau Password Pengembang Salah!');
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            alert('Mode Edit Dimatikan.');
            window.location.reload();
        });
    }

    if (btnAddCategory) {
        btnAddCategory.addEventListener('click', function() {
            var titleInput = document.getElementById('new-cat-title').value.trim();
            if (!titleInput) { alert('Nama kategori wajib diisi!'); return; }

            var safeId = titleInput.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
            
            currentData.push({
                id: safeId,
                title: titleInput,
                members: []
            });

            document.getElementById('new-cat-title').value = '';
            autoSaveData();
            renderDOM();
            updateCategorySelect();
            alert('Kategori baru berhasil ditambahkan & Otomatis Ter-commit!');
        });
    }

    if (btnAddMember) {
        btnAddMember.addEventListener('click', function() {
            var targetCatId = selectCategory.value;
            var nameInput = document.getElementById('new-mem-name').value.trim();
            var roleInput = document.getElementById('new-mem-role').value.trim();
            var styleInput = document.getElementById('select-mem-style').value;

            if (!nameInput || !roleInput) { alert('Nama dan Jabatan wajib diisi!'); return; }

            var targetCat = currentData.find(item => item.id === targetCatId);
            if (targetCat) {
                targetCat.members.push({
                    name: nameInput,
                    role: roleInput,
                    style: styleInput
                });

                document.getElementById('new-mem-name').value = '';
                document.getElementById('new-mem-role').value = '';
                autoSaveData();
                renderDOM();
                alert('Anggota baru berhasil ditambahkan & Otomatis Ter-commit!');
            }
        });
    }
});
