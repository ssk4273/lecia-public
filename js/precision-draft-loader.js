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

  // Cohort promoted to the same CURATED renderer as run. Review status remains explicit.
  const PROMOTION_META = {"accept":{"guide":"acceptは提案・申し出を受け入れる、事実を認める、支払い方法に対応するなど、目的語の種類で意味が変わる。","note":"accept an offer（申し出を受ける）とaccept responsibility（責任を引き受ける）を区別。","ipa":"/əkˈsept/"},"achieve":{"guide":"achieveは目標・成果を努力して達成する語。単に仕事を終えるfinishとは焦点が違う。","note":"achieve a goal / success。achieveは成果に到達することを表す。","ipa":"/əˈtʃiːv/"},"act":{"guide":"actは行動する、役を演じる、作用する。act asとact onでは前置詞で役割が変わる。","note":"act as a guide（案内役を務める）とact on advice（助言に従って行動する）。","ipa":"/ækt/"},"add":{"guide":"addは何を何に加えるかを確認する。add A to Bとadd that節を区別する。","note":"add A to B。add up toは合計・結果を表す。","ipa":"/æd/"},"agree":{"guide":"agreeは人・提案・意見・条件のどれに同意するかでwith/to/onが変わる。","note":"agree with a person / agree to a proposal / agree on a plan。","ipa":"/əˈɡriː/"},"allow":{"guide":"allowは人に行動を許すallow O to doと、物事を可能にするallow forを区別する。","note":"allow O to do。allow forは考慮に入れる。","ipa":"/əˈlaʊ/"},"answer":{"guide":"answerは質問・電話に答える動詞と、答え・解決策を表す名詞を分ける。","note":"answer a questionは前置詞不要。the answer to a question。","ipa":"/ˈænsər/"},"appear":{"guide":"appearは姿を現す、そう見える、出演する。appear to doとappear inを区別する。","note":"appear to beとit appears thatは推量。appear in a filmは出演。","ipa":"/əˈpɪr/"},"apply":{"guide":"applyは応募・申請するapply for、当てはまるapply to、塗る他動詞を区別する。","note":"apply for a job、apply to a university、apply a cream to skin。","ipa":"/əˈplaɪ/"},"ask":{"guide":"askは質問する、依頼する、求める。ask O to doとask for Nを区別する。","note":"ask a question、ask O to do、ask for help。","ipa":"/æsk/"},"avoid":{"guide":"avoidは危険・問題を避ける他動詞。後ろに動名詞を取る点に注意する。","note":"avoid doing（〜するのを避ける）。avoid to doは通常不可。","ipa":"/əˈvɔɪd/"},"bear":{"guide":"bearは耐える、負担する、産む、支える動詞と動物の熊を表す名詞を区別する。","note":"bear responsibility、bear in mind。名詞bear（熊）とは別の語義。","ipa":"/ber/"},"become":{"guide":"becomeは状態が変わる連結動詞と、似合うという他動詞用法を区別する。","note":"become + 形容詞/名詞。become someoneは「似合う」の他動詞にもなる。","ipa":"/bɪˈkʌm/"},"believe":{"guide":"believeは内容を信じるbelieve thatと、人を信用するbelieve inを区別する。","note":"believe someoneとbelieve in someoneの意味差に注意。","ipa":"/bɪˈliːv/"},"build":{"guide":"buildは建てる、築く、増やす。build upとbuild onの意味を文脈で確認する。","note":"build a house、build confidence、build up strength。","ipa":"/bɪld/"},"call":{"guide":"callは呼ぶ、電話する、名付ける、要求する。call O Cとcall forを区別する。","note":"call O C（OをCと呼ぶ）、call for help（助けを求める）。","ipa":"/kɔːl/"},"carry":{"guide":"carryは運ぶ、身につける、伝える、継続する。carry outとcarry onを区別する。","note":"carry a bag、carry out a plan、carry on working。","ipa":"/ˈkæri/"},"change":{"guide":"changeは変わる自動詞、変える他動詞、変化・釣り銭の名詞を区別する。","note":"change into（〜に変わる）、change A into B（AをBに変える）。","ipa":"/tʃeɪndʒ/"},"check":{"guide":"checkは確認する、抑制する、預けるなど。check inとcheck outも文脈で判断する。","note":"check the facts、check in at a hotel、check out。","ipa":"/tʃek/"},"choose":{"guide":"chooseは選ぶ・選択する。choose A over Bとchoose to doを区別する。","note":"choose to do、choose between A and B。","ipa":"/tʃuːz/"},"claim":{"guide":"claimは事実だと主張する、権利を請求する。claim thatとclaim damagesを区別する。","note":"claim that S Vは真偽未確定の主張にも使う。","ipa":"/kleɪm/"},"compare":{"guide":"compareは比較するcompare A with Bと、たとえるcompare A to Bの違いを押さえる。","note":"compare A with Bとcompare A to Bは重なる場合もある。","ipa":"/kəmˈper/"},"continue":{"guide":"continueは続く自動詞と続ける他動詞。continue to do/doingを確認する。","note":"continue doing/to doは多くの文脈で両方可能。","ipa":"/kənˈtɪnjuː/"},"create":{"guide":"createは新しい物・状況・機会を生み出す語。makeとの意味の重点の違いを見る。","note":"create opportunitiesとmake a decisionの自然な結び付きを意識。","ipa":"/kriˈeɪt/"},"cut":{"guide":"cutは切る、削減する、遮る。cut down onとcut offを区別する。","note":"cut costs、cut down on sugar、cut off the supply。","ipa":"/kʌt/"},"decide":{"guide":"decideは決定する。decide to do、decide on N、decide that節を区別する。","note":"decide to do、decide on a date、decide against doing。","ipa":"/dɪˈsaɪd/"},"depend":{"guide":"dependは頼るdepend on、状況次第であるdepend onを文脈で判断する。","note":"depend on circumstancesとdepend on someone for support。","ipa":"/dɪˈpend/"},"describe":{"guide":"describeは特徴・状況を言葉で描写する。describe A as Bの構文を確認する。","note":"describe a scene、describe A as B。describe aboutは通常不可。","ipa":"/dɪˈskraɪb/"},"develop":{"guide":"developは発達する・発達させる、開発する、病気を発症するなどを区別する。","note":"develop a product、develop skills、develop a disease。","ipa":"/dɪˈveləp/"},"discover":{"guide":"discoverは未知だった事実や物を発見する。discover that節とdiscover Oを区別する。","note":"discover a fact、discover that S V。invent（発明する）とは異なる。","ipa":"/dɪˈskʌvər/"},"discuss":{"guide":"discussは議論する他動詞。discuss the issueとdiscuss with someoneの構造を区別する。","note":"discuss a problemはabout不要。have a discussion about a problem。","ipa":"/dɪˈskʌs/"},"draw":{"guide":"drawは線を引く、引き寄せる、引き出す、引き分ける。目的語で意味を判断する。","note":"draw a picture、draw attention、draw a conclusion。","ipa":"/drɔː/"},"drive":{"guide":"driveは運転する、駆り立てる、追いやる。drive O to doとdrive O Cを区別する。","note":"drive a car、drive someone crazy、drive someone to act。","ipa":"/draɪv/"},"enable":{"guide":"enableは人・物に能力や機会を与える。enable O to doを中心に見る。","note":"enable O to do。enable doingのみでは意味が変わる。","ipa":"/ɪˈneɪbəl/"},"encourage":{"guide":"encourageは励ます、促進する。encourage O to doとencourage Nを区別する。","note":"encourage O to do、encourage participation。","ipa":"/ɪnˈkɜːrɪdʒ/"},"enjoy":{"guide":"enjoyは楽しむ、享受する。他動詞でenjoy doingを取り、enjoy to doとはしない。","note":"enjoy doing、enjoy oneself。enjoy to doは避ける。","ipa":"/ɪnˈdʒɔɪ/"},"establish":{"guide":"establishは組織を設立する、事実を確立する、関係を築く用法を区別する。","note":"establish a company、establish evidence、establish relations。","ipa":"/ɪˈstæblɪʃ/"},"explain":{"guide":"explainは理由・仕組みを説明する。explain A to Bとexplain why/howを区別する。","note":"explain the rule to me。explain me the ruleは標準的には不可。","ipa":"/ɪkˈspleɪn/"},"express":{"guide":"expressは気持ちを表す動詞、急行の名詞、速達・急行の形容詞を区別する。","note":"express an opinion、express train、express delivery。","ipa":"/ɪkˈspres/"},"face":{"guide":"faceは顔・表情・体面の名詞と、直面する・向く・対戦する他動詞を区別する。face Aは前置詞不要、be faced with Aは受動形に由来する表現。","note":"名詞faceの「表情」と「体面」は別義。face up toは困難に正面から向き合う。in the face ofは〜に直面して。face to faceは対面で。","ipa":"/feɪs/"}};
  const PROMOTED_WORDS = new Set(Object.keys(PROMOTION_META));
  window.LEXIA_PROMOTED_API = Object.freeze({
    words: () => [...PROMOTED_WORDS],
    status: () => ({ promoted: [...PROMOTED_WORDS].filter(w => Object.hasOwn(CURATED,w)).length, target: PROMOTED_WORDS.size })
  });
  function promoteCompleteCohort() {
    for (const word of PROMOTED_WORDS) {
      const draft = DRAFT[word];
      if (!draft || Object.hasOwn(CURATED,word)) continue;
      const m = PROMOTION_META[word];
      const entry = {word, ipa:m.ipa, guide:m.guide, note:m.note,
        review_status:'AI編集・独立辞書校閲待ち', groups:draft.groups.map(g=>({
          pos:g.pos, senses:g.senses.map(v=>({...v,
            label:v.label||'', contrast:v.contrast||'', register:v.register||''
          }))
        }))};

      // Face: split the misleading combined noun sense and add high-utility constructions.
      if (word === 'face') {
        const noun = entry.groups.find(g=>g.pos==='名詞');
        const verb = entry.groups.find(g=>g.pos==='他動詞');
        if (noun) {
          const combined=noun.senses.find(x=>x.jp==='表情・面目');
          if (combined) {
            combined.jp='面目・体面';
            combined.pattern='save face / lose face';
            combined.tip='周囲からの評価に関わる社会的な体面。顔の表情とは別の意味。';
            noun.senses.splice(noun.senses.indexOf(combined),0,{
              jp:'表情・顔つき',pattern:'a serious / worried face',
              tip:'顔に現れる感情や態度。社会的な体面を表すsave faceとは区別する。',
              examples:[
                {en:'She had a worried face when she heard the news.',ja:'その知らせを聞いたとき、彼女は心配そうな顔をしていた。'},
                {en:'His face showed no sign of fear.',ja:'彼の表情には恐怖の色がまったく見えなかった。'}
              ],label:'',contrast:'',register:''
            });
          }
          noun.senses.push({
            jp:'〜に直面して・〜にもかかわらず',pattern:'in the face of + 名詞',
            tip:'困難や反対などが存在する状況で、それに向き合うことを表す前置詞句。',
            examples:[
              {en:'She remained calm in the face of danger.',ja:'彼女は危険に直面しても冷静さを保った。'},
              {en:'They continued working in the face of strong opposition.',ja:'彼らは強い反対にもかかわらず作業を続けた。'}
            ],label:'熟語',contrast:'',register:''
          },{
            jp:'対面で・向かい合って',pattern:'face to face (with + 人)',
            tip:'人と直接向かい合って話したり会ったりする状況。',
            examples:[
              {en:'We finally met face to face.',ja:'私たちはようやく直接顔を合わせた。'},
              {en:'She spoke face to face with the manager.',ja:'彼女は支配人と直接向き合って話した。'}
            ],label:'熟語',contrast:'',register:''
          });
        }
        if (verb) verb.senses.push({
          jp:'困難に正面から向き合う',pattern:'face up to + 問題・事実',
          tip:'避けていた困難や不快な事実を認め、対処しようとする句動詞。',
          examples:[
            {en:'We need to face up to the problem.',ja:'私たちはその問題に正面から向き合う必要がある。'},
            {en:'He finally faced up to his mistakes.',ja:'彼はついに自分の過ちを正面から認めた。'}
          ],label:'句動詞',contrast:'face a problemも「問題に直面する」だが、face up toは回避せず受け止める意志を強調。',register:''
        },{
          jp:'〜に直面している',pattern:'be faced with + 問題・選択',
          tip:'困難・課題・選択を突き付けられた状態。受動形に由来する表現。',
          examples:[
            {en:'The city is faced with a serious housing shortage.',ja:'その都市は深刻な住宅不足に直面している。'},
            {en:'We were faced with a difficult choice.',ja:'私たちは難しい選択を迫られた。'}
          ],label:'構文',contrast:'face a problemと近いが、be faced withは状況に置かれていることに焦点を当てる。',register:''
        });
      }

      if (!precisionValidate(word,entry)) {console.error('Promotion rejected',word);continue;}
      CURATED[word] = entry;
    }
    precisionRecount();
  }

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
    promoteCompleteCohort();
    draftWords = words - [...PROMOTED_WORDS].filter(w=>Object.hasOwn(CURATED,w)).length; draftSenses = senses; draftExamples = examples;
    loadState.loadedPacks = goodPacks.length;
    loadState.failedPacks = badPacks;
    loadState.loadedWords = words;
    loadState.ready = true;
    const complete = badPacks.length === 0 && words === loadState.expectedWords;
    if (!complete) {
      if (!badPacks.length) badPacks.push({
        path: 'aggregate', error: 'Unexpected counts: ' + words + '/' + senses + '/' + examples
      });
      console.error('Lexia precision drafts only partially loaded:', {
        loadedPacks: goodPacks.length, failedPacks: badPacks,
        words, senses, examples, expectedWords: loadState.expectedWords
      });
    }
    renderResults(); renderDetail();
    if (state.view === 'data') renderData();
  }
  window.addEventListener('DOMContentLoaded', load);
})();
