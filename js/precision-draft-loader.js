'use strict';
/*
 * Lexia optional editorial draft layer, Nov 2026.
 * These are NOT independently verified dictionary entries. Original EJDict
 * source/short gloss and existing curated 42 words are preserved.
 */
(function lexiaPrecisionDraftLayer() {
  const DRAFT = Object.create(null);
  const loadState = { totalPacks: 20, loadedPacks: 0, failedPacks: [],
    expectedWords: 1545, loadedWords: 0, ready: false };
  // Read-only diagnostics for the short-gloss overlay and the data panel.
  window.LEXIA_DRAFT_API = Object.freeze({
    has: word => Object.hasOwn(DRAFT, clean(word)),
    status: () => ({
      totalPacks: loadState.totalPacks,
      loadedPacks: loadState.loadedPacks,
      failedPacks: loadState.failedPacks.slice(),
      expectedWords: loadState.expectedWords,
      loadedWords: loadState.loadedWords,
      ready: loadState.ready
    })
  });
  let draftWords = 0;
  let draftSenses = 0;
  let draftExamples = 0;
  const files = [
    './editorial/precision-draft/2026-11-10-a-m.json',
    './editorial/precision-draft/2026-11-10-n-z.json',
    './editorial/precision-draft/2026-11-10-next300-a-i.json',
    './editorial/precision-draft/2026-11-10-next300-j-p.json',
    './editorial/precision-draft/2026-11-10-next300-q-z.json',
    './editorial/precision-draft/2026-11-10-next500-a-e.json',
    './editorial/precision-draft/2026-11-10-next500-f-j.json',
    './editorial/precision-draft/2026-11-10-next500-k-o.json',
    './editorial/precision-draft/2026-11-10-next500-p-t.json',
    './editorial/precision-draft/2026-11-10-next500-u-z.json',
    './editorial/precision-draft/2026-11-10-next500-v2-a-e.json',
    './editorial/precision-draft/2026-11-10-next500-v2-f-j.json',
    './editorial/precision-draft/2026-11-10-next500-v2-k-o.json',
    './editorial/precision-draft/2026-11-10-next500-v2-p-t.json',
    './editorial/precision-draft/2026-11-10-next500-v2-u-z.json',
    './editorial/precision-draft/2026-11-10-next1000-partial100-a-e.json',
    './editorial/precision-draft/2026-11-10-next1000-partial100-f-j.json',
    './editorial/precision-draft/2026-11-10-next1000-partial100-k-o.json',
    './editorial/precision-draft/2026-11-10-next1000-partial100-p-t.json',
    './editorial/precision-draft/2026-11-10-next1000-partial100-u-z.json'
  ];
  const safe = value => escapeHTML(String(value == null ? '' : value));

  const style = document.createElement('style');
  style.textContent = [
    '.lex-draft{border:1px solid #b4c8db;border-radius:14px;padding:18px;margin:0 0 24px;background:#f7faff;overflow-wrap:anywhere}',
    '.lex-draft h3{font-size:17px;margin:0 0 6px}',
    '.lex-draft-status{color:#455a71;font-size:12px;margin:0 0 12px}',
    '.lex-draft-guide{font-size:13px;margin:8px 0 14px;color:#354c63}',
    '.lex-draft-group{margin:16px 0 8px;padding-top:12px;border-top:1px solid #d9e2ec}',
    '.lex-draft-pos{font-weight:700;margin:0 0 8px}',
    '.lex-draft-sense{padding:10px 0;border-bottom:1px dotted #c8d5e4}',
    '.lex-draft-meaning{font-size:18px;font-weight:700;margin-bottom:3px}',
    '.lex-draft-pattern{font-size:14px;margin-bottom:5px;color:#334e68}',
    '.lex-draft-tip{font-size:13px;color:#455a71;margin:0 0 7px}',
    '.lex-draft-example{margin:0 0 6px;padding:9px 12px;border-radius:8px;background:rgba(255,255,255,.9)}',
    '.lex-draft-example .en{font-weight:600;line-height:1.65}',
    '.lex-draft-example .ja{font-size:13px;color:#52606d;line-height:1.65}',
    '.lex-draft-limit{font-size:12px;color:#56677b;margin-top:12px;line-height:1.65}',
    '.lex-draft-load-warning{border:1px solid #c49c66;background:#fff9ef;padding:12px 14px;border-radius:10px;color:#694820;margin-bottom:14px;font-size:13px;line-height:1.65}'
  ].join('\n');
  document.head.appendChild(style);

  function validatedPack(pack) {
    if (!pack || pack.schema_version !== 1 ||
        pack.kind !== 'lexia_precision_editorial_draft' ||
        pack.review_status !== 'AI編集・独立の辞書校閲待ち' ||
        !Array.isArray(pack.entries) || pack.entries.length !== pack.entries_count)
      throw new Error('Precision draft pack metadata mismatch');
    let senses = 0;
    for (const entry of pack.entries) {
      if (!entry || !/^[a-z][a-z -]{1,60}$/.test(entry.word) ||
          typeof entry.guide !== 'string' ||
          entry.review_status !== 'AI編集原稿・独立語義校閲待ち' ||
          !Array.isArray(entry.groups) || !entry.groups.length ||
          Object.hasOwn(DRAFT, entry.word) || Object.hasOwn(CURATED, entry.word))
        throw new Error('Precision draft headword/overlap mismatch');
      for (const g of entry.groups) {
        if (!['名詞','自動詞','他動詞','形容詞','副詞','前置詞','助動詞','序数詞','接続詞','代名詞','限定詞','間投詞'].includes(g.pos) ||
            !Array.isArray(g.senses) || !g.senses.length)
          throw new Error('Precision draft POS mismatch: ' + entry.word);
        for (const sense of g.senses) {
          if (!sense.jp || !sense.pattern || !sense.tip ||
              !Array.isArray(sense.examples) || !sense.examples.length)
            throw new Error('Precision draft sense incomplete: ' + entry.word);
          for (const example of sense.examples)
            if (!example.en || !example.ja)
              throw new Error('Precision draft bilingual example incomplete');
          senses++;
        }
      }
    }
    if (senses !== pack.senses_count) throw new Error('Precision draft sense total mismatch');
    return pack;
  }

  const previousDetail = renderDetail;
  renderDetail = function() {
    previousDetail();
    const key = clean(state.current);
    const entry = DRAFT[key];
    const body = el('detail')?.querySelector('.detail-body');
    if (!body || Object.hasOwn(CURATED, key)) return;
    if (!entry) {
      // Do not silently present a short gloss as if no precision draft exists
      // when one or more editorial packs could not be loaded.
      if (loadState.ready && loadState.failedPacks.length) {
        body.insertAdjacentHTML('afterbegin',
          '<div class="lex-draft-load-warning" role="status">一部の精密編集データを読み込めませんでした（' +
          loadState.loadedPacks + '/' + loadState.totalPacks +
          '分冊）。この語の精密原稿が表示されない可能性があります。通信状態を確認して再読み込みしてください。</div>');
      }
      return;
    }
    // The original EJDict full entry below is retained. Hide only the older
    // one-line/primary display for an entry now covered by an editorial draft.
    body.querySelectorAll('.lex-primary').forEach(node => node.remove());
    body.querySelector('.lex-brief-warning')?.remove();
    body.querySelector('.lex-quick')?.remove();
    let html = '<section class="lex-draft" aria-label="用法別編集原稿">';
    html += '<h3>意味と使い分け</h3>';
    html += '<div class="lex-draft-status">AI編集原稿・独立の語義校閲待ち</div>';
    html += '<p class="lex-draft-guide">' + safe(entry.guide) + '</p>';
    for (const group of entry.groups) {
      html += '<div class="lex-draft-group"><div class="lex-draft-pos">' + safe(group.pos) + '</div>';
      for (const sense of group.senses) {
        html += '<div class="lex-draft-sense">';
        html += '<div class="lex-draft-meaning">' + safe(sense.jp) + '</div>';
        html += '<div class="lex-draft-pattern" lang="en">' + safe(sense.pattern) + '</div>';
        html += '<div class="lex-draft-tip">' + safe(sense.tip) + '</div>';
        for (const example of sense.examples) {
          html += '<div class="lex-draft-example"><div class="en" lang="en">' +
                  safe(example.en) + '</div><div class="ja">' +
                  safe(example.ja) + '</div></div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '<p class="lex-draft-limit">AIによる用法別編集原稿です。対訳例文は制作原稿であり、独立した語義校閲・実地検証はまだ完了していません。原資料も参照してください。</p>';
    html += '</section>';
    body.insertAdjacentHTML('afterbegin', html);
  };

  const previousResults = renderResults;
  renderResults = function() {
    previousResults();
    for (const row of el('results')?.querySelectorAll('[data-select]') || []) {
      const key = clean(row.dataset.select), entry = DRAFT[key];
      if (!entry || Object.hasOwn(CURATED,key)) continue;
      const label = row.querySelector('.result-meaning');
      if (label) label.textContent = entry.groups[0].pos + ' · ' +
        entry.groups[0].senses[0].jp + ' · 用法別AI編集・未校閲';
    }
  };

  const previousData = renderData;
  renderData = function() {
    previousData();
    const panel = el('alt-view')?.querySelector('.alt-panel');
    if (!panel || (!draftWords && !loadState.ready)) return;
    panel.insertAdjacentHTML('afterbegin',
      '<div class="lex-primary-stats"><strong>用法別AI編集原稿：' +
      draftWords.toLocaleString('ja-JP') + '語・' +
      draftSenses.toLocaleString('ja-JP') + '語義・' +
      draftExamples.toLocaleString('ja-JP') + '対訳例文</strong><br>' +
      'データ分冊の読み込み：' + loadState.loadedPacks + '/' + loadState.totalPacks + '。' +
      (loadState.failedPacks.length ? '一部読み込み失敗（' + loadState.failedPacks.length + '件）。接続を確認し再読み込みしてください。' : '読み込み完了。') +
      ' 独立校閲待ちの編集原稿であり、既存の精密42語の校了数とは分けて集計しています。</div>');
  };

  const previousCopy = copyCurrent;
  copyCurrent = async function() {
    const key = clean(state.current), entry = DRAFT[key];
    if (!entry || Object.hasOwn(CURATED,key)) return previousCopy();
    const lines = [key, 'AI編集原稿・独立の語義校閲待ち'];
    for (const group of entry.groups) {
      lines.push('【' + group.pos + '】');
      for (const sense of group.senses) {
        lines.push(sense.jp + ' / ' + sense.pattern + ' / ' + sense.tip);
        for (const example of sense.examples) lines.push(example.en, example.ja);
      }
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      showToast('用法別編集原稿をコピーしました');
    } catch {
      showToast('コピーできませんでした');
    }
  };

  async function readPack(path) {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(path, {cache: attempt ? 'reload' : 'no-cache'});
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const pack = await response.json();
        validatedPack(pack);
        return pack;
      } catch (err) {
        lastError = err;
      }
    }
    throw new Error(path + ': ' + (lastError?.message || String(lastError)));
  }

  async function load() {
    // Individual packs are independent. A missing or stale deploy must not
    // silently disable every already-available authored entry.
    const results = await Promise.allSettled(files.map(readPack));
    const unique = new Set();
    const goodPacks = [];
    const badPacks = [];
    let words = 0, senses = 0, examples = 0;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status !== 'fulfilled') {
        badPacks.push({path: files[i], error: String(result.reason)});
        continue;
      }
      const pack = result.value;
      const packWords = pack.entries.map(entry => entry.word);
      if (packWords.some(word => unique.has(word) ||
                                packWords.indexOf(word) !== packWords.lastIndexOf(word))) {
        badPacks.push({path: files[i], error: 'Duplicate editorial headword'});
        continue;
      }
      goodPacks.push(pack);
      for (const entry of pack.entries) {
        unique.add(entry.word);
        words++;
        for (const group of entry.groups) for (const sense of group.senses) {
          senses++;
          examples += sense.examples.length;
        }
      }
    }
    for (const pack of goodPacks)
      for (const entry of pack.entries) DRAFT[entry.word] = Object.freeze(entry);
    draftWords = words; draftSenses = senses; draftExamples = examples;
    loadState.loadedPacks = goodPacks.length;
    loadState.failedPacks = badPacks;
    loadState.loadedWords = words;
    loadState.ready = true;
    const complete = badPacks.length === 0 &&
      words === 1545 && senses === 2257 && examples === 2257;
    if (!complete) {
      if (!badPacks.length) badPacks.push({
        path: 'aggregate', error: 'Unexpected counts: ' + words + '/' + senses + '/' + examples
      });
      console.error('Lexia precision drafts only partially loaded:', {
        loadedPacks: goodPacks.length, failedPacks: badPacks,
        words, senses, examples, expected: [1545, 2257, 2257]
      });
    }
    renderResults(); renderDetail();
    if (state.view === 'data') renderData();
  }
  window.addEventListener('DOMContentLoaded', load);
})();
