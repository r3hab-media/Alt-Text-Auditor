async function scan() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab?.id) return;

	const injections = await chrome.scripting.executeScript({
		target: { tabId: tab.id, allFrames: true },
		func: () => {
			function cssPath(el) {
				if (!el || el.nodeType !== 1) return "";
				const parts = [];
				let node = el;
				while (node && node.nodeType === 1 && node !== document.documentElement) {
					let selector = node.nodeName.toLowerCase();
					if (node.id) {
						selector += "#" + CSS.escape(node.id);
						parts.unshift(selector);
						break;
					}
					let nth = 1;
					let sib = node;
					while ((sib = sib.previousElementSibling) !== null) {
						if (sib.nodeName === node.nodeName) nth++;
					}
					selector += `:nth-of-type(${nth})`;
					parts.unshift(selector);
					node = node.parentElement;
				}
				return parts.join(" > ");
			}

			const imgs = Array.from(document.querySelectorAll("img"));
			const results = imgs
				.filter((img) => {
					const alt = img.getAttribute("alt");
					const isDecorative =
						(img.getAttribute("role") || "").toLowerCase() === "presentation" || (img.getAttribute("aria-hidden") || "").toLowerCase() === "true";
					return !isDecorative && (alt === null || alt.trim() === "");
				})
				.map((img) => ({
					src: img.currentSrc || img.src || "",
					alt: img.getAttribute("alt"),
					width: img.naturalWidth || img.width || null,
					height: img.naturalHeight || img.height || null,
					path: cssPath(img),
					documentUrl: document.location.href,
				}));

			return { total: imgs.length, missing: results.length, results };
		},
	});

	let totalImgs = 0;
	let totalMissing = 0;
	const rows = [];
	for (const r of injections) {
		const data = r.result || { total: 0, missing: 0, results: [] };
		totalImgs += data.total;
		totalMissing += data.missing;
		for (const item of data.results) rows.push(item);
	}

	const summary = document.getElementById("summary");
	summary.textContent = `Images scanned: ${totalImgs}. Missing alt: ${totalMissing}.`;

	const ul = document.getElementById("results");
	ul.innerHTML = "";
	if (!rows.length) {
		const li = document.createElement("li");
		li.className = "card";
		li.textContent = "No missing alt text found.";
		ul.appendChild(li);
		return;
	}

	for (const item of rows) {
		const li = document.createElement("li");
		li.className = "card";
		const altLabel = item.alt === null ? "null (attribute missing)" : `"${item.alt}"`;
		const dims = `${item.width || "?"}×${item.height || "?"}`;
		li.innerHTML = `
      <img class="thumb" src="${item.src}" alt="" loading="lazy" referrerpolicy="no-referrer">
    `;
		ul.appendChild(li);
	}
}

// document.getElementById("scan").addEventListener("click", scan);
scan();
