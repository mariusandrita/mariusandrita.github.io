/* Compose a cooking workspace from the original document without rewriting its content. */
function composeRecipe(root, recipe, markdown) {
  const ro = language === 'ro';
  const words = ro ? {
    ingredients:'Ingrediente',method:'Mod de preparare',notes:'Note & poveste',prep:'Înainte să începi',
    time:'TIMP TOTAL',yield:'CANTITATE',origin:'ORIGINE',jump:'Să gătim',notebook:'DIN CAIETUL DE REȚETE',
    progress:'pași finalizați',check:'Bifează ingredientele pe măsură ce le pregătești.',
    extras:'Detaliile fac diferența.',extrasSub:'Sfaturi, povestea rețetei și sursele originale.',intro:'De reținut'
  } : {
    ingredients:'Ingredients',method:'The method',notes:'Notes & story',prep:'Before you begin',
    time:'TOTAL TIME',yield:'MAKES',origin:'ORIGIN',jump:'Let’s cook',notebook:'FROM THE RECIPE NOTEBOOK',
    progress:'steps complete',check:'Check off ingredients as you get them ready.',
    extras:'The details make the dish.',extrasSub:'Kitchen advice, the story, and the original sources.',intro:'Good to know'
  };
  // Assign stable identities before arranging the source document into columns.
  root.querySelectorAll('input[type=checkbox]').forEach((input,i)=>input.dataset.check=i);
  const nodes=[...root.children], opening=[], sections=[];
  let section=null;
  for(const node of nodes){
    if(node.tagName==='H2'){
      section={title:node.textContent,heading:node,nodes:[]};sections.push(section);
    } else if(section) section.nodes.push(node);else opening.push(node);
  }
  const ingredients=[],method=[],prep=[],extras=[];
  for(const item of sections){
    const title=norm(item.title);
    if(/^(ingredients|ingrediente)\b/.test(title)) ingredients.push(item);
    else if(/^(steps|pasi|day before|cooking day|cu o zi inainte|ziua gatitului)\b/.test(title))method.push(item);
    else if(/^(mise en place|pregatirea ingredientelor|the plan|planul)\b/.test(title))prep.push(item);
    else extras.push(item);
  }
  const originalTitle=opening.find(n=>n.tagName==='H1');
  const image=opening.flatMap(n=>[...n.querySelectorAll('img')])[0];
  const photoParagraph=image?.closest('p');
  let credit=null;
  if(photoParagraph){
    // Credits can follow the image inside the same Markdown paragraph.
    const next=photoParagraph.nextElementSibling;
    if(next?.tagName==='P' && /^(photo|foto|image|credit)/i.test(next.textContent.trim()))credit=next;
  }
  const description=opening.find(n=>n.tagName==='P'&&n!==photoParagraph&&n!==credit&&n.querySelector('em'));
  const remaining=opening.filter(n=>![originalTitle,photoParagraph,credit,description].includes(n)&&n.tagName!=='HR');
  const metadata=markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const servings=metadata?.[1].match(/^servings:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g,'');
  const view=document.createElement('article');view.className='recipe-layout';
  view.innerHTML=`<header class="recipe-intro"><figure class="recipe-cover"></figure><div class="recipe-summary"><p class="recipe-kicker">${words.notebook} <span> / ${String(recipes.indexOf(recipe)+1).padStart(2,'0')}</span></p><h1>${esc(recipe.title[language])}</h1><p class="recipe-description">${esc(description?.textContent||recipe.tagline[language])}</p><dl class="recipe-facts"><div><dt>${words.time}</dt><dd>${esc(recipe.time)}</dd></div>${servings?`<div><dt>${words.yield}</dt><dd>${esc(servings)}</dd></div>`:''}<div><dt>${words.origin}</dt><dd>${esc(recipe.country?.[language]||recipe.origin)}</dd></div></dl><button class="recipe-start" data-jump="recipe-method">${words.jump}<span>↓</span></button></div></header><nav class="recipe-nav" aria-label="${ro?'Secțiunile rețetei':'Recipe sections'}"><button data-jump="recipe-ingredients">01 <span>${words.ingredients}</span></button><button data-jump="recipe-method">02 <span>${words.method}</span></button><button data-jump="recipe-notes">03 <span>${words.notes}</span></button><span class="recipe-progress" aria-live="polite"></span></nav><div class="recipe-workspace"><aside id="recipe-ingredients" class="ingredient-panel"><div class="workspace-heading"><span>01</span><h2>${words.ingredients}</h2></div><p class="ingredient-hint">${words.check}</p><div class="ingredient-content"></div></aside><section id="recipe-method" class="method-panel"><div class="workspace-heading"><span>02</span><h2>${words.method}</h2></div><div class="before-cooking"></div><div class="method-content"></div></section></div><section id="recipe-notes" class="recipe-notes"><p class="recipe-kicker">03 / ${words.notes}</p><h2>${words.extras}</h2><p class="notes-description">${words.extrasSub}</p><div class="recipe-disclosures"></div></section></article>`;
  const figure=view.querySelector('figure');
  if(image){figure.append(image);const caption=document.createElement('figcaption');
    if(credit)caption.append(...credit.childNodes);
    else if(photoParagraph){for(const node of [...photoParagraph.childNodes])if(node!==image&&node.nodeName!=='BR')caption.append(node);}
    if(caption.textContent.trim())figure.append(caption);
  }else figure.remove();
  const moveSection=(item,target,heading=false)=>{if(heading){item.heading.classList.add('subsection-heading');target.append(item.heading);}target.append(...item.nodes);};
  ingredients.forEach(item=>moveSection(item,view.querySelector('.ingredient-content'),ingredients.length>1));
  const before=view.querySelector('.before-cooking');
  if(remaining.length){const disclosure=document.createElement('details');disclosure.className='before-note';disclosure.innerHTML=`<summary>${words.intro}</summary>`;disclosure.append(...remaining);before.append(disclosure);}
  prep.forEach(item=>{const d=document.createElement('details');d.className='prep-details';d.innerHTML=`<summary>${esc(item.title)}</summary>`;d.append(...item.nodes);before.append(d);});
  method.forEach(item=>moveSection(item,view.querySelector('.method-content'),method.length>1));
  let stepNumber=0;
  view.querySelectorAll('.method-content ol > li').forEach(li=>{li.classList.add('method-step');li.dataset.stepNumber=++stepNumber;});
  extras.forEach(item=>{const d=document.createElement('details');d.className='recipe-detail';d.innerHTML=`<summary><span>${esc(item.title)}</span><span class="disclosure-plus" aria-hidden="true">+</span></summary><div class="detail-body"></div>`;d.querySelector('.detail-body').append(...item.nodes);view.querySelector('.recipe-disclosures').append(d);});
  root.replaceChildren(view);
  root.querySelectorAll('[data-jump]').forEach(btn=>btn.onclick=()=>root.querySelector('#'+btn.dataset.jump)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
  root.querySelectorAll('input[data-check]').forEach(input=>{input.disabled=false;input.checked=read(`check:${recipe.slug}:${language}:${input.dataset.check}`,false);});
  function progress(){const checks=[...root.querySelectorAll('.method-content input[data-check]')];const count=checks.filter(c=>c.checked).length;root.querySelector('.recipe-progress').textContent=checks.length?`${count} / ${checks.length} ${words.progress}`:'';root.querySelectorAll('.method-step').forEach(li=>li.classList.toggle('step-done',!!li.querySelector('input[data-check]')?.checked));}
  if(root._recipeProgress)root.removeEventListener('change',root._recipeProgress);root._recipeProgress=progress;root.addEventListener('change',progress);progress();
  return progress;
}
