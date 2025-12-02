<template>
  <section class="page-section">
    <h1>내 계정</h1>
    <div class="card">
      <div class="card-row">
        <div>
          <strong>프로필 관리</strong>
          <p>이름, 연락처 등의 정보를 수정합니다.</p>
        </div>
        <button type="button">관리</button>
      </div>

      <div class="card-row">
        <div>
          <strong>로그아웃</strong>
          <p>안전하게 로그아웃합니다.</p>
        </div>
        <button type="button">로그아웃</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(84, 97, 119, 0.12);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-row strong {
  display: block;
  font-size: 1rem;
}

.card-row p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.card-row button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: #f1f5f9;
  cursor: pointer;
}
</style>
