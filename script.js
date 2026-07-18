var greetingEl = document.getElementById('greeting');
var clockEl    = document.getElementById('clock');

// =============================================
// SUARA - pakai file MP3 yang tersedia
// =============================================

// music-box untuk checkbox (suara ringan/lembut)
var suaraCheckboxAudio = new Audio('freesound_community-music-box-98027.mp3');
suaraCheckboxAudio.volume = 0.6;

// crumple untuk hapus (suara membuang)
var suaraHapusAudio = new Audio('freesound_community-crumple-03-40747.mp3');
suaraHapusAudio.volume = 0.6;

function suaraCheckbox() {
  suaraCheckboxAudio.currentTime = 0;
  suaraCheckboxAudio.play();
}

function suaraHapus() {
  suaraHapusAudio.currentTime = 0;
  suaraHapusAudio.play();
}

var jam = new Date().getHours();

if (jam >= 5 && jam < 12) {
  greetingEl.textContent = 'Selamat Pagi';
} else if (jam >= 12 && jam < 15) {
  greetingEl.textContent = 'Selamat Siang';
} else if (jam >= 15 && jam < 19) {
  greetingEl.textContent = 'Selamat Sore';
} else {
  greetingEl.textContent = 'Selamat Malam';
}

function updateJam() {
  var sekarang = new Date();
  var hh = String(sekarang.getHours()).padStart(2, '0');
  var mm = String(sekarang.getMinutes()).padStart(2, '0');
  var ss = String(sekarang.getSeconds()).padStart(2, '0');
  clockEl.textContent = hh + ':' + mm + ':' + ss;
}

updateJam();
setInterval(updateJam, 1000);

var sisaWaktu  = 25 * 60; 
var timerId    = null;     

var displayWaktu = document.getElementById('time');
var statusTimer  = document.getElementById('timer-status');

function tampilkanWaktu() {
  var menit = Math.floor(sisaWaktu / 60);
  var detik = sisaWaktu % 60;
  displayWaktu.textContent = menit + ':' + String(detik).padStart(2, '0');
}

// Tombol Start
document.getElementById('start').addEventListener('click', function () {
  if (timerId !== null) return;

  statusTimer.textContent = 'Sedang berjalan...';

  timerId = setInterval(function () {
    sisaWaktu--;
    tampilkanWaktu();

    if (sisaWaktu <= 0) {
      clearInterval(timerId);
      timerId = null;
      statusTimer.textContent = 'Sesi selesai. Silakan istirahat.';
    }
  }, 1000);
});

document.getElementById('stop').addEventListener('click', function () {
  clearInterval(timerId);
  timerId = null;
  statusTimer.textContent = 'Dijeda';
});

document.getElementById('reset').addEventListener('click', function () {
  clearInterval(timerId);
  timerId    = null;
  sisaWaktu  = 25 * 60;
  tampilkanWaktu();
  statusTimer.textContent = 'Siap fokus';
});

var inputTugas  = document.getElementById('todo-input');
var listTugas   = document.getElementById('todo-list');
var pesanKosong = document.getElementById('todo-empty');

function ambilTugas() {
  var data = localStorage.getItem('todos');

  if (!data) return [];

  var hasil;
  try {
    hasil = JSON.parse(data);
  } catch (e) {
    console.warn('Data localStorage tidak valid. Data direset.');
    localStorage.removeItem('todos');
    return [];
  }

  if (!Array.isArray(hasil)) {
    console.warn('Format data tidak dikenali. Data direset.');
    localStorage.removeItem('todos');
    return [];
  }

  var valid = hasil.filter(function (item) {
    return (
      item !== null &&
      typeof item === 'object' &&
      typeof item.teks === 'string' &&
      typeof item.selesai === 'boolean'
    );
  });

  return valid;
}

function simpanTugas(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function tampilkanTugas() {
  var todos = ambilTugas();

  listTugas.innerHTML = '';

  if (todos.length === 0) {
    pesanKosong.style.display = 'block';
    return;
  }

  pesanKosong.style.display = 'none';

  for (var i = 0; i < todos.length; i++) {
    (function (index) {
      var tugas = todos[index];

      var li = document.createElement('li');

      var checkbox = document.createElement('input');
      checkbox.type    = 'checkbox';
      checkbox.checked = tugas.selesai;

      checkbox.addEventListener('change', function () {
        suaraCheckbox();
        todos[index].selesai = checkbox.checked;
        simpanTugas(todos);
        tampilkanTugas();
      });

      var teks = document.createElement('span');
      teks.textContent = tugas.teks;
      if (tugas.selesai) {
        teks.className = 'selesai';
      }

      var hapus = document.createElement('button');
      hapus.textContent = 'Hapus';
      hapus.className   = 'tombol-hapus';

      hapus.addEventListener('click', function () {
        suaraHapus();
        todos.splice(index, 1);
        simpanTugas(todos);
        tampilkanTugas();
      });

      li.appendChild(checkbox);
      li.appendChild(teks);
      li.appendChild(hapus);
      listTugas.appendChild(li);
    })(i);
  }
}

function tambahTugas() {
  var teks = inputTugas.value.trim();

  if (teks === '') return;

  if (teks.length > 200) {
    alert('Tugas terlalu panjang. Maksimal 200 karakter.');
    return;
  }

  var todos = ambilTugas();

  if (todos.length >= 100) {
    alert('Daftar tugas sudah penuh. Hapus beberapa tugas terlebih dahulu.');
    return;
  }

  todos.push({ teks: teks, selesai: false });
  simpanTugas(todos);

  inputTugas.value = '';
  tampilkanTugas();
}

document.getElementById('todo-form').addEventListener('submit', function (e) {
  e.preventDefault(); 
  tambahTugas();
});

tampilkanTugas();
