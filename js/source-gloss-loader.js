'use strict';
/* Lexia: source-derived short glosses. NOT a lexical review or precision entry. */
const SOURCE_GLOSS = Object.create(null);
let sourceGlossCount = 0;
let sourceUnresolvedCount = 0;
const SOURCE_UNRESOLVED = Object.create(null);
let sourceGlossLoadError = false;
const sourceGlossFiles = [
 './editorial/source-gloss/2026-11-10-10000-a-i.json',
 './editorial/source-gloss/2026-11-10-10000-j-r.json',
 './editorial/source-gloss/2026-11-10-10000-s-z.json',
 './editorial/source-gloss/2026-11-10-rest-a-d.json',
 './editorial/source-gloss/2026-11-10-rest-e-i.json',
 './editorial/source-gloss/2026-11-10-rest-j-r.json',
 './editorial/source-gloss/2026-11-10-rest-s-z.json'
];
const sourceGlossPreviousDetail = renderDetail;
renderDetail = function() {
  sourceGlossPreviousDetail();
  const key = clean(state.current);
  if (window.LEXIA_DRAFT_API?.has(key)) return;
  const e = SOURCE_GLOSS[key];
  if ((!e && !SOURCE_UNRESOLVED[key]) || Object.hasOwn(PRIMARY,key) || Object.hasOwn(CURATED,key)) return;
  const root = el('detail');
  const body = root?.querySelector('.detail-body');
  if (!body) return;
  // Preserve the original EJDict text and existing precision/primary layers.
  if (!e && SOURCE_UNRESOLVED[key]) {
    body.insertAdjacentHTML('afterbegin',
      '<div class="lex-brief-warning">短い日本語訳は未整備です。略語・参照見出し等のため、下の原資料をご確認ください（自動処理済み・意味校閲未完了）。</div>');
    return;
  }
  const chip = root.querySelector('.source-chip');
  if (chip && records.get(key)?.source !== 'ejdict') chip.textContent = 'EJDict由来の短訳';
  body.insertAdjacentHTML('afterbegin',
    '<section class="lex-primary" aria-label="出典由来の短訳">' +
    '<div class="lex-primary-heading"><strong>意味の早見</strong><span class="lex-primary-status">' +
    (e.review_status ? 'AI補助・未校閲' : '自動抽出・未校閲') + '</span></div>' +
    '<div class="lex-primary-pos">' + escapeHTML(e.pos) + '</div>' +
    '<div class="lex-primary-gloss">' + escapeHTML(e.jp) + '</div>' +
    '<p class="lex-primary-limit">EJDict（CC0）の原資料をもとに、機械抽出またはAI補助で作成した未校閲の短訳です。多義語・品詞・用法・表記の正確性は未検証です。詳細は下の原資料もご確認ください。</p>' +
    '</section>');
};
const sourceGlossPreviousResults = renderResults;
renderResults = function() {
  sourceGlossPreviousResults();
  for (const row of el('results')?.querySelectorAll('[data-select]') || []) {
    const key = clean(row.dataset.select), e = SOURCE_GLOSS[key];
    if (window.LEXIA_DRAFT_API?.has(key) || Object.hasOwn(PRIMARY,key) || Object.hasOwn(CURATED,key)) continue;
    const label = row.querySelector('.result-meaning');
    if (label && e) label.textContent = e.jp + (e.review_status ? ' · AI補助・未校閲' : ' · 出典由来の短訳');
    else if (label && SOURCE_UNRESOLVED[key]) label.textContent = '短訳未整備 · 原資料を参照';
  }
};
const sourceGlossPreviousData = renderData;
renderData = function() {
  sourceGlossPreviousData();
  const panel = el('alt-view')?.querySelector('.alt-panel');
  if (!panel) return;
  const detail = sourceGlossCount
    ? sourceGlossCount.toLocaleString('ja-JP') + '語（出典由来・自動／AI補助・未校閲）'
    : (sourceGlossLoadError ? '読み込み失敗・再接続が必要' : '読み込み中');
  panel.insertAdjacentHTML('afterbegin',
    '<div class="lex-primary-stats" id="lex-source-gloss-stats">' +
    '<strong>短い日本語訳の追加整備：' + detail + '</strong><br>' +
    '短訳の抽出ができず保留した見出し：' + sourceUnresolvedCount.toLocaleString('ja-JP') + '語。新規検索見出し数ではありません。精密編集42語と一次編集1,071語は保持しています。' +
    '</div>');
};
const sourceGlossPreviousCopy = copyCurrent;
copyCurrent = async function() {
  const key = clean(state.current), e = SOURCE_GLOSS[key];
  if (!e || Object.hasOwn(PRIMARY,key) || Object.hasOwn(CURATED,key)) return sourceGlossPreviousCopy();
  try {
    await navigator.clipboard.writeText([key, e.jp, e.pos, e.review_status ? 'EJDict原資料をもとにAI補助で作成・未校閲' : 'EJDict原資料からの自動抽出・未校閲'].join('\n'));
    showToast('短い訳をコピーしました');
  } catch { showToast('コピーできませんでした'); }
};
async function sourceGlossLoad() {
  try {
    const packs = await Promise.all(sourceGlossFiles.map(async path => {
      const response = await fetch(path, {cache:'no-cache'});
      if (!response.ok) throw new Error('Gloss pack HTTP ' + response.status);
      return response.json();
    }));
    const accepted = Object.create(null), unresolved = Object.create(null);
    let count = 0, pendingCount = 0;
    for (const pack of packs) {
      const oldPack = pack.kind === 'source_derived_quickgloss' &&
        pack.status === 'auto_extracted_pending_human_review' &&
        Number.isInteger(pack.count) && pack.count === pack.entries?.length;
      const restPack = pack.kind === 'source_derived_quickgloss_remainder' &&
        pack.status === 'machine_extracted_unreviewed' &&
        pack.reviewed_entries === 0 && Array.isArray(pack.unresolved);
      if ((!oldPack && !restPack) || !Array.isArray(pack.entries))
        throw new Error('Gloss pack metadata');
      for (const e of pack.entries) {
        if (!e || typeof e.word !== 'string' || e.word.length > 120 ||
            clean(e.word) !== e.word || typeof e.jp !== 'string' ||
            !e.jp.trim() || typeof e.pos !== 'string' || !e.pos ||
            Object.hasOwn(accepted,e.word) || Object.hasOwn(unresolved,e.word) ||
            Object.hasOwn(PRIMARY,e.word) || Object.hasOwn(CURATED,e.word))
          throw new Error('Gloss pack schema/overlap');
        accepted[e.word] = Object.freeze({jp:e.jp,pos:e.pos,review_status:e.review_status || ''});
        count++;
      }
      if (restPack) for (const word of pack.unresolved) {
        if (typeof word !== 'string' || !word || clean(word) !== word ||
            Object.hasOwn(accepted,word) || Object.hasOwn(unresolved,word) ||
            Object.hasOwn(PRIMARY,word) || Object.hasOwn(CURATED,word))
          throw new Error('Unresolved gloss overlap/schema');
        unresolved[word] = true;
        pendingCount++;
      }
    }
    if (count !== 45523 || pendingCount !== 0)
      throw new Error('Unexpected auto-gloss/pending counts: ' + count + '/' + pendingCount);
    for (const [word,e] of Object.entries(accepted)) {
      SOURCE_GLOSS[word] = e;
      if (!records.has(word)) insert(word, e.jp, 'basic');
    }
    for (const word of Object.keys(unresolved)) SOURCE_UNRESOLVED[word] = true;
    sourceGlossCount = count;
    sourceUnresolvedCount = pendingCount;
    badgeUpdate();
    renderResults();
    renderDetail();
    if (state.view === 'data') renderData();
  } catch (err) {
    sourceGlossLoadError = true;
    if (state.view === 'data') renderData();
    console.error('Lexia source-gloss load:', err);
  }
}
window.addEventListener('DOMContentLoaded', sourceGlossLoad);
