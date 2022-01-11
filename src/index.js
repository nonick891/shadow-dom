export default class ShadowDom {

	constructor(opts) {
		this.setParams(opts);
		this.el.attachShadow({ mode: 'open' });
	}

	setParams(opts) {
		this.el = null;
		this.opts = { selector: '.shadow-rooted' };
		opts instanceof HTMLElement
			? this.setElement(opts)
			: this.setOptions(opts).setElement()
	}

	setOptions(opts) {
		Object.keys(opts).map(key =>
			this.setOption(key, opts[key])
		);
		return this;
	}

	setOption(name, value) {
		this.opts[name] = value
			? value
			: this.opts[name];
	}

	setElement(element) {
		this.el = element instanceof HTMLElement
			? element
			: this.getDefaultElem();
	}

	getDefaultElem() {
		return document.body.querySelector(this.opts.selector);
	}
}