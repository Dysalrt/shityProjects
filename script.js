//P0
let p0ColorInput = document.getElementById("p0-color-input");
let p0hexCodeOutput = document.getElementById("p0-hex-code");
let p0rgbCodeOutput = document.getElementById("p0-rgb-code");
func returnNum(string){
  let s1 = string.slice(0, 1);
  let s2 = string.slice(1, 2);
  let guess = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
  for (let i = 0; i < guess.length; i++){
    if (guess[i] == s1){
      s1 = 16*i;
    }
    if (guess[i] == s2){
      s2 = i;
    }
  }
  let finalvalue = s1+s2
  return finalvalue;
}
document.getElementById("p0-submit").onclick = () => {
  console.log(p0ColorInput.value);//for my dumbass who doesn't even know what does the input store, such a stupid thing
  p0hexCodeOuptut.innerHTML = p0ColorInput.value;
  let r = returnNum(p0ColorInput.value.slice(1, 3));
  let b = returnNum(p0ColorInput.value.slice(3, 5);
  let g = returnNum(p0ColorInput.value.slice(5, 7));
  p0rgbCodeOutput.innerHTML = toString(r) + toString(b) + toString(g);//I knowi could've simplify this but remember, this is a shitty project, no one gives a 
}

//P1
(function () {
  // ---------- Шаблоны для теории ----------

  function makeExampleRow() {
    const row = document.createElement("div");
    row.className = "p1-example-row";
    row.innerHTML = `
      <input type="text" class="p1-ex-word" placeholder="Слово (Arcon)">
      <input type="text" class="p1-ex-ipa" placeholder="IPA / пометка">
      <input type="text" class="p1-ex-translation" placeholder="Перевод">
      <button class="p1-btn-remove" type="button">✕</button>
    `;
    row.querySelector(".p1-btn-remove").onclick = () => row.remove();
    return row;
  }

  function makeTheoryCard() {
    const card = document.createElement("div");
    card.className = "p1-card p1-theory-card";
    card.innerHTML = `
      <div class="p1-card-header">
        <strong>Карточка теории</strong>
        <button class="p1-btn-remove" type="button">Удалить карточку</button>
      </div>
      <label>Заголовок</label>
      <input type="text" class="p1-theory-title" placeholder="Например: Множественное число">
      <label>Текст объяснения</label>
      <textarea class="p1-theory-body" placeholder="Объясни правило своими словами..."></textarea>
      <label>Примеры</label>
      <div class="p1-example-list"></div>
      <button class="p1-btn-ghost p1-btn-small p1-add-example-btn" type="button">+ Пример</button>
    `;
    card.querySelector(".p1-btn-remove").onclick = () => card.remove();
    card.querySelector(".p1-add-example-btn").onclick = () => {
      card.querySelector(".p1-example-list").appendChild(makeExampleRow());
    };
    // сразу одна пустая строка примера для удобства
    card.querySelector(".p1-example-list").appendChild(makeExampleRow());
    return card;
  }

  document.getElementById("p1-add-theory-btn").onclick = () => {
    document.getElementById("p1-theory-list").appendChild(makeTheoryCard());
  };

  // ---------- Шаблоны для упражнений ----------

  function makeOptionRow(container) {
    const row = document.createElement("div");
    row.className = "p1-row-inline";
    row.innerHTML = `
      <input type="text" class="p1-choice-option" placeholder="Вариант ответа">
      <button class="p1-btn-remove" type="button">✕</button>
    `;
    row.querySelector(".p1-btn-remove").onclick = () => row.remove();
    container.appendChild(row);
  }

  function makePairRow(container) {
    const row = document.createElement("div");
    row.className = "p1-pair-row";
    row.innerHTML = `
      <input type="text" class="p1-match-word" placeholder="Слово (Arcon)">
      <input type="text" class="p1-match-translation" placeholder="Перевод">
      <button class="p1-btn-remove" type="button">✕</button>
    `;
    row.querySelector(".p1-btn-remove").onclick = () => row.remove();
    container.appendChild(row);
  }

  function makeAnswerRow(container) {
    const row = document.createElement("div");
    row.className = "p1-row-inline";
    row.innerHTML = `
      <input type="text" class="p1-write-answer" placeholder="Правильный ответ (можно несколько строк)">
      <button class="p1-btn-remove" type="button">✕</button>
    `;
    row.querySelector(".p1-btn-remove").onclick = () => row.remove();
    container.appendChild(row);
  }

  function renderChoiceFields(fieldsEl) {
    fieldsEl.innerHTML = `
      <label>Вопрос</label>
      <textarea class="p1-choice-prompt" placeholder="Как будет «Привет»?"></textarea>
      <label>IPA-подсказка (необязательно)</label>
      <input type="text" class="p1-choice-ipahint" placeholder="[ˈkji.tɛ]">
      <label>Варианты ответа</label>
      <div class="p1-choice-options"></div>
      <button class="p1-btn-ghost p1-btn-small p1-add-option-btn" type="button">+ Вариант</button>
      <label>Правильный ответ (должен точно совпасть с одним из вариантов)</label>
      <input type="text" class="p1-choice-answer" placeholder="Qite">
    `;
    const optionsList = fieldsEl.querySelector(".p1-choice-options");
    fieldsEl.querySelector(".p1-add-option-btn").onclick = () => makeOptionRow(optionsList);
    makeOptionRow(optionsList);
    makeOptionRow(optionsList);
  }

  function renderMatchFields(fieldsEl) {
    fieldsEl.innerHTML = `
      <label>Пары для сопоставления</label>
      <div class="p1-match-pairs"></div>
      <button class="p1-btn-ghost p1-btn-small p1-add-pair-btn" type="button">+ Пара</button>
    `;
    const pairsList = fieldsEl.querySelector(".p1-match-pairs");
    fieldsEl.querySelector(".p1-add-pair-btn").onclick = () => makePairRow(pairsList);
    makePairRow(pairsList);
    makePairRow(pairsList);
  }

  function renderWriteFields(fieldsEl) {
    fieldsEl.innerHTML = `
      <label>Задание (можно с переносом строки — например фраза на новой строке)</label>
      <textarea class="p1-write-prompt" placeholder="Переведи фразу:&#10;Qo ede vū?"></textarea>
      <label>IPA-подсказка (необязательно)</label>
      <input type="text" class="p1-write-ipahint" placeholder="">
      <label>Правильные ответы (все варианты, которые нужно засчитать)</label>
      <div class="p1-write-answers"></div>
      <button class="p1-btn-ghost p1-btn-small p1-add-answer-btn" type="button">+ Ответ</button>
    `;
    const answersList = fieldsEl.querySelector(".p1-write-answers");
    fieldsEl.querySelector(".p1-add-answer-btn").onclick = () => makeAnswerRow(answersList);
    makeAnswerRow(answersList);
  }

  function makeExerciseItem() {
    const item = document.createElement("div");
    item.className = "p1-card p1-exercise-item";
    item.innerHTML = `
      <div class="p1-card-header">
        <strong>Упражнение</strong>
        <button class="p1-btn-remove" type="button">Удалить упражнение</button>
      </div>
      <label>Тип задания</label>
      <select class="p1-ex-type-select">
        <option value="choice">choice — выбор варианта</option>
        <option value="match">match — сопоставление пар</option>
        <option value="write">write — открытый ответ</option>
      </select>
      <div class="p1-ex-fields"></div>
    `;
    item.querySelector(".p1-btn-remove").onclick = () => item.remove();

    const fieldsEl = item.querySelector(".p1-ex-fields");
    const typeSelect = item.querySelector(".p1-ex-type-select");

    function renderForType() {
      if (typeSelect.value === "choice") renderChoiceFields(fieldsEl);
      else if (typeSelect.value === "match") renderMatchFields(fieldsEl);
      else if (typeSelect.value === "write") renderWriteFields(fieldsEl);
    }
    typeSelect.onchange = renderForType;
    renderForType();

    return item;
  }

  document.getElementById("p1-add-exercise-btn").onclick = () => {
    document.getElementById("p1-exercises-list").appendChild(makeExerciseItem());
  };

  // ---------- Сборка JSON ----------

  function buildLesson() {
    const lesson = {
      id: document.getElementById("p1-id-input").value.trim(),
      title: document.getElementById("p1-title-input").value.trim(),
      xp: parseInt(document.getElementById("p1-xp-input").value, 10) || 10,
      theory: [],
      exercises: [],
    };

    document.querySelectorAll("#p1-theory-list .p1-theory-card").forEach((card) => {
      const title = card.querySelector(".p1-theory-title").value.trim();
      const body = card.querySelector(".p1-theory-body").value.trim();
      const examples = [];
      card.querySelectorAll(".p1-example-row").forEach((row) => {
        const word = row.querySelector(".p1-ex-word").value.trim();
        const ipa = row.querySelector(".p1-ex-ipa").value.trim();
        const translation = row.querySelector(".p1-ex-translation").value.trim();
        if (word) examples.push({ word, ipa, translation });
      });
      if (title || body || examples.length) {
        lesson.theory.push({ title, body, examples });
      }
    });

    document.querySelectorAll("#p1-exercises-list .p1-exercise-item").forEach((item) => {
      const type = item.querySelector(".p1-ex-type-select").value;

      if (type === "choice") {
        const prompt = item.querySelector(".p1-choice-prompt").value.trim();
        const ipaHint = item.querySelector(".p1-choice-ipahint").value.trim() || null;
        const options = [...item.querySelectorAll(".p1-choice-option")]
          .map((i) => i.value.trim())
          .filter((v) => v);
        const answer = item.querySelector(".p1-choice-answer").value.trim();
        if (prompt && options.length) {
          lesson.exercises.push({ type: "choice", prompt, ipaHint, options, answer });
        }
      } else if (type === "match") {
        const pairs = [...item.querySelectorAll(".p1-pair-row")]
          .map((row) => [
            row.querySelector(".p1-match-word").value.trim(),
            row.querySelector(".p1-match-translation").value.trim(),
          ])
          .filter((p) => p[0] && p[1]);
        if (pairs.length) {
          lesson.exercises.push({ type: "match", pairs });
        }
      } else if (type === "write") {
        const prompt = item.querySelector(".p1-write-prompt").value.trim();
        const ipaHint = item.querySelector(".p1-write-ipahint").value.trim() || null;
        const answers = [...item.querySelectorAll(".p1-write-answer")]
          .map((i) => i.value.trim())
          .filter((v) => v);
        if (prompt && answers.length) {
          lesson.exercises.push({ type: "write", prompt, ipaHint, answers });
        }
      }
    });

    return lesson;
  }

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById("p1-create-btn").onclick = () => {
    const lesson = buildLesson();
    if (!lesson.id) {
      alert("Заполни ID урока — без него не получится назвать файл.");
      return;
    }
    const json = JSON.stringify(lesson, null, 2);
    const output = document.getElementById("p1-json-output");
    output.value = json;
    document.getElementById("p1-output-hint").textContent =
      `Готово — файл "${lesson.id}.json" скачался. Также можешь скопировать текст ниже.`;
    downloadFile(lesson.id + ".json", json);
  };

  document.getElementById("p1-copy-btn").onclick = () => {
    const output = document.getElementById("p1-json-output");
    if (!output.value) return;
    output.select();
    document.execCommand("copy");
  };

  document.getElementById("p1-clear-btn").onclick = () => {
    if (!confirm("Точно сбросить весь урок? Все введённые данные пропадут.")) return;
    document.getElementById("p1-id-input").value = "";
    document.getElementById("p1-title-input").value = "";
    document.getElementById("p1-xp-input").value = "10";
    document.getElementById("p1-theory-list").innerHTML = "";
    document.getElementById("p1-exercises-list").innerHTML = "";
    document.getElementById("p1-json-output").value = "";
    document.getElementById("p1-output-hint").textContent = "Нажми «Create lesson», чтобы собрать JSON.";
  };

  // Стартовое состояние — одна карточка теории и одно упражнение, чтобы было видно, с чего начать
  document.getElementById("p1-theory-list").appendChild(makeTheoryCard());
  document.getElementById("p1-exercises-list").appendChild(makeExerciseItem());
})();
