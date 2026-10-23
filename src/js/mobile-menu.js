// Mobilni meni (< 992 px) — off-canvas dialog s skladom panelov (SPEC §2–§10).
// Markup: templates/_includes/mobile-menu.twig · slogi: src/scss/_mobileMenu.scss

// Začasno stikalo za staging (MMV2-GATE v site-header.twig): ?mm=2 vklopi nov meni za sejo, ?mm=0 ga izklopi.
const mmParam = new URLSearchParams(location.search).get('mm');
if (mmParam === '2') document.cookie = 'mm2=1; path=/; SameSite=Lax';
else if (mmParam === '0') document.cookie = 'mm2=; path=/; max-age=0; SameSite=Lax';

const mm = document.getElementById('mm');
const openBtn = document.getElementById('mmOpen');
if (mm && openBtn) initMobileMenu(mm, openBtn);

function initMobileMenu(mm, openBtn) {
	// Dialog je vključen za </header> (globoko v .body-wrap); premaknemo ga v <body>, da inert in position:fixed delujeta.
	document.body.appendChild(mm);

	const header = document.getElementById('mainHeader');
	const drawer = document.getElementById('mmDrawer'), backdrop = mm.querySelector('.mm-backdrop');
	const xBtn = mm.querySelector('.mm-x');
	const panels = {}, triggerOf = {};
	mm.querySelectorAll('.mm-panel').forEach(p => { panels[p.dataset.panel] = p; });
	mm.querySelectorAll('[data-mm-push]').forEach(b => { triggerOf[b.dataset.mmPush] = b; });

	/* ── motion (SPEC §4) ── */
	const mq = matchMedia('(prefers-reduced-motion: reduce)');
	let RM = mq.matches; mq.addEventListener?.('change', e => RM = e.matches);
	const T = {open:340, close:260, push:320, pop:280, bIn:280, bOut:220, rmFade:140, stagger:22, staggerMax:8, itemDur:300, itemDist:20};
	const EASE = 'cubic-bezier(.32,.72,0,1)', EXIT = 'cubic-bezier(.4,0,.7,.2)', LINEAR_OUT = 'cubic-bezier(.2,0,0,1)';
	const PAR = -28, PAR_OP = .55;
	const ROWS = '.mm-feat, .mm-list > li, .mm-foot'; // vrstice, ki se zamaknjeno pojavijo

	let stack = ['root'], busy = false, isOpen = false, scrollY0 = 0, locked = false;

	function anim(el, kf, opt) { return el.animate(kf, Object.assign({fill:'both'}, opt)); }
	// Ob koncu nastavi znano mirovno stanje (inline slog) in odstrani animacijo — brez commitStyles(), ki na iOS Safari
	// lahko pusti element narisan v vmesnem stanju. Preklicana animacija (reset) ne sproži nadaljevanja.
	function settle(a, rest = {transform:'', opacity:''}) {
		return new Promise(res => a.finished.then(() => { Object.assign(a.effect.target.style, rest); a.cancel(); res(); }, () => {}));
	}

	function lockScroll() {
		if (locked) return; locked = true; scrollY0 = scrollY;
		Object.assign(document.body.style, {position:'fixed', top:-scrollY0 + 'px', left:'0', right:'0', overflow:'hidden'});
	}
	function unlockScroll() {
		if (!locked) return; locked = false;
		Object.assign(document.body.style, {position:'', top:'', left:'', right:'', overflow:''});
		scrollTo({top:scrollY0, left:0, behavior:'instant'});
	}
	function measure() { if (header) mm.style.setProperty('--hd-h', Math.round(header.getBoundingClientRect().bottom) + 'px'); }
	function placeX() { const r = openBtn.getBoundingClientRect(); Object.assign(xBtn.style, {top:r.top + 'px', left:r.left + 'px'}); }
	function setInert(on) { document.querySelectorAll('body > :not(#mm):not(script)').forEach(n => { on ? n.setAttribute('inert', '') : n.removeAttribute('inert'); }); }
	function clearLoading() { mm.querySelectorAll('.is-loading').forEach(n => { n.classList.remove('is-loading'); n.removeAttribute('aria-busy'); }); }

	// Sklad nazaj na koren (namesto render() iz prototipa — markup je izrisan na strežniku).
	function resetStack() {
		stack = ['root'];
		Object.keys(panels).forEach(id => {
			const p = panels[id];
			p.getAnimations({subtree:true}).forEach(a => a.cancel());
			p.hidden = id !== 'root'; p.classList.remove('is-entering', 'is-below');
			p.style.transform = ''; p.style.opacity = '';
			p.querySelectorAll(ROWS).forEach(r => { r.style.transform = ''; r.style.opacity = ''; });
		});
		Object.values(triggerOf).forEach(t => t.setAttribute('aria-expanded', 'false'));
		clearLoading();
	}

	// Vrstice: fill 'backwards' (začetno stanje le med zamikom, po koncu ne ostane nič), brez commitStyles;
	// varnostni timeout animacijo vseeno prekliče, če se na iOS ne bi pravilno zaključila.
	function staggerIn(panel, delay) {
		if (RM) return;
		const rows = [...panel.querySelectorAll(ROWS)].slice(0, T.staggerMax + 1);
		rows.forEach((r, i) => {
			const d = delay + i * T.stagger;
			r.style.transform = ''; r.style.opacity = '';
			const a = r.animate([{transform:`translateX(${T.itemDist}px)`, opacity:0}, {transform:'none', opacity:1}], {duration:T.itemDur, delay:d, easing:EASE, fill:'backwards'});
			setTimeout(() => a.cancel(), d + T.itemDur + 100);
		});
	}

	function open() {
		if (isOpen || busy) return; busy = true; isOpen = true;
		resetStack();
		measure(); placeX(); mm.hidden = false; document.body.classList.add('mm-open');
		openBtn.classList.add('is-hidden'); openBtn.setAttribute('aria-expanded', 'true');
		void xBtn.offsetWidth; // izračun slogov pred dodajanjem .is-x, da se burger → X animira
		requestAnimationFrame(() => xBtn.classList.add('is-x'));
		if (history.state?.mm !== 1) history.pushState({mm:1}, '');
		lockScroll(); setInert(true);
		panels.root.scrollTop = 0;
		mm.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; }); // sličice storitev pred prvim push
		const d = RM ? anim(drawer, [{transform:'none', opacity:0}, {transform:'none', opacity:1}], {duration:T.rmFade, easing:'linear'})
		             : anim(drawer, [{transform:'translateX(100%)'}, {transform:'translateX(0)'}], {duration:T.open, easing:EASE});
		settle(anim(backdrop, [{opacity:0}, {opacity:1}], {duration:RM ? T.rmFade : T.bIn, easing:LINEAR_OUT}), {opacity:'1'});
		staggerIn(panels.root, 70);
		settle(d, {transform:'translateX(0)', opacity:''}).then(() => { busy = false; xBtn.focus({preventScroll:true}); });
	}
	function close(opts = {}) {
		if (!isOpen) return; isOpen = false; busy = true;
		xBtn.classList.remove('is-x');
		const d = RM ? anim(drawer, [{opacity:1}, {opacity:0}], {duration:T.rmFade, easing:'linear'})
		             : anim(drawer, [{transform:getComputedStyle(drawer).transform === 'none' ? 'translateX(0)' : getComputedStyle(drawer).transform}, {transform:'translateX(100%)'}], {duration:opts.fast ? 180 : T.close, easing:EXIT});
		settle(anim(backdrop, [{opacity:getComputedStyle(backdrop).opacity}, {opacity:0}], {duration:RM ? T.rmFade : T.bOut, easing:'linear'}), {opacity:''});
		settle(d).then(() => {
			mm.hidden = true; document.body.classList.remove('mm-open');
			openBtn.classList.remove('is-hidden'); openBtn.setAttribute('aria-expanded', 'false');
			setInert(false); unlockScroll(); busy = false;
			if (!opts.noFocus) openBtn.focus({preventScroll:true});
			if (!opts.fromPop && history.state?.mm) selfBack(historyDepth());
		});
	}
	function push(id) {
		if (busy) return; const from = panels[stack.at(-1)], to = panels[id]; if (!to) return;
		busy = true; stack.push(id);
		const trig = triggerOf[id]; trig && trig.setAttribute('aria-expanded', 'true');
		to.hidden = false; to.scrollTop = 0; to.classList.add('is-entering'); from.classList.add('is-below');
		let a, b;
		if (RM) { a = anim(to, [{opacity:0, transform:'none'}, {opacity:1, transform:'none'}], {duration:T.rmFade, easing:'linear'}); b = anim(from, [{opacity:1}, {opacity:0}], {duration:T.rmFade}); }
		else { a = anim(to, [{transform:'translateX(100%)'}, {transform:'translateX(0)'}], {duration:T.push, easing:EASE});
		       b = anim(from, [{transform:'translateX(0)', opacity:1}, {transform:`translateX(${PAR}%)`, opacity:PAR_OP}], {duration:T.push, easing:EASE}); }
		staggerIn(to, 90);
		Promise.all([settle(a), settle(b)]).then(() => { from.hidden = true; from.classList.remove('is-below'); to.classList.remove('is-entering'); busy = false;
			to.querySelector('.mm-h').focus({preventScroll:true}); });
		history.pushState({mm:1, depth:stack.length - 1}, '');
	}
	function pop(opts = {}) {
		if (busy || stack.length < 2) return; busy = true;
		const cur = panels[stack.at(-1)], prev = panels[stack.at(-2)];
		prev.hidden = false; prev.classList.add('is-below'); cur.classList.add('is-entering');
		let a, b;
		if (RM) { a = anim(cur, [{opacity:1}, {opacity:0}], {duration:T.rmFade}); b = anim(prev, [{opacity:0, transform:'none'}, {opacity:1, transform:'none'}], {duration:T.rmFade}); }
		else { a = anim(cur, [{transform:'translateX(0)'}, {transform:'translateX(100%)'}], {duration:T.pop, easing:EASE});
		       b = anim(prev, [{transform:`translateX(${PAR}%)`, opacity:PAR_OP}, {transform:'translateX(0)', opacity:1}], {duration:T.pop, easing:EASE}); }
		Promise.all([settle(a), settle(b)]).then(() => {
			const id = stack.pop(); const trig = triggerOf[id];
			cur.hidden = true; cur.classList.remove('is-entering'); prev.classList.remove('is-below');
			trig && trig.setAttribute('aria-expanded', 'false'); busy = false;
			trig && trig.focus({preventScroll:true});
		});
		if (!opts.fromPop && history.state?.depth) selfBack();
	}

	// Takojšnja ponastavitev brez animacij (bfcache, preklop na ≥ 992 px).
	function hardReset() {
		[drawer, backdrop].forEach(el => el.getAnimations().forEach(a => a.cancel()));
		resetStack();
		drawer.style.transform = ''; drawer.style.opacity = ''; backdrop.style.opacity = '';
		xBtn.classList.remove('is-x');
		mm.hidden = true; document.body.classList.remove('mm-open');
		openBtn.classList.remove('is-hidden'); openBtn.setAttribute('aria-expanded', 'false');
		setInert(false); unlockScroll();
		isOpen = false; busy = false;
	}

	/* ── dogodki ── */
	openBtn.addEventListener('click', open);
	mm.addEventListener('click', e => {
		const t = e.target.closest('[data-mm-close],[data-mm-back],[data-mm-push],[data-mm-leaf],a[href^="tel:"],a[href^="mailto:"]'); if (!t) return;
		if (t.matches('[data-mm-close]')) return close();
		if (t.matches('[data-mm-back]')) return pop();
		if (t.matches('[data-mm-push]')) return push(t.dataset.mmPush);
		// tel:/mailto: — meni se takoj zapre, povezavo obdela sistem
		if (t.matches('a[href^="tel:"],a[href^="mailto:"]')) return close();
		if (t.matches('[data-mm-leaf]')) {
			// trenutna stran: samo zapri
			if (t.getAttribute('aria-current') === 'page') { e.preventDefault(); return close(); }
			// odpiranje v novem zavihku: brez stanja nalaganja
			if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			// brez preventDefault — brskalnik navigira, nova stran se naloži z zaprtim menijem
			t.classList.add('is-loading'); t.setAttribute('aria-busy', 'true');
		}
	});
	document.addEventListener('keydown', e => {
		if (!isOpen) return;
		if (e.key === 'Escape') { e.preventDefault(); close(); }
		if (e.key === 'Tab') { /* focus trap: X + aktivni panel */
			const panel = panels[stack.at(-1)];
			const f = [xBtn, ...panel.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(n => n.offsetParent !== null || n === xBtn);
			const first = f[0], last = f.at(-1);
			if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
			else if (!mm.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
		}
	});

	// Zgodovina: odpiranje/push dodata vnos; ko zapiramo sami, se vrnemo nazaj in naslednji popstate ignoriramo.
	let ignorePop = 0;
	function historyDepth() { return (history.state?.depth || 0) + 1; }
	function selfBack(n = 1) { ignorePop++; history.go(-n); }
	if (history.state?.mm) history.replaceState(null, '');
	addEventListener('popstate', () => { if (ignorePop) { ignorePop--; if (!locked) scrollTo({top:scrollY0, left:0, behavior:'instant'}); return; } if (!isOpen) return; if (stack.length > 1) pop({fromPop:true}); else close({fromPop:true}); });
	addEventListener('pageshow', e => {
		if (!e.persisted) return; /* obnova iz bfcache: takojšnja ponastavitev */
		hardReset(); ignorePop = 0;
		if (history.state?.mm) history.replaceState(null, '');
	});
	addEventListener('resize', () => {
		if (!isOpen) return;
		measure(); placeX();
		if (innerWidth >= 992) { const n = history.state?.mm ? historyDepth() : 0; hardReset(); if (n) selfBack(n); }
	});
}
