import { appendElement, getElOr, safeSelect } from './element';
import { tofNode } from './type-check';

export default class ShadowDom {

	el = null;
	root = null;
	inserts = [];
	rootInsert = null;

	constructor(opts) {
		this.setParams(opts);
		this.el.attachShadow({ mode: 'open' });
		this.root = this.el.shadowRoot;
		this.rootInsert = this.root;
	}

	setParams(opts) {
		this.el = null;
		this.opts = { selector: '.shadow-rooted' };
		opts instanceof HTMLElement
			? this.setElement(opts)
			: this.setOptions(opts).setElement()
	}

	setOptions(opts) {
		Object.keys(opts).map(key => this.setOption(key, opts[key]));
		return this;
	}

	setOption(name, value) {
		this.opts[name] = value
			? value
			: this.opts[name];
	}

	setElement(element) {
		this.el = getElOr(element, this.opts.selector);
	}

	insert(obj, selector) {
		this.pushInsert(this.getInsert(obj, selector));
		return this;
	}

	pushInsert(element) {
		this.inserts.push(element);
	}

	getInsert(obj, selector) {
		return appendElement(obj, this.getCurrentElement(selector))
	}

	bringInserts() {
		let inserts = [...this.inserts];
		this.inserts = [];
		return inserts;
	}

	/**
	 * Get Node element type based on selector parameter. Save insert source depends on magic word, selector or Node.
	 * @param selector
	 * @returns {null}
	 */
	getCurrentElement(selector) {
		return this.setInsert(selector).queryCurrentRoot();
	}

	setInsert(source) {
		this.rootInsert = source
            ? (source !== 'ShadowRoot' ? source : this.root)
            : this.rootInsert;
		return this;
	}

	queryCurrentRoot() {
		return tofNode(this.rootInsert)
		       ? this.rootInsert
		       : safeSelect(this.root, this.rootInsert);
	}
}