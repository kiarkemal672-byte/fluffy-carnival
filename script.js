/* ============================================================
   ملف الجافاسكريبت - جدول متابعة الطلاب
   script.js
   ============================================================ */

/* ================= البيانات ================= */
let students = JSON.parse(localStorage.getItem('students')) || [
  { id: 1, name: 'أحمد محمد علي',   className: 'الصف الأول',  phone: '01012345678', status: 'حاضر',  grade: 92, notes: 'طالب متفوق' },
  { id: 2, name: 'سارة أحمد حسن',   className: 'الصف الثاني', phone: '01123456789', status: 'حاضر',  grade: 78, notes: '' },
  { id: 3, name: 'محمود خالد',      className: 'الصف الأول',  phone: '01234567890', status: 'غائب',  grade: 45, notes: 'يحتاج متابعة' },
  { id: 4, name: 'فاطمة إبراهيم',   className: 'الصف الثالث', phone: '01098765432', status: 'متأخر', grade: 88, notes: '' },
  { id: 5, name: 'يوسف عبد الله',   className: 'الصف الثاني', phone: '01555555555', status: 'حاضر',  grade: 65, notes: '' }
];

/* ================= الحفظ في المتصفح ================= */
function saveToStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

/* ================= عرض الجدول ================= */
function renderStudents() {
  const search = document.getElementById('searchInput').value.trim();
  const filterClass = document.getElementById('filterClass').value;

  // فلترة الطلاب حسب البحث والصف
  const filtered = students.filter(s => {
    const matchSearch = s.name.includes(search);
    const matchClass = filterClass === '' || s.className === filterClass;
    return matchSearch && matchClass;
  });

  const tbody = document.getElementById('studentsTable');
  tbody.innerHTML = '';

  filtered.forEach((s, i) => {
    // تحديد لون شارة الحالة
    const statusClass = s.status === 'حاضر' ? 'present' : s.status === 'غائب' ? 'absent' : 'late';

    // تحديد لون الدرجة
    const gradeClass =
      s.grade >= 85 ? 'grade-high' :
      s.grade >= 65 ? 'grade-mid'  :
      s.grade >= 50 ? 'grade-low'  : 'grade-fail';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.className}</td>
      <td>${s.phone || '—'}</td>
      <td><span class="badge ${statusClass}">${s.status}</span></td>
      <td><span class="grade ${gradeClass}">${s.grade}%</span></td>
      <td>${s.notes || '—'}</td>
      <td>
        <div class="actions-btns">
          <button class="btn-sm btn-edit" onclick="openModal(${s.id})">✏️ تعديل</button>
          <button class="btn-sm btn-delete" onclick="deleteStudent(${s.id})">🗑️ حذف</button>
        </div>
      </td>`;
    tbody.appendChild(row);
  });

  // إظهار / إخفاء رسالة "لا يوجد طلاب"
  document.getElementById('emptyMsg').style.display = filtered.length ? 'none' : 'block';

  updateStats();
}

/* ================= الإحصائيات ================= */
function updateStats() {
  const total = students.length;
  const present = students.filter(s => s.status === 'حاضر').length;
  const absent = students.filter(s => s.status === 'غائب').length;
  const avg = total
    ? Math.round(students.reduce((sum, s) => sum + Number(s.grade), 0) / total)
    : 0;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('presentCount').textContent = present;
  document.getElementById('absentCount').textContent = absent;
  document.getElementById('avgGrade').textContent = avg + '%';
}

/* ================= النافذة المنبثقة ================= */
function openModal(id) {
  if (id) {
    // ✏️ وضع التعديل — تعبئة النموذج ببيانات الطالب
    const s = students.find(x => x.id === id);
    document.getElementById('modalTitle').textContent = 'تعديل بيانات الطالب';
    document.getElementById('studentId').value = s.id;
    document.getElementById('studentName').value = s.name;
    document.getElementById('studentClass').value = s.className;
    document.getElementById('studentPhone').value = s.phone;
    document.getElementById('studentStatus').value = s.status;
    document.getElementById('studentGrade').value = s.grade;
    document.getElementById('studentNotes').value = s.notes;
  } else {
    // ➕ وضع الإضافة — تفريغ النموذج
    document.getElementById('modalTitle').textContent = 'إضافة طالب جديد';
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentClass').selectedIndex = 0;
    document.getElementById('studentPhone').value = '';
    document.getElementById('studentStatus').selectedIndex = 0;
    document.getElementById('studentGrade').value = 0;
    document.getElementById('studentNotes').value = '';
  }
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// إغلاق النافذة عند الضغط خارجها
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

/* ================= حفظ (إضافة / تعديل) ================= */
function saveStudent() {
  const id = document.getElementById('studentId').value;
  const name = document.getElementById('studentName').value.trim();
  const className = document.getElementById('studentClass').value;
  const phone = document.getElementById('studentPhone').value.trim();
  const status = document.getElementById('studentStatus').value;
  const grade = Number(document.getElementById('studentGrade').value);
  const notes = document.getElementById('studentNotes').value.trim();

  // التحقق من الاسم
  if (!name) {
    alert('من فضلك اكتب اسم الطالب!');
    return;
  }

  if (id) {
    // ✏️ تعديل طالب موجود
    const s = students.find(x => x.id === Number(id));
    s.name = name;
    s.className = className;
    s.phone = phone;
    s.status = status;
    s.grade = grade;
    s.notes = notes;
  } else {
    // ➕ إضافة طالب جديد
    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.push({ id: newId, name, className, phone, status, grade, notes });
  }

  saveToStorage();
  renderStudents();
  closeModal();
}

/* ================= حذف ================= */
function deleteStudent(id) {
  if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
    students = students.filter(s => s.id !== id);
    saveToStorage();
    renderStudents();
  }
}

/* ================= بدء التشغيل ================= */
renderStudents();
